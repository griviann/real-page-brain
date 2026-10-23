const PAGE_ID = process.env.PAGE_ID;
const PAGE_TOKEN = process.env.PAGE_TOKEN;
async function postToFacebook() {
  if (!PAGE_ID || !PAGE_TOKEN) {
    console.log("Missing PAGE_ID or PAGE_TOKEN");
    return;
  }
  const messages = [
    "Good Morning Kenya! ☀️ Real Satisfaction Beyond Imagination! 🛒 Tunadeliver countrywide, Nakuru base. DM your location today! 🔥",
    "Wamlambez? Bei ni friendly sana! 💯 Real Satisfaction quality products at unbeatable prices! DM for offer ya leo 😎",
    "Eldoret, Nairobi, Nakuru, Kisumu — tuko rada! 🚚 Delivery countrywide! Order leo, receive kesho! DM now! 🔥",
    "Happy customers = Real Satisfaction! 🙏 Asante sana for trusting us! Beyond Imagination! New stock daily!",
    "Usikose deal! 🔥 Real Satisfaction — Your trusted online shop in Kenya! DM OFFER nikupe best price leo!"
  ];
  const message = messages[Math.floor(Math.random() * messages.length)];
  console.log(`Posting: ${message}`);
  const url = `https://graph.facebook.com/v18.0/${PAGE_ID}/feed`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: message, access_token: PAGE_TOKEN })
  });
  const data = await res.json();
  console.log("FB Response:", JSON.stringify(data));
  if (data.id) console.log(`POSTED SUCCESS: ${data.id}`);
  else console.log(`FAILED: ${data.error?.message}`);
}
postToFacebook();
