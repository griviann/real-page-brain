// REAL PAGE V5 - DASHBOARD BRAIN
const axios = require('axios');
const fs = require('fs');
const PAGE_ID = process.env.PAGE_ID;
const PAGE_TOKEN = process.env.PAGE_TOKEN;
const REPO = process.env.GITHUB_REPOSITORY;
const CONFIG_URL = `https://raw.githubusercontent.com/${REPO}/main/config.json`;

async function loadBrain(){
  try {
    const r = await axios.get(CONFIG_URL+'?t='+Date.now());
    console.log(`🧠 Brain V${r.data.version} loaded`);
    return r.data;
  } catch(e){
    return JSON.parse(fs.readFileSync('./config.json','utf8'));
  }
}

function pickTemplate(BRAIN, text){
  const lower = (text||'').toLowerCase();
  if(BRAIN.posting.emergencyStop) return null;
  if(lower.includes('ruto')||lower.includes('raila')) return BRAIN.templates['8'];
  if(lower.includes('stress')||lower.includes('depress')) return BRAIN.templates['9'];
  const keys = Object.keys(BRAIN.templates).filter(k=>['1','2','3','4','5','6','7'].includes(k));
  return BRAIN.templates[keys[Math.floor(Math.random()*keys.length)]];
}

(async () => {
  const BRAIN = await loadBrain();
  if(BRAIN.posting.emergencyStop){ console.log('🛑 STOP'); return; }
  const tmpl = pickTemplate(BRAIN,'rent tokens');
  const msg = tmpl.replace('{{COMMENT}}','maisha ya bedsitter');
  const res = await axios.post(`https://graph.facebook.com/v20.0/${PAGE_ID}/feed`, {message: msg, access_token: PAGE_TOKEN});
  console.log('Posted ID:', res.data.id);
})();
