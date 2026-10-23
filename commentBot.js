import fs from 'fs';

async function generateAIReply(commentText, userName) {
  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) return null;

  const prompt = `
You are Real Satisfaction sales agent in Kenya. 
Customer name: ${userName}
Comment: "${commentText}"
Reply in same language as comment (Sheng/Swahili/English). 
Be short (under 20 words), friendly, Kenyan vibe, add 1 emoji.
If asks price: say DM for offer.
If says thanks: thank them warmly.
If says location: say we deliver countrywide, Nakuru is base.
Brand slogan: Beyond Imagination.
`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
  } catch (e) {
    console.log("AI fail, using fallback", e.message);
    return null;
  }
}

function fallbackReply(name, text) {
  const t = text.toLowerCase();
  if (t.includes("bei") || t.includes("price")) return `Bei ni friendly ${name} mkuu! Nicheki DM nikupe offer ya leo 🔥`;
  if (t.includes("wapi") || t.includes("location")) return `Tuko online ${name}! Tunadeliver Kenya mzima, Nakuru home base! DM location yako 🙏`;
  if (t.includes("asante") || t.includes("thanks")) return `Asante sana ${name} mkuu! 🙏 Real Satisfaction family inakuthamini!`;
  return `Asante ${name} mkuu! 🙌 Beyond Imagination!`;
}

async function replyToComments() {
  const PAGE_ID = process.env.PAGE_ID;
  const PAGE_TOKEN = process.env.PAGE_TOKEN;
  if (!PAGE_ID || !PAGE_TOKEN) {
    console.log("DRY RUN - missing PAGE_ID/TOKEN");
    return;
  }

  console.log("🤖 V8 AI Bot starting...");
  const postsRes = await fetch(`https://graph.facebook.com/v18.0/${PAGE_ID}/posts?fields=id&limit=5&access_token=${PAGE_TOKEN}`);
  const posts = await postsRes.json();

  for (const post of posts.data || []) {
    const commentsRes = await fetch(`https://graph.facebook.com/v18.0/${post.id}/comments?fields=id,message,from&access_token=${PAGE_TOKEN}`);
    const comments = await commentsRes.json();

    for (const c of comments.data || []) {
      if (c.from?.id === PAGE_ID) continue;
      const name = c.from?.name?.split(' ')[0] || 'mkuu';
      const text = c.message || '';

      let reply = await generateAIReply(text, name);
      if (!reply) reply = fallbackReply(name, text);

      console.log(`Replying to ${name}: ${text} -> ${reply}`);

      await fetch(`https://graph.facebook.com/v18.0/${c.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: reply, access_token: PAGE_TOKEN })
      });
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  console.log("✅ V8 AI done!");
}

replyToComments();
