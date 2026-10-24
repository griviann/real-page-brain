// V12 REAL Grey Matter - ESM Fixed for griviann repo
import fs from 'fs';

const FB_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN || process.env.FB_PAGE_TOKEN;
const PAGE_ID = process.env.FB_PAGE_ID;
const GROQ_KEY = process.env.GROQ_API_KEY;
const MEMORY_FILE = 'memory.json';

let memory = [];
if(fs.existsSync(MEMORY_FILE)){
  try{ memory = JSON.parse(fs.readFileSync(MEMORY_FILE,'utf8')); }catch{}
}

async function think(comment, name){
  try{
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions",{
      method:"POST",
      headers:{ "Authorization":`Bearer ${GROQ_KEY}`, "Content-Type":"application/json" },
      body: JSON.stringify({
        model:"llama-3.1-8b-instant",
        messages:[
          {role:"system",content:"You are REAL satisfaction admin Eldoret. Reply Sheng/Swahili mix short 12-18 words friendly varied helpful like Meta AI. Price 2200 if asked. Never repeat same phrase."},
          {role:"user",content:`${name} said: ${comment}`}
        ],
        temperature:0.9, max_tokens:70
      })
    });
    const d = await r.json();
    return d.choices?.[0]?.message?.content || "Asante mkuu! 🙏 Karibu REAL satisfaction - Beyond Imagination!";
  }catch(e){ return "Asante mkuu! 🙏 Karibu sana!"; }
}

console.log("V12 Brain starting with memory:", memory.length);
const postsRes = await fetch(`https://graph.facebook.com/v18.0/${PAGE_ID}/posts?fields=id&limit=5&access_token=${FB_TOKEN}`);
const postsJson = await postsRes.json();
const posts = postsJson.data || [];
for(const post of posts){
  const cRes = await fetch(`https://graph.facebook.com/v18.0/${post.id}/comments?fields=id,message,from&access_token=${FB_TOKEN}`);
  const cJson = await cRes.json();
  const comments = cJson.data || [];
  for(const c of comments){
    if(memory.includes(c.id)) { console.log("Skip remembered", c.id); continue; }
    if(c.from?.id === PAGE_ID) continue;
    if(!c.message) continue;
    const reply = await think(c.message, c.from.name);
    await fetch(`https://graph.facebook.com/v18.0/${c.id}/comments?message=${encodeURIComponent(reply)}&access_token=${FB_TOKEN}`,{method:"POST"});
    memory.push(c.id);
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory.slice(-300)));
    console.log(`V12 replied to ${c.from.name}: ${reply}`);
    await new Promise(x=>setTimeout(x,2500));
  }
}
console.log("V12 Done");
