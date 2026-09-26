const KEY='tank-arena-token';
function vault(){const c=globalThis.Capacitor;return c?.getPlatform?.()==='ios'?(c.Plugins?.ArenaVault||{get:()=>Promise.reject(Error('Keychain unavailable')),set:()=>Promise.reject(Error('Keychain unavailable')),remove:()=>Promise.reject(Error('Keychain unavailable'))}):null;}
export async function readSession(){const v=vault();if(!v)return localStorage.getItem(KEY);const {value}=await v.get();if(value)return value;const old=localStorage.getItem(KEY);if(old){await v.set({value:old});localStorage.removeItem(KEY);}return old;}
export async function saveSession(value){const v=vault();if(v){await v.set({value});localStorage.removeItem(KEY);}else localStorage.setItem(KEY,value);}
export async function clearSession(){const v=vault();if(v)await v.remove();localStorage.removeItem(KEY);}
