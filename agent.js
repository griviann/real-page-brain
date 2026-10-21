const fs = require('fs');
console.log("🧠 Real V5 Brain Starting...");
const PAGE_ID = process.env.PAGE_ID;
const PAGE_TOKEN = process.env.PAGE_TOKEN;
if(!PAGE_ID || !PAGE_TOKEN){ console.log("❌ Secrets missing!"); process.exit(1); }
let BRAIN = {};
try{
  let raw = fs.readFileSync('./config.json','utf8');
  if(raw.trim().startsWith('const')) throw new Error('config.json has JS not JSON!');
  BRAIN = JSON.parse(raw);
  console.log(`🧠 Brain ${BRAIN.version} loaded`);
}catch(e){
  console.log("⚠️ Config broken/empty, using defaults: "+e.message);
  BRAIN = { version:"V5", posting:{emergencyStop:false}, towns:["Kisumu","Nakuru","Eldoret","Nairobi","Kisii"], phone:"0758825414" };
}
if(BRAIN.posting?.emergencyStop){ console.log('🛑 STOP is ON'); process.exit(0); }
const town = (BRAIN.towns||["Kapenguria"])[Math.floor(Math.random()*(BRAIN.towns||[]).length)];
const msg = `🔥 REAL SATISFACTION - ${town} 🔥\n\nNeed companion tonight in ${town}?\n✅ Discreet\n✅ Available NOW in ${town}\n📞 Call/WhatsApp: ${BRAIN.phone}\n\nDM now!\n\n#${town} #RealSatisfaction`;
(async()=>{
  const url=`https://graph.facebook.com/v19.0/${PAGE_ID}/feed`;
  const p=new URLSearchParams(); p.append('message',msg); p.append('access_token',PAGE_TOKEN);
  console.log(`📤 Posting to ${town}...`);
  const r=await fetch(url,{method:'POST',body:p}); const d=await r.json();
  console.log(JSON.stringify(d));
  if(d.id) console.log(`✅ SUCCESS ${d.id}`); else throw new Error(d.error?.message);
})();
