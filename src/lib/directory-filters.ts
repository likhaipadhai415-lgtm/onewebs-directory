import type { Website } from "./onewebs-data";

export type Platform = "Web" | "Mobile app" | "Desktop app";
export type PriceFilter = "Any price" | "Free plan" | "Paid plan";

// Only explicitly known app availability is offered. Every directory entry has a website.
const mobileApps = new Set([
  "ChatGPT", "Claude", "Gemini", "Microsoft Copilot", "Perplexity", "Grok", "Poe", "Google", "Bing", "DuckDuckGo", "Brave Search", "Ecosia",
  "Khan Academy", "Coursera", "Udemy", "Duolingo", "Skillshare", "Canva", "Adobe Express", "Midjourney", "Leonardo AI", "CapCut", "VN Editor", "iMovie",
  "WhatsApp", "Telegram", "Discord", "Zoom", "Google Meet", "Slack", "Microsoft Teams", "Signal", "Messenger", "Viber", "LINE", "WeChat", "Cisco Webex",
  "Notion", "Google Docs", "Google Sheets", "ClickUp", "Trello", "Asana", "Todoist", "Evernote", "Monday.com", "Miro", "Google Calendar", "TickTick",
  "Google Drive", "Dropbox", "OneDrive", "MEGA", "Box", "iCloud", "pCloud", "Proton Drive", "Nextcloud", "iLovePDF", "Smallpdf", "Adobe Acrobat Online", "GitHub", "GitLab", "Replit", "Stack Overflow", "Postman",
  "Amazon", "Flipkart", "Myntra", "Meesho", "eBay", "Walmart", "AliExpress", "Etsy", "Nykaa", "IKEA", "Zara", "YouTube", "Netflix", "Prime Video", "Spotify", "Disney+", "Hulu", "Apple TV+", "Crunchyroll", "Twitch", "JioHotstar", "ZEE5", "Sony LIV", "SoundCloud", "Apple Music", "YouTube Music", "Plex",
  "Google Pay", "PhonePe", "Paytm", "PayPal", "Wise", "Cash App", "Venmo", "Apple Pay", "Samsung Wallet", "CRED", "Practo", "Apollo 24/7", "WebMD", "NHS", "1mg", "PharmEasy", "MyFitnessPal", "Google Maps", "Booking.com", "Airbnb", "Uber", "MakeMyTrip", "Expedia", "Agoda", "Skyscanner", "Tripadvisor", "Google Flights", "Kayak", "Trip.com", "Hostelworld", "Rome2Rio", "IRCTC", "ixigo", "OYO",
]);
const desktopApps = new Set([
  "ChatGPT", "Claude", "Microsoft Copilot", "Canva", "Figma", "Affinity Designer", "CorelDRAW", "Sketch", "Lunacy", "Inkscape", "GIMP", "Krita", "CapCut", "VN Editor", "DaVinci Resolve", "Filmora", "Adobe Premiere Pro", "Final Cut Pro", "Kdenlive", "Shotcut", "OpenShot", "iMovie", "Lightworks", "Movavi", "Camtasia", "Voicemod", "Discord", "Zoom", "Slack", "Microsoft Teams", "Signal", "Telegram", "WhatsApp", "Element", "Notion", "Trello", "Obsidian", "Evernote", "Microsoft 365", "Google Drive", "Dropbox", "OneDrive", "MEGA", "iCloud", "Sync.com", "pCloud", "Proton Drive", "Nextcloud", "GitHub", "GitLab", "Postman", "Spotify", "Apple Music", "Plex",
]);

export function hasPlatform(site: Website, platform: Platform | "Any platform") {
  if (platform === "Any platform" || platform === "Web") return true;
  return (platform === "Mobile app" ? mobileApps : desktopApps).has(site.name);
}

export function matchesPrice(site: Website, price: PriceFilter) {
  if (price === "Any price") return true;
  if (price === "Free plan") return site.pricing !== "Paid";
  return site.pricing !== "Free";
}

// Feature matches are backed by the curated listing descriptions, not guessed from a category.
const featureRules: Record<string, [string, RegExp][]> = {
  "ai-chatbots": [["Writing", /writing|marketing|content/], ["Coding", /cod(e|ing)|technical/], ["Research", /research|answers|information|search/], ["Conversation", /conversat|chat|companion|characters/]],
  "search-engines": [["Private search", /priva|ad-free/], ["Independent search", /independent|own index|metasearch/], ["AI answers", /ai|computational/]],
  learning: [["Coding", /cod(e|ing)|web development|technology/], ["Courses", /courses|classes|curriculum|lessons/], ["Languages", /languages/], ["Certificates", /certificate|career/]],
  "graphic-design": [["Photo editing", /photo|image|background/], ["Vector design", /vector|graphics/], ["Website design", /website|interface|prototyp/]],
  "ai-image": [["Image generation", /generat|create|creation/], ["Editing", /edit|remix/], ["Design assets", /design|assets|text/]],
  "ai-video": [["Text to video", /text|script/], ["AI avatars", /avatar|presenter|talking/], ["Video editing", /edit|effects/]],
  "voice-music": [["Voice generation", /voice|speech|vocals/], ["Music creation", /music|songs|composition|tracks/], ["Audio editing", /recording|enhancement|changer/]],
  "video-editing": [["Online editor", /online|browser|collaborative/], ["AI tools", /ai|subtitles/], ["Professional editing", /pro|color|industry-standard/]],
  communication: [["Messaging", /messag|chat|text/], ["Video meetings", /video|meet|conferenc|calls/], ["Team work", /team|work|collaborat/]],
  productivity: [["Notes & docs", /notes|docs|documents|knowledge/], ["Tasks & projects", /tasks|projects|work management|to-do|issue tracking/], ["Calendar", /calendar|schedule|meetings/]],
  "cloud-storage": [["Encrypted storage", /encrypt|secure|privacy/], ["Backup", /backup/], ["File sharing", /shar|sync/]],
  "pdf-tools": [["PDF editing", /edit|sign|forms/], ["File conversion", /convert|formats/], ["Compression", /compress/]],
  developers: [["Hosting & deploy", /deploy|hosting|cloud|scale/], ["Coding tools", /cod(e|ing)|development|developer|apis/], ["Documentation", /docs|documentation|questions|answers/]],
  shopping: [["Fashion", /fashion|clothing|accessories/], ["Electronics", /electronic|appliances/], ["Marketplace", /marketplace|store|buy and sell|shopping/]],
  entertainment: [["Movies & TV", /movies|tv|films|shows|cinema|anime/], ["Music", /music|songs|tracks/], ["Live video", /live|sports|streams/]],
  payments: [["Money transfers", /transfer|send|receive|remittances/], ["Digital wallet", /wallet|pay with|payments app/], ["Business payments", /business|infrastructure|banking/]],
  health: [["Health information", /information|guidance|research/], ["Find doctors", /doctors|providers|consult|book/], ["Medicine", /medicines|prescription|pharmacy/]],
  travel: [["Flights", /flights/], ["Stays", /hotel|stays|hostels|accommodation/], ["Transport", /ride|trains|buses|routes|railways|cars/], ["Guides & reviews", /guides|reviews|destination/]],
};

export function featuresFor(site: Website) {
  const text = `${site.name} ${site.description}`.toLowerCase();
  return (featureRules[site.category] ?? []).filter(([, pattern]) => pattern.test(text)).map(([label]) => label);
}

export function availableFeatures(sites: Website[]) {
  return [...new Set(sites.flatMap(featuresFor))];
}