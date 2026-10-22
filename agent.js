const fs = require('fs');
console.log("🧠 Real V5 Starting...");
let BRAIN = { version:"V5", posting:{emergencyStop:false}, towns:["Kisumu","Nakuru","Eldoret"], phone:"0758825414" };
try {
  const raw = fs.readFileSync('./config.json','utf8');
  if(raw.includes("const fs")) throw new Error("config.json has JS inside!");
  BRAIN = JSON.parse(raw);
} catch(e){ console.log("Using default brain: "+e.message); }
if(BRAIN.posting?.emergencyStop){ console.log("🛑 STOP ON"); process.exit(0); }
const town = BRAIN.towns[Math.floor(Math.random()*BRAIN.towns.length)];
const msg = `🔥 REAL SATISFACTION - ${town} 🔥\n\nNeed companion tonight in ${town}?\n✅ Discreet & Private\n✅ Available NOW\n📞 ${BRAIN.phone}\n\nDM now! We are online in ${town}!\n\n#${town}`;
(async()=>{
  const url=`https://graph.facebook.com/v19.0/${process.env.PAGE_ID}/feed`;
  const p=new URLSearchParams(); p.append('message',msg); p.append('access_token',process.env.PAGE_TOKEN);
  const r=await fetch(url,{method:'POST',body:p}); const d=await r.json();
  console.log(JSON.stringify(d));
  if(d.id) console.log("✅ POSTED: "+d.id); else throw new Error(d.error?.message);
})();
