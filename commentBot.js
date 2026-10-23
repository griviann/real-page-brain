import fs from 'fs';

const REPLIES = {
  asante: "Asante sana mkuu! 🙏 Real Satisfaction family inakuthamini!",
  bei: "Bei ni pocket friendly mkuu! Nimetumie DM na details zote!",
  how: "Karibu sana! Tuko hapa kwa ajili yako 24/7, DM tu!",
  location: "Tuko online mkuu! Tunadeliver Kenya mzima, Nakuru ni base!",
  nimechoka: "Najua mkuu, life inaeza kuwa ngumu. Real Satisfaction iko na wewe! ❤️",
  default: [
    "Asante kwa comment! 🙌 Real Satisfaction inakupenda!",
    "Comment yako imetugusa sana! Beyond Imagination!",
    "Tunakuthamini sana mkuu! Endelea na support!",
    "Real Satisfaction family inakusupport!"
  ]
};

async function replyToComments() {
  const PAGE_ID = process.env.PAGE_ID;
  const PAGE_TOKEN = process.env.PAGE_TOKEN;

  if (!PAGE_ID || !PAGE_TOKEN) {
    console.log("DRY RUN - No tokens, would reply");
    fs.mkdirSync('./dashboard', { recursive: true });
    const log = { time: new Date().toISOString(), replied: 0, note: "dry run" };
    fs.writeFileSync('./dashboard/last_comment.json', JSON.stringify(log, null, 2));
    return;
  }

  console.log("Checking comments for", PAGE_ID);
  // Your reply logic continues here...
  // (keep your fetch code below this)
}

replyToComments();
