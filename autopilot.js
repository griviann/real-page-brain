// V11 BREAKTHROUGH - Real Satisfaction Autonomous Hustle Brain
const PAGE_ID = process.env.PAGE_ID || process.env.FB_PAGE_ID;
const PAGE_TOKEN = process.env.PAGE_TOKEN || process.env.FB_PAGE_TOKEN || process.env.FB_TOKEN;
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const fs = require('fs');

async function getConfig(file){
  try{ return JSON.parse(fs.readFileSync(file,'utf8')); }catch(e){ return {}; }
}

async function postPhotoWithAI(message, imageUrl){
  const url = `https://graph.facebook.com/v20.0/${PAGE_ID}/photos`;
  const res = await fetch(url,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ url: imageUrl, caption: message, access_token: PAGE_TOKEN })
  });
  return res.json();
}

async function generateWithGemini(prompt, behavior){
  if(!GEMINI_KEY) return prompt;
  const sys = `You are Real Satisfaction sales AI. Personality: ${behavior.personality}. Rules: ${JSON.stringify(behavior.sales_closer)}. Always Sheng + selling. Always end with DM call. County: Kenya. Brand: Real Satisfaction Beyond Imagination.`;
  try{
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,{
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ contents:[{ parts:[{text: sys + "\nTask: " + prompt}] }] })
    });
    const d = await r.json();
    return d.candidates?.[0]?.content?.parts?.[0]?.text || prompt;
  }catch(e){ return prompt; }
}

async function run(){
  console.log("V11 BREAKTHROUGH STARTING...");
  const inst = await getConfig('instructions.json');
  const behavior = await getConfig('behavior.json');
  const customers = await getConfig('customers.json');

  if(!PAGE_ID || !PAGE_TOKEN){ console.log("Missing PAGE_ID/TOKEN"); return; }

  let finalMessage = inst.active_instruction || inst.voice_transcript;
  if(!finalMessage){
    finalMessage = "Real Satisfaction Beyond Imagination! Tuko rada Eldoret, Nairobi, Nakuru, Kisumu! DM for deals 🔥";
  }

  // 1. INTELLIGENCE: County-based timing
  const hour = new Date().getHours();
  let county = inst.county_focus;
  if(county==='auto'){
    if(hour>=19) county='Eldoret';
    else if(hour>=12) county='Nairobi';
    else county='Nakuru';
  }

  // 2. GEMINI + BEHAVIORAL AMENDMENT
  const prompt = `Create Facebook post: ${finalMessage}. County focus ${county}. Make it viral Kenyan sheng, selling, include free delivery if Eldoret. Tone: ${inst.tone}`;
  const aiMessage = await generateWithGemini(prompt, behavior);
  console.log(`FINAL POST: ${aiMessage}`);

  // 3. MEDIA HANDLING - IMAGE MAGIC / VIDEO
  if(inst.media_file){
    const rawUrl = `https://raw.githubusercontent.com/griviann/real-page-brain/main/${inst.media_file}`;
    console.log(`Posting PHOTO: ${rawUrl}`);
    const fbRes = await postPhotoWithAI(aiMessage, rawUrl);
    console.log("FB Photo Response:", JSON.stringify(fbRes));
    if(fbRes.id) console.log(`✅ BREAKTHROUGH POSTED WITH IMAGE: ${fbRes.id}`);
  } else {
    const url = `https://graph.facebook.com/v20.0/${PAGE_ID}/feed`;
    const res = await fetch(url,{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ message: aiMessage, access_token: PAGE_TOKEN }) });
    const data = await res.json();
    console.log("FB Text Response:", JSON.stringify(data));
  }

  // 4. CUSTOMER MEMORY UPDATE (Future comments will use this)
  console.log(`💡 Intelligence: Posted for ${county} at ${hour}h. Sales closer Till: ${behavior.sales_closer.mpesa_till}`);
}

run();
