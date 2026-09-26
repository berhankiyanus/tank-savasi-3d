import { fetchWithTimeout } from '../net/http.mjs';
// Game audio owns its lifecycle and mix. Purchased sounds are optional and local-only
// until license evidence is approved; there are no third-party URLs in release code.
export const level = (v, fallback = 1) => Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : fallback;
export function previewEnabled(href) {
  try { const u = new URL(href); return u.protocol === 'http:' && ['localhost','127.0.0.1','[::1]'].includes(u.hostname) && u.searchParams.get('audio') === 'preview'; }
  catch { return false; }
}
export function mixLevels(s, scene = 'menu', paused = false, hidden = false) {
  const enabled = !s.muted && !hidden;
  return {
    effects: enabled ? level(s.volSfx, .8) * .72 : 0,
    music: enabled && s.music !== false ? level(s.volMusic, .65) * (scene === 'battle' ? .38 : .62) * (paused ? .42 : 1) : 0,
    engine: enabled && scene === 'battle' && !paused ? level(s.volEngine, .35) * .20 : 0,
  };
}
export function spatialMix(position, listener) {
  if (!position || !listener || !Number.isFinite(position.x) || !Number.isFinite(position.z)) return {gain:1,pan:0};
  const dx = position.x-listener.x, dz = position.z-listener.z, distance = Math.hypot(dx,dz);
  return {gain:Math.max(.16, 1/(1+Math.max(0,distance-5)*.055)),pan:Math.max(-.65,Math.min(.65,dx/32))};
}
const POLICY = {
  fire:{gap:.055,max:4,gain:.64,priority:3}, impact:{gap:.055,max:4,gain:.36,priority:2},
  bounce:{gap:.065,max:3,gain:.34,priority:2}, destroy:{gap:.12,max:2,gain:.68,priority:4},
  ui:{gap:.07,max:1,gain:.18,priority:1}, coin:{gap:.14,max:1,gain:.21,priority:1},
  equip:{gap:.18,max:1,gain:.26,priority:1}, wave:{gap:.8,max:1,gain:.25,priority:2},
  win:{gap:1,max:1,gain:.32,priority:4}, lose:{gap:1,max:1,gain:.25,priority:4},
};
export class VoiceBudget {
  constructor(max=12) { this.max=max; this.voices=[]; this.last=new Map(); }
  claim(kind, now, duration, priority=POLICY[kind]?.priority||1) {
    this.voices=this.voices.filter(v=>v.end>now);
    const policy=POLICY[kind]||POLICY.impact;
    if(now-(this.last.get(kind)??-Infinity)<policy.gap)return null;
    const peers=this.voices.filter(v=>v.kind===kind);
    let victim=peers.length>=policy.max ? peers[0] : null;
    if(!victim && this.voices.length>=this.max)victim=[...this.voices].sort((a,b)=>a.priority-b.priority||a.end-b.end)[0];
    if(victim){if(victim.priority>priority)return null;victim.stop?.();this.voices=this.voices.filter(v=>v!==victim);}
    const voice={kind,priority,end:now+duration,stop:null};this.voices.push(voice);this.last.set(kind,now);return voice;
  }
  release(voice) { this.voices=this.voices.filter(v=>v!==voice); }
  clear() { for(const v of this.voices)v.stop?.();this.voices=[];this.last.clear(); }
}

// Quiet original fallback for missing/unavailable samples. No square/saw oscillators.
function fallbackBuffer(ac, kind) {
  const durations={fire:.28,impact:.16,bounce:.12,destroy:.85,ui:.045,coin:.22,equip:.14,wave:.42,win:.65,lose:.5};
  const duration=durations[kind]||.2, buffer=ac.createBuffer(1,Math.ceil(ac.sampleRate*duration),ac.sampleRate), out=buffer.getChannelData(0);
  let low=0;
  for(let i=0;i<out.length;i++){
    const t=i/ac.sampleRate, x=t/duration, attack=Math.min(1,t/.004);
    low+=.10*((Math.random()*2-1)-low);
    if(['fire','impact','destroy','equip'].includes(kind)){
      const f=kind==='destroy'?60:kind==='fire'?105:180;
      out[i]=attack*Math.exp(-x*7)*(.24*Math.sin(2*Math.PI*f*t-40*t*t)+low*.9);
    }else{
      const base=kind==='bounce'?1250:kind==='ui'?360:kind==='lose'?260:520;
      const step=kind==='win'?Math.floor(x*3)*.125:kind==='coin'&&x>.4?.25:0;
      out[i]=attack*Math.exp(-x*6)*.18*Math.sin(2*Math.PI*base*(1+step)*t);
    }
  }
  return buffer;
}

