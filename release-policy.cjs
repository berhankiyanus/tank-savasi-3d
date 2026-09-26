// Exact public and native payload. New assets need an explicit, reviewed register entry.
const register=require('./legal/asset-register.json');
const shell=['game/arena-catalog.mjs','game/arenas.mjs','game/combat.mjs','game/controls.mjs','game/practice.mjs','game/presentation.mjs','game/premium-profile.mjs','game/ranked-view.mjs','net/client.mjs','net/session.mjs','index.html','main.js','game-progress.mjs','garage-content.mjs','garage-visuals.mjs','polish.css','manifest.json','sw.js','CREDITS.md','privacy.html','licenses.html'];
const files=[...shell,...register.files.filter(r=>r.release).map(r=>r.file)];
const publicPaths=new Set(files.map(f=>'/'+f));
module.exports={files,register,isAllowed:p=>publicPaths.has(p)};
