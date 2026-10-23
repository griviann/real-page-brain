// Real Satisfaction - Agent.js V7 Autopilot
// 3 posts per day + Performance Tracking
const fs = require('fs');

let config;
try {
  config = require('./config.json');
} catch (e) {
  config = {
    counties: [
      { name: "Nairobi", hashtag: "#Nairobi", caption: "Nairobi, city of dreamers!" },
      { name: "Mombasa", hashtag: "#Mombasa", caption: "Mombasa, pwani si ndoto tu!" },
      { name: "Kisumu", hashtag: "#Kisumu", caption: "Kisumu, lake of opportunities!" },
      { name: "Nakuru", hashtag: "#Nakuru", caption: "Nakuru, tunasonga!" },
      { name: "Kisii", hashtag: "#Kisii", caption: "Kisii, nguvu ya bidii!" },
      { name: "Eldoret", hashtag: "#Eldoret", caption: "Eldoret, champions home!" },
      { name: "Machakos", hashtag: "#Machakos", caption: "Machakos, kazi kwa bidii!" }
    ],
    core_message: "Real Satisfaction - Beyond Imagination"
  };
}

const POST_TEMPLATES = {
  morning: (county) => `☀️ GOOD MORNING ${county.name.toUpperCase()}!

${county.caption}

${config.core_message || "Beyond Imagination"}

Today's Mantra:
AMKA. JIPANGE. JARIBU TENA.

You didn't wake up to be average. You woke up to be GREAT.

Uko tayari?

#RealSatisfaction ${county.hashtag} #BeyondImagination #KenyaMotivation`,

  noon: (county) => `🤔 MASWALI YA MCHANA - ${county.name.toUpperCase()}!

Safari yako iko wapi leo? 1-10

1 = Naanza tu leo
5 = Niko katikati, napambana
10 = Niko karibu na ndoto yangu!

COMMENT number yako hapa chini 👇
Tutakujibu na motivation ya kukupeleka next level!

Na usisahau ku-follow page!

#RealSatisfaction ${county.hashtag} #Engagement`,

  evening: (county) => `🌙 USIKU MWEMA - ${county.name.toUpperCase()}

Leo umefanya kitu kimoja kusogea karibu na ndoto yako?

Hata kama ni:
✓ Kusoma page moja
✓ Kufanya mazoezi dakika 10
✓ Ku-save 100 bob
✓ Kuomba Mungu

Hiyo ni HATUA mkuu. Hatua ndogo ndio inajenga ndoto kubwa.

Lala na ndoto. Amka na mpango. Kesho tunarudia tena.

We believe in you.

${config.core_message || "Real Satisfaction - Beyond Imagination"}

${county.hashtag} #RealSatisfaction`
};

async function createPost() {
  const now = new Date();
  const nairobiHour = now.getUTCHours() + 3; // UTC+3 for Nairobi
  const hour = now.getUTCHours(); // GitHub uses UTC

  let slot = 'morning';
  if (hour === 9) slot = 'noon';      // 12:30 PM EAT = 9:30 UTC
  if (hour === 16) slot = 'evening';  // 7:30 PM EAT = 16:30 UTC
  
  // Pick county based on day + slot to avoid repeating
  const day = now.getDate();
  const slotIndex = slot === 'morning' ? 0 : slot === 'noon' ? 1 : 2;
  const countyIndex = (day + slotIndex) % config.counties.length;
  const county = config.counties[countyIndex];

  const caption = POST_TEMPLATES[slot](county);

  console.log(`=== REAL SATISFACTION V7 ===`);
  console.log(`Time: ${now.toISOString()} | Slot: ${slot.toUpperCase()} | County: ${county.name}`);
  console.log(caption);
  console.log(`============================`);

  // --- FACEBOOK POSTING ---
  const PAGE_ID = process.env.PAGE_ID;
  const PAGE_TOKEN = process.env.PAGE_TOKEN;

  if (PAGE_ID && PAGE_TOKEN) {
    try {
      const fetch = (await import('node-fetch')).default || require('node-fetch');
      // For text post:
      const res = await fetch(`https://graph.facebook.com/${PAGE_ID}/feed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: caption,
          access_token: PAGE_TOKEN
        })
      });
      const data = await res.json();
      console.log("Facebook Response:", data);
    } catch (err) {
      console.error("Facebook post failed (will retry next run):", err.message);
    }
  } else {
    console.log("DRY RUN - No PAGE_ID/TOKEN found. Would post to Facebook.");
  }

  // --- PERFORMANCE TRACKING ---
  try {
    fs.mkdirSync('./dashboard', { recursive: true });
    
    const log = {
      timestamp: now.toISOString(),
      slot: slot,
      county: county.name,
      caption_preview: caption.substring(0, 100),
      status: PAGE_ID ? "posted" : "dry_run"
    };
    
    fs.writeFileSync('./dashboard/last_post.json', JSON.stringify(log, null, 2));
    
    // Append to performance log
    const csvLine = `${now.toISOString()},${slot},${county.name},posted\n`;
    fs.appendFileSync('./dashboard/performance.csv', csvLine);
    
    console.log("Performance logged to dashboard/");
  } catch (e) {
    console.log("Logging failed:", e.message);
  }
}

// Run if called with --post
if (process.argv.includes('--post')) {
  createPost();
}

module.exports = { createPost };
