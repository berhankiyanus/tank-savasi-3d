// Optional analytics never run before an explicit preference, including migrated saves.
export const optedIn = value => value === true;
export function createTelemetry({enabled,storage,send,random=()=>[...crypto.getRandomValues(new Uint8Array(16))].map(v=>v.toString(16).padStart(2,'0')).join(''),now=Date.now}) {
  let session;
  return {
    track(ev,data={}) {
      if(!enabled()) return false;
      try {
        let id=storage.getItem('tankanalytics');
        if(!id){id=random();storage.setItem('tankanalytics',id);}
        session ||= random();
        // Callers cannot overwrite identity or event fields through a payload.
        send({...data,ev,sid:session,pid:id,t:now()});
        return true;
      } catch {return false;}
    },
    revoke(){session=undefined;try{storage.removeItem('tankanalytics');}catch{}}
  };
}
export function clearSoloData(storage) {
  // Preserve the independent online account credential and unrelated site storage.
  for(const key of ['tankprofile','tankprofile-before-premium','tanksettings','tanklang','tankcid','tankanalytics'])storage.removeItem(key);
}
