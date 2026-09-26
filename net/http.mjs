// AbortSignal.timeout is absent on older supported iOS releases.
export async function fetchWithTimeout(url,options={},milliseconds=10000,fetcher=globalThis.fetch.bind(globalThis),consume=response=>response) {
 const controller=new AbortController(),abort=()=>controller.abort();
 const timer=setTimeout(abort,milliseconds);
 options.signal?.addEventListener('abort',abort,{once:true});if(options.signal?.aborted)abort();
 try{return await consume(await fetcher(url,{...options,signal:controller.signal}));}
 finally{clearTimeout(timer);options.signal?.removeEventListener('abort',abort);}
}
export function fetchJSON(url,options={},milliseconds=10000){return fetchWithTimeout(url,options,milliseconds,undefined,async r=>{if(!r.ok){const error=Error('HTTP '+r.status);error.status=r.status;throw error;}return r.json();});}
