// === REAL SATISFACTION AUTOPILOT V7 - FINAL FIXED ===
import fs from 'fs';
import path from 'path';

const configPath = './config.json';
let config = {
  version: "V7",
  posting: { emergencyStop: false },
  towns: ["Kisumu", "Nakuru", "Eldoret", "Nairobi", "Mombasa"],
  counties: [
    { name: "Nairobi", hashtag: "#Nairobi", caption: "Karibu Nairobi - Real Satisfaction is here!" },
    { name: "Mombasa", hashtag: "#Mombasa", caption: "Mombasa love - Beyond Imagination!" },
    { name: "Kisumu", hashtag: "#Kisumu", caption: "Kisumu dala - Satisfaction guaranteed!" },
    { name: "Nakuru", hashtag: "#Nakuru", caption: "Nakuru we deliver!" },
    { name: "Eldoret", hashtag: "#Eldoret", caption: "Eldoret home of champions!" }
  ],
  core_message: "Real Satisfaction - Beyond Imagination"
};

try {
  if (fs.existsSync(configPath)) {
    const fileConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    config = { ...config, ...fileConfig };
  }
} catch (e) {
  console.log("Using fallback config");
}

function getSlot() {
  const hour = new Date().getUTCHours() + 3; // EAT Nairobi time
  if (hour < 12) return "MORNING";
  if (hour < 17) return "NOON";
  return "EVENING";
}

function getRandomCounty() {
  const list = config.counties || [];
  if (!list.length) return { name: "Kenya", hashtag: "#Kenya", caption: "" };
  return list[Math.floor(Math.random() * list.length)];
}

function normalizeCounty(c) {
  if (typeof c === 'string') return { name: c, hashtag: `#${c}`, caption: "" };
  return c;
}

const MANTRAS = [
  "AMKA. JIPANGE. JARIBU TENA.",
  "HUSTLE IKO, LAKINI MINDSET NDIO KILA KITU.",
  "USIACHE KESHO IIBE NGUVU YA LEO.",
  "FOCUS. DISCIPLINE. CONSISTENCY.",
  "WEKA BIDII, MUNGU ATAJAZA KILICHOBAKI."
];

const POST_TEMPLATES = {
  MORNING: (countyRaw) => {
    const county = normalizeCounty(countyRaw);
    const mantra = MANTRAS[Math.floor(Math.random() * MANTRAS.length)];
    return `☀️ GOOD MORNING ${county.name.toUpperCase()}!

${county.caption}

${config.core_message}

Today's Mantra:
${mantra}

You didn't wake up to be average.
You woke up to be GREAT.

Uko tayari?

#RealSatisfaction ${county.hashtag} #BeyondImagination #KenyaMotivation`;
  },
  NOON: (countyRaw) => {
    const county = normalizeCounty(countyRaw);
    return `🔥 MIDDAY CHECK-IN ${county.name.toUpperCase()}!

${county.caption}

Watu wengine wamechoka, wewe bado unasonga.
That's the difference.

${config.core_message}

#RealSatisfaction ${county.hashtag} #HustleKenya`;
  },
  EVENING: (countyRaw) => {
    const county = normalizeCounty(countyRaw);
    return `🌙 EVENING ${county.name.toUpperCase()}!

${county.caption}

Leo umejaribu. Kesho utashinda.
Rest, reset, return stronger.

${config.core_message}

#RealSatisfaction ${county.hashtag} #KenyaEvening`;
  }
};

async function postToFacebook(message) {
  const token = process.env.FB_PAGE_ACCESS_TOKEN || process.env.FACEBOOK_PAGE_TOKEN || process.env.PAGE_TOKEN;
  const pageId = process.env.FB_PAGE_ID || process.env.PAGE_ID || "108984271984415";

  if (!token) {
    console.log("!!! NO FB TOKEN FOUND - Skipping actual post (DRY RUN) !!!");
    console.log("Add secret FB_PAGE_ACCESS_TOKEN in GitHub Secrets");
    return { dryRun: true };
  }

  try {
    // Using built-in fetch (NO node-fetch needed)
    const res = await fetch(`https://graph.facebook.com/${pageId}/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, access_token: token })
    });
    const data = await res.json();
    if (data.error) throw new Error(JSON.stringify(data.error));
    console.log("✅ Facebook posted successfully:", data.id || data);
    return data;
  } catch (err) {
    console.error(`Facebook post failed (will retry next run): ${err.message}`);
    throw err;
  }
}

async function main() {
  console.log("=== REAL SATISFACTION V7 ===");
  const slot = getSlot();
  const county = getRandomCounty();
  const time = new Date().toISOString();

  console.log(`Time: ${time} | Slot: ${slot} | County: ${normalizeCounty(county).name}`);

  const templateFn = POST_TEMPLATES[slot] || POST_TEMPLATES.MORNING;
  const message = templateFn(county);

  console.log(message);
  console.log("==============================");

  if (process.argv.includes('--post')) {
    await postToFacebook(message);
  }

  // Save performance
  try {
    if (!fs.existsSync('dashboard')) fs.mkdirSync('dashboard', { recursive: true });
    fs.writeFileSync('dashboard/last_run.json', JSON.stringify({ time, slot, county, success: true }, null, 2));
    console.log("Performance logged to dashboard/");
  } catch (e) {}
}

main();