export class GameAudio {
  constructor({settings,href='',fetcher=globalThis.fetch,Context=globalThis.AudioContext||globalThis.webkitAudioContext,createMedia=()=>new Audio(),onStatus=()=>{}}) {
    Object.assign(this,{settings,fetcher,Context,createMedia,onStatus});
    this.fetcher=fetcher?.bind(globalThis);
    this.preview=previewEnabled(href);this.previewState=this.preview?'loading':'off';
    this.ac=null;this.hidden=false;this.unlocked=false;this.scene='menu';this.paused=false;this.listener=null;
    this.budget=new VoiceBudget();this.buffers=new Map();this.fallbacks=new Map();this.errors=new Set();this.variants=new Map();
    this.manifest=null;this.slots=[];this.activeSlot=null;this.musicScene='';this.musicIndex=0;this.lastUpdate=-Infinity;this.ambientNext=0;
    this.preparePromise=this.prepare();
  }
  async prepare() {
    if(!this.preview)return;
    try {
      const m=await fetchWithTimeout('/_audio-preview/manifest.json',{cache:'no-store'},5000,this.fetcher,async res=>{if(!res.ok)throw Error('HTTP '+res.status);return res.json();});
      if(m.version!==1||m.licenseStatus!=='pending-local-preview'||!m.tracks||!m.music||!m.cues)throw Error('invalid manifest');
      for(const v of Object.values(m.tracks))if(!/^\/_audio-preview\/[a-z0-9-]+\.(wav|m4a)$/.test(v.url))throw Error('invalid track');
      this.manifest=m;this.previewState='ready';if(this.ac)this.loadEffects();
    }catch(error){this.previewState='unavailable';this.previewReason=error.message;}
    this.notify();
  }
  notify() { this.onStatus({preview:this.preview,state:this.previewState,reason:this.previewReason||'',loaded:this.buffers.size,errors:this.errors.size,track:this.activeSlot?.title||'',voices:this.budget.voices.length}); }
  unlock() {
    if(this.hidden)return;
    this.unlocked=true;
    if(!this.ac){
      if(!this.Context)return;
      this.ac=new this.Context();const ac=this.ac;
      this.compressor=ac.createDynamicsCompressor();
      Object.assign(this.compressor.threshold,{value:-13});Object.assign(this.compressor.knee,{value:10});
      this.compressor.ratio.value=5;this.compressor.attack.value=.004;this.compressor.release.value=.18;
      this.master=ac.createGain();this.master.gain.value=.82;this.compressor.connect(this.master).connect(ac.destination);
      for(const key of ['effects','music','engine']){this[key+'Bus']=ac.createGain();this[key+'Bus'].gain.value=0;this[key+'Bus'].connect(this.compressor);}
      this.loadEffects();
    }
    if(this.ac.state!=='running')this.ac.resume().catch(()=>{});
    this.applyMix();this.updateMusic(true);
  }
  async loadEffects() {
    if(!this.ac||!this.manifest||this.loadingEffects)return;
    this.loadingEffects=true;
    const entries=Object.entries(this.manifest.tracks).filter(([,v])=>v.kind!=='music');
    // Two concurrent decodes keep loading from competing with the renderer.
    let next=0;
    const worker=async()=>{while(next<entries.length){const [id,track]=entries[next++];try{
      const bytes=await fetchWithTimeout(track.url,{cache:'no-store'},10000,this.fetcher,async res=>{if(!res.ok)throw Error('audio unavailable');return res.arrayBuffer();});
      const buffer=await this.ac.decodeAudioData(bytes);this.buffers.set(id,buffer);
    }catch{this.errors.add(id);}this.notify();}};
    await Promise.all([worker(),worker()]);
  }
  applyMix() {
    if(!this.ac)return;
    const mix=mixLevels(this.settings(),this.scene,this.paused,this.hidden), t=this.ac.currentTime;
    const signature=JSON.stringify(mix);if(signature===this.mixSignature)return;this.mixSignature=signature;
    for(const [key,value]of Object.entries(mix)){
      const g=this[key+'Bus'].gain;g.cancelScheduledValues(t);g.setTargetAtTime(value,t,value===0?.035:.08);
      // Reach actual silence after the short fade, rather than an endless exponential tail.
      if(value===0)g.setValueAtTime(0,t+.25);
    }
    if(!mix.music){for(const slot of this.slots)slot.media.pause();}
  }
  setHidden(hidden) {
    this.hidden=hidden;
    if(!this.ac)return;
    this.applyMix();
    if(hidden){this.budget.clear();for(const slot of this.slots)slot.media.pause();this.ac.suspend().catch(()=>{});}
    else if(this.unlocked)this.unlock();
  }
  update({scene='menu',paused=false,listener=null,speed=0,alive=false}={}) {
    const sceneChanged=this.scene!==scene;this.scene=scene;this.paused=paused;this.listener=listener;
    if(!this.ac)return;
    this.applyMix();
    if(this.hidden)return;
    this.updateEngine(alive&&scene==='battle'&&!paused ? level(speed) : -1);
    if(sceneChanged||this.ac.currentTime-this.lastUpdate>.2){this.lastUpdate=this.ac.currentTime;this.updateMusic();}
  }
  cue(kind,{position,own=false,gain=1}={}) {
    if(this.hidden||this.settings().muted||level(this.settings().volSfx,.8)===0||!this.unlocked)return false;
    this.unlockContextOnly();const ac=this.ac;if(!ac||ac.state!=='running')return false;
    const choices=(this.manifest?.cues[kind]||[]).filter(id=>this.buffers.has(id));
    const n=this.variants.get(kind)||0;this.variants.set(kind,n+1);
    let buffer=choices.length?this.buffers.get(choices[n%choices.length]):this.fallbacks.get(kind);
    if(!buffer){buffer=fallbackBuffer(ac,kind);this.fallbacks.set(kind,buffer);}
    const policy=POLICY[kind]||POLICY.impact, spatial=spatialMix(position,this.listener);
    const voice=this.budget.claim(kind,ac.currentTime,buffer.duration+.05,policy.priority+(own?1:0));if(!voice)return false;
    const source=ac.createBufferSource(), volume=ac.createGain();source.buffer=buffer;
    source.playbackRate.value=kind==='ui'?1:[.98,1.015,1,.99][n%4];
    volume.gain.value=policy.gain*level(gain)*spatial.gain;
    source.connect(volume);let pan=null;
    if(ac.createStereoPanner){pan=ac.createStereoPanner();pan.pan.value=spatial.pan;volume.connect(pan).connect(this.effectsBus);}else volume.connect(this.effectsBus);
    const clean=()=>{source.disconnect();volume.disconnect();pan?.disconnect();this.budget.release(voice);};
    voice.stop=()=>{try{source.stop();}catch{}};source.onended=clean;source.start();
    if(kind==='destroy'||kind==='win'){
      const g=this.musicBus.gain,t=ac.currentTime,target=mixLevels(this.settings(),this.scene,this.paused,this.hidden).music;
      g.cancelScheduledValues(t);g.setTargetAtTime(target*.5,t,.025);g.setTargetAtTime(target,t+.32,.25);
    }
    return true;
  }
  unlockContextOnly() { if(this.ac?.state==='suspended'&&!this.hidden)this.ac.resume().catch(()=>{}); }
  updateEngine(speed) {
    const ac=this.ac;if(!ac)return;
    if(!this.engineGain){
      this.engineGain=ac.createGain();this.engineGain.gain.value=0;this.engineGain.connect(this.engineBus);
      const filter=ac.createBiquadFilter();filter.type='lowpass';filter.frequency.value=280;filter.connect(this.engineGain);
      this.motor=ac.createOscillator();this.motor.type='sine';this.motor.frequency.value=48;this.motor.connect(filter);this.motor.start();
    }
    if(!this.engineSample&&this.buffers.has('engine')){
      this.engineSample=ac.createBufferSource();this.engineSample.buffer=this.buffers.get('engine');this.engineSample.loop=true;
      // Crossfade the ends once in PCM to remove the seam from a running-machine segment.
      const b=this.engineSample.buffer,d=b.getChannelData(0),n=Math.min(Math.floor(b.sampleRate*.12),Math.floor(d.length/4));
      for(let i=0;i<n;i++){const a=i/n;d[d.length-n+i]=d[d.length-n+i]*(1-a)+d[i]*a;}
      this.engineSample.loopStart=n/b.sampleRate;this.engineSample.loopEnd=b.duration;
      const trim=ac.createGain();trim.gain.value=.8;this.engineSample.connect(trim).connect(this.engineGain);this.engineSample.start();
    }
    const t=ac.currentTime;this.engineGain.gain.setTargetAtTime(speed<0?0:.025+speed*.2,t,.12);
    this.motor.frequency.setTargetAtTime(46+Math.max(0,speed)*22,t,.16);
    this.engineSample?.playbackRate.setTargetAtTime(.82+Math.max(0,speed)*.23,t,.16);
  }
  makeSlot() {
    const media=this.createMedia();media.preload='metadata';media.setAttribute('playsinline','');
    const gain=this.ac.createGain();gain.gain.value=0;
    const source=this.ac.createMediaElementSource(media);source.connect(gain).connect(this.musicBus);
    const slot={media,gain,source,id:'',title:'',stopping:0,failed:false,playing:false};
    media.addEventListener('error',()=>{slot.failed=true;this.errors.add(slot.id);this.notify();});
    this.slots.push(slot);return slot;
  }
  playSlot(slot) {
    if(slot.playing||!slot.media.paused||slot.failed)return;
    slot.playing=true;
    Promise.resolve(slot.media.play()).catch(()=>{ /* Retry only on a later user gesture. */ this.needsGesture=true; }).finally(()=>{slot.playing=false;});
  }
  updateMusic(gesture=false) {
    if(!this.ac||this.hidden||!this.unlocked)return;
    if(gesture)this.needsGesture=false;
    const t=this.ac.currentTime,enabled=mixLevels(this.settings(),this.scene,this.paused,this.hidden).music>0;
    if(!enabled)return;
    for(const slot of this.slots)if(slot.stopping&&t>=slot.stopping){slot.media.pause();slot.stopping=0;}
    const list=this.manifest?.music[this.scene]||[];
    if(!list.length){this.ambientFallback();return;}
    const current=this.activeSlot;
    if(current?.failed){this.musicScene='';this.activeSlot=null;}
    const end=current&&!current.failed&&(current.media.ended||(Number.isFinite(current.media.duration)&&current.media.duration-current.media.currentTime<1.6));
    if(this.musicScene!==this.scene||end||!this.activeSlot){
      const valid=list.filter(id=>!this.errors.has(id));if(!valid.length){this.ambientFallback();return;}
      const id=valid[(this.musicIndex++)%valid.length];const track=this.manifest.tracks[id];if(!track)return;
      const slot=this.slots.find(s=>s!==current)||this.makeSlot();
      slot.media.pause();slot.id=id;slot.title=track.title;slot.failed=false;slot.stopping=0;slot.media.src=track.url;
      slot.gain.gain.cancelScheduledValues(t);slot.gain.gain.setValueAtTime(0,t);slot.gain.gain.linearRampToValueAtTime(1,t+1.2);
      this.activeSlot=slot;this.musicScene=this.scene;
      if(current&&current!==slot){current.gain.gain.cancelScheduledValues(t);current.gain.gain.setTargetAtTime(0,t,.25);current.stopping=t+1.5;}
      this.notify();
    }
    if(!this.needsGesture)this.playSlot(this.activeSlot);
  }
  ambientFallback() {
    const ac=this.ac,t=ac.currentTime;if(t<this.ambientNext)return;this.ambientNext=t+16;
    const g=ac.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.008,t+3);g.gain.linearRampToValueAtTime(0,t+14);g.connect(this.musicBus);
    const f=[110,130.81,98,123.47][Math.floor(t/16)%4];let ended=0;
    for(const pitch of [f,f*1.5]){const o=ac.createOscillator();o.type='sine';o.frequency.value=pitch;o.connect(g);o.onended=()=>{o.disconnect();if(++ended===2)g.disconnect();};o.start();o.stop(t+14.1);}
  }
}
