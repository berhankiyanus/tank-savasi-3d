import {test} from 'node:test';
import assert from 'node:assert/strict';
import {GameAudio,VoiceBudget,mixLevels,previewEnabled,spatialMix,level} from '../game/audio.mjs';

test('zero volume, mute, background and independent motor volume survive every mix context',()=>{
 for(const scene of ['menu','garage','battle','result']){
  assert.deepEqual(mixLevels({volMusic:0,volSfx:0,volEngine:0},scene),{effects:0,music:0,engine:0});
  assert.deepEqual(mixLevels({muted:true},scene),{effects:0,music:0,engine:0});
  assert.deepEqual(mixLevels({},scene,false,true),{effects:0,music:0,engine:0});
 }
 const m=mixLevels({volMusic:0,volEngine:0,volSfx:1},'battle');assert(m.effects>0);assert.equal(m.music,0);assert.equal(m.engine,0);
 assert(mixLevels({},'battle').music<mixLevels({},'menu').music);
 assert.equal(mixLevels({},'battle',true).engine,0);
 assert.equal(level(NaN,.4),.4);assert.equal(level(-5),0);assert.equal(level(9),1);
});
test('recorded preview audio can only be requested with explicit loopback HTTP opt-in',async()=>{
 for(const href of ['https://tank-savasi-3d.onrender.com/?audio=preview','https://localhost/?audio=preview','capacitor://localhost/?audio=preview','http://localhost/','http://localhost.evil/?audio=preview','file:///tmp/index.html?audio=preview']){
  assert.equal(previewEnabled(href),false);let requests=0;
  const audio=new GameAudio({settings:()=>({}),href,fetcher:()=>{requests++;}});await audio.preparePromise;assert.equal(requests,0);
 }
 assert(previewEnabled('http://127.0.0.1:8738/?audio=preview'));
});
test('effect storms stay bounded and preserve high-priority player feedback',()=>{
 const budget=new VoiceBudget(5);let stopped=0;
 for(let i=0;i<100;i++){
  const v=budget.claim(i%2?'fire':'impact',i*.06,3);if(v)v.stop=()=>stopped++;
  assert(budget.voices.length<=5);
 }
 assert(stopped>0);assert(budget.claim('win',6.1,1,10));
 const small=new VoiceBudget(1);small.claim('win',0,5,10);assert.equal(small.claim('ui',1,.1,1),null);
 budget.clear();assert.equal(budget.voices.length,0);
 const bounce=budget.claim('bounce',10,.2);assert(bounce);assert.equal(budget.claim('bounce',10.001,.2),null);
});
test('distance softens effects without hiding enemy cues and mono remains centered',()=>{
 assert.deepEqual(spatialMix(),{gain:1,pan:0});
 const near=spatialMix({x:2,z:1},{x:0,z:0}),far=spatialMix({x:80,z:80},{x:0,z:0});
 assert(far.gain<near.gain);assert(far.gain>=.16);assert(far.pan<=.65);
 assert(spatialMix({x:-80,z:0},{x:0,z:0}).pan<0);
});
class Param {
 constructor(){this.value=0;this.future=[];}
 setValueAtTime(v){this.value=v;}
 setTargetAtTime(v,t){this.value=v;this.future.push({v,t});}
 linearRampToValueAtTime(v,t){this.value=v;this.future.push({v,t});}
 cancelScheduledValues(){this.future=[];}
}
class Node {
 constructor(){this.gain=new Param();this.frequency=new Param();this.playbackRate=new Param();this.pan=new Param();}
 connect(node){return node;}disconnect(){}start(){}stop(){this.onended?.();}
}
class Context {
 constructor(){this.currentTime=1;this.state='running';this.sampleRate=1000;this.destination={};}
 resume(){this.state='running';return Promise.resolve();}suspend(){this.state='suspended';return Promise.resolve();}
 createGain(){return new Node();}createOscillator(){return new Node();}createBiquadFilter(){return new Node();}createBufferSource(){return new Node();}createStereoPanner(){return new Node();}createMediaElementSource(){return new Node();}
 createDynamicsCompressor(){return Object.fromEntries(['threshold','knee','ratio','attack','release'].map(k=>[k,new Param()]).concat([['connect',()=>({connect(){}})]]));}
 createBuffer(ch,n,rate){const data=new Float32Array(n);return {duration:n/rate,getChannelData:()=>data};}
}
test('muting during music duck cancels the scheduled volume restore; background clears queued effects',()=>{
 const settings={music:true,volMusic:1,volSfx:1};const audio=new GameAudio({settings:()=>settings,Context});audio.unlock();audio.cue('destroy');
 assert(audio.musicBus.gain.future.some(e=>e.t>audio.ac.currentTime));
 settings.muted=true;audio.applyMix();assert(audio.musicBus.gain.future.every(e=>e.v===0));
 audio.setHidden(true);assert.equal(audio.ac.state,'suspended');assert.equal(audio.budget.voices.length,0);
 assert.equal(audio.cue('fire'),false);audio.setHidden(false);assert.equal(audio.ac.state,'running');assert.equal(audio.musicBus.gain.value,0);
});
test('missing local audio is recoverable and never blocks gameplay',async()=>{
 const audio=new GameAudio({settings:()=>({}),href:'http://localhost/?audio=preview',Context,fetcher:async()=>{throw Error('offline');}});
 await audio.preparePromise;assert.equal(audio.previewState,'unavailable');audio.unlock();assert(audio.cue('fire'));assert(audio.ac);
});
