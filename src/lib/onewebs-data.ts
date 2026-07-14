import {
  Bot, Search, GraduationCap, Palette, Image as ImageIcon, Film, Music, Scissors,
  MessageCircle, FileText, Cloud, FileDown, Code2, ShoppingBag, PlaySquare,
  CreditCard, HeartPulse, Plane,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Pricing = "Free" | "Paid" | "Freemium" | "Free + Paid";

export type Website = {
  name: string;
  url: string;
  domain: string;
  description: string;
  category: string;
  pricing: Pricing;
  official?: boolean;
  popular?: boolean;
  isNew?: boolean;
};

export type Category = {
  id: string;
  name: string;
  icon: LucideIcon;
  emoji: string;
  tint: string; // tailwind bg tint
  iconColor: string;
};

export const categories: Category[] = [
  { id: "ai-chatbots", name: "AI Chatbots", icon: Bot, emoji: "🤖", tint: "bg-blue-50", iconColor: "text-blue-600" },
  { id: "search-engines", name: "Search Engines", icon: Search, emoji: "🔍", tint: "bg-emerald-50", iconColor: "text-emerald-600" },
  { id: "learning", name: "Learning", icon: GraduationCap, emoji: "📚", tint: "bg-violet-50", iconColor: "text-violet-600" },
  { id: "graphic-design", name: "Graphic Design", icon: Palette, emoji: "🎨", tint: "bg-pink-50", iconColor: "text-pink-600" },
  { id: "ai-image", name: "AI Image", icon: ImageIcon, emoji: "🖼️", tint: "bg-amber-50", iconColor: "text-amber-600" },
  { id: "ai-video", name: "AI Video", icon: Film, emoji: "🎥", tint: "bg-rose-50", iconColor: "text-rose-600" },
  { id: "voice-music", name: "Voice & Music", icon: Music, emoji: "🎵", tint: "bg-fuchsia-50", iconColor: "text-fuchsia-600" },
  { id: "video-editing", name: "Video Editing", icon: Scissors, emoji: "📱", tint: "bg-cyan-50", iconColor: "text-cyan-600" },
  { id: "communication", name: "Communication", icon: MessageCircle, emoji: "💬", tint: "bg-sky-50", iconColor: "text-sky-600" },
  { id: "productivity", name: "Productivity", icon: FileText, emoji: "📄", tint: "bg-indigo-50", iconColor: "text-indigo-600" },
  { id: "cloud-storage", name: "Cloud Storage", icon: Cloud, emoji: "☁️", tint: "bg-slate-100", iconColor: "text-slate-600" },
  { id: "pdf-tools", name: "PDF & File Tools", icon: FileDown, emoji: "📂", tint: "bg-red-50", iconColor: "text-red-600" },
  { id: "developers", name: "Developers", icon: Code2, emoji: "💻", tint: "bg-zinc-100", iconColor: "text-zinc-700" },
  { id: "shopping", name: "Shopping", icon: ShoppingBag, emoji: "🛍", tint: "bg-orange-50", iconColor: "text-orange-600" },
  { id: "entertainment", name: "Entertainment", icon: PlaySquare, emoji: "🎬", tint: "bg-red-50", iconColor: "text-red-600" },
  { id: "payments", name: "Payments", icon: CreditCard, emoji: "💳", tint: "bg-green-50", iconColor: "text-green-600" },
  { id: "health", name: "Health", icon: HeartPulse, emoji: "🩺", tint: "bg-rose-50", iconColor: "text-rose-600" },
  { id: "travel", name: "Travel", icon: Plane, emoji: "🌍", tint: "bg-sky-50", iconColor: "text-sky-600" },
];

const w = (
  name: string, url: string, description: string, category: string, pricing: Pricing,
  extras: Partial<Website> = {},
): Website => ({
  name, url, domain: new URL(url).hostname.replace(/^www\./, ""),
  description, category, pricing, official: true, ...extras,
});

export const websites: Website[] = [
  // AI Chatbots
  w("ChatGPT", "https://chat.openai.com", "AI assistant for writing, learning, coding, and more.", "ai-chatbots", "Free + Paid", { popular: true }),
  w("Claude", "https://claude.ai", "AI assistant built by Anthropic to help you do more.", "ai-chatbots", "Free + Paid", { popular: true }),
  w("Gemini", "https://gemini.google.com", "Google's AI assistant for information and ideas.", "ai-chatbots", "Free", { popular: true }),
  w("Perplexity", "https://www.perplexity.ai", "AI-powered search engine for real answers.", "ai-chatbots", "Free + Paid", { popular: true }),
  w("Microsoft Copilot", "https://copilot.microsoft.com", "Your everyday AI companion by Microsoft.", "ai-chatbots", "Free", { popular: true }),
  w("Grok", "https://grok.com", "Conversational AI by xAI.", "ai-chatbots", "Free + Paid"),
  w("Poe", "https://poe.com", "Chat with many AI models in one place.", "ai-chatbots", "Freemium"),
  w("DeepSeek", "https://www.deepseek.com", "Open, powerful AI models and chat.", "ai-chatbots", "Free"),

  // Search
  w("Google", "https://www.google.com", "The world's most popular search engine.", "search-engines", "Free", { popular: true }),
  w("Bing", "https://www.bing.com", "Microsoft's search engine with AI features.", "search-engines", "Free"),
  w("DuckDuckGo", "https://duckduckgo.com", "Privacy-focused search engine.", "search-engines", "Free"),
  w("Yahoo Search", "https://search.yahoo.com", "Yahoo's classic web search.", "search-engines", "Free"),
  w("Brave Search", "https://search.brave.com", "Independent, private search.", "search-engines", "Free"),
  w("Startpage", "https://www.startpage.com", "Private Google search results.", "search-engines", "Free"),
  w("Ecosia", "https://www.ecosia.org", "The search engine that plants trees.", "search-engines", "Free"),
  w("Qwant", "https://www.qwant.com", "European private search engine.", "search-engines", "Free"),

  // Learning
  w("Khan Academy", "https://www.khanacademy.org", "Free world-class education for anyone.", "learning", "Free"),
  w("Coursera", "https://www.coursera.org", "Online courses from top universities.", "learning", "Freemium"),
  w("Udemy", "https://www.udemy.com", "Learn anything, anytime, anywhere.", "learning", "Paid"),
  w("freeCodeCamp", "https://www.freecodecamp.org", "Learn to code for free.", "learning", "Free"),
  w("Duolingo", "https://www.duolingo.com", "Learn languages for free.", "learning", "Freemium"),
  w("edX", "https://www.edx.org", "Online courses from Harvard, MIT, and more.", "learning", "Freemium"),
  w("Skillshare", "https://www.skillshare.com", "Online classes for creators.", "learning", "Paid"),
  w("Codecademy", "https://www.codecademy.com", "Learn to code interactively.", "learning", "Freemium"),

  // Graphic Design
  w("Canva", "https://www.canva.com", "Design anything and publish anywhere.", "graphic-design", "Freemium", { popular: true }),
  w("Figma", "https://www.figma.com", "Collaborative interface design tool.", "graphic-design", "Freemium"),
  w("Adobe Express", "https://www.adobe.com/express", "Quick and easy content creation.", "graphic-design", "Freemium"),
  w("Photopea", "https://www.photopea.com", "Free online photo editor.", "graphic-design", "Free"),
  w("Pixlr", "https://pixlr.com", "AI-powered photo editing.", "graphic-design", "Freemium"),
  w("VistaCreate", "https://create.vista.com", "Easy graphic design and video maker.", "graphic-design", "Freemium"),
  w("Affinity Designer", "https://affinity.serif.com/designer", "Professional vector design software.", "graphic-design", "Paid"),
  w("CorelDRAW", "https://www.coreldraw.com", "Professional graphic design suite.", "graphic-design", "Paid"),

  // AI Image
  w("Midjourney", "https://www.midjourney.com", "AI image generation.", "ai-image", "Paid"),
  w("Leonardo AI", "https://leonardo.ai", "Creative AI image platform.", "ai-image", "Freemium"),
  w("Ideogram", "https://ideogram.ai", "AI images with legible text.", "ai-image", "Freemium"),
  w("Adobe Firefly", "https://firefly.adobe.com", "Adobe's generative AI.", "ai-image", "Freemium"),
  w("Recraft", "https://www.recraft.ai", "AI for designers.", "ai-image", "Freemium"),
  w("Playground AI", "https://playground.com", "Free AI image creation.", "ai-image", "Freemium"),
  w("Krea AI", "https://www.krea.ai", "Real-time AI image generation.", "ai-image", "Freemium"),
  w("Stable Diffusion", "https://stability.ai", "Open-source AI image generation.", "ai-image", "Free + Paid"),

  // AI Video
  w("Runway", "https://runwayml.com", "AI video generation and editing.", "ai-video", "Freemium"),
  w("Kling AI", "https://kling.kuaishou.com", "AI video from text and images.", "ai-video", "Freemium"),
  w("Pika", "https://pika.art", "Idea-to-video AI platform.", "ai-video", "Freemium"),
  w("PixVerse", "https://pixverse.ai", "AI video creation for everyone.", "ai-video", "Freemium"),
  w("Luma AI", "https://lumalabs.ai", "Dream machine for AI video.", "ai-video", "Freemium"),
  w("Hailuo AI", "https://hailuoai.video", "AI video generation by MiniMax.", "ai-video", "Freemium"),
  w("InVideo AI", "https://invideo.io/ai", "AI-powered video creation.", "ai-video", "Freemium"),
  w("Synthesia", "https://www.synthesia.io", "AI video generation with avatars.", "ai-video", "Paid"),

  // Voice & Music
  w("ElevenLabs", "https://elevenlabs.io", "Realistic AI voice generation.", "voice-music", "Freemium"),
  w("Murf AI", "https://murf.ai", "AI voiceovers in minutes.", "voice-music", "Freemium"),
  w("PlayHT", "https://play.ht", "AI voice generator and text to speech.", "voice-music", "Freemium"),
  w("Suno", "https://suno.com", "Create original songs with AI.", "voice-music", "Freemium"),
  w("Udio", "https://www.udio.com", "AI music creation platform.", "voice-music", "Freemium"),
  w("AIVA", "https://www.aiva.ai", "AI music composition.", "voice-music", "Freemium"),
  w("Soundraw", "https://soundraw.io", "AI music generator for creators.", "voice-music", "Freemium"),
  w("Voicemod", "https://www.voicemod.net", "Real-time voice changer and soundboard.", "voice-music", "Freemium"),

  // Video Editing
  w("CapCut", "https://www.capcut.com", "All-in-one video editor.", "video-editing", "Freemium"),
  w("VN Editor", "https://www.vlognow.me", "Free professional video editor.", "video-editing", "Free"),
  w("DaVinci Resolve", "https://www.blackmagicdesign.com/products/davinciresolve", "Pro video editing and color.", "video-editing", "Free + Paid"),
  w("Clipchamp", "https://clipchamp.com", "Easy online video editor.", "video-editing", "Freemium"),
  w("Descript", "https://www.descript.com", "Edit video like a doc.", "video-editing", "Freemium"),
  w("Filmora", "https://filmora.wondershare.com", "Easy and powerful video editor.", "video-editing", "Freemium"),
  w("Adobe Premiere Pro", "https://www.adobe.com/products/premiere.html", "Industry-standard video editing.", "video-editing", "Paid"),
  w("Final Cut Pro", "https://www.apple.com/final-cut-pro", "Professional video editing for Mac.", "video-editing", "Paid"),

  // Communication
  w("WhatsApp", "https://www.whatsapp.com", "Simple, secure messaging.", "communication", "Free"),
  w("Telegram", "https://telegram.org", "Fast and secure messaging.", "communication", "Free"),
  w("Discord", "https://discord.com", "Voice, video, and text chat.", "communication", "Freemium"),
  w("Zoom", "https://zoom.us", "Video meetings and webinars.", "communication", "Freemium"),
  w("Google Meet", "https://meet.google.com", "Secure video meetings.", "communication", "Free"),
  w("Slack", "https://slack.com", "Where work happens — team messaging.", "communication", "Freemium"),
  w("Microsoft Teams", "https://www.microsoft.com/microsoft-teams", "Chat, meet, and collaborate.", "communication", "Freemium"),
  w("Signal", "https://signal.org", "Private, encrypted messaging.", "communication", "Free"),

  // Productivity
  w("Notion", "https://www.notion.so", "All-in-one workspace for notes, tasks, and more.", "productivity", "Freemium", { popular: true }),
  w("Google Docs", "https://docs.google.com", "Online docs, collaborate anywhere.", "productivity", "Free"),
  w("Google Sheets", "https://sheets.google.com", "Online spreadsheets.", "productivity", "Free"),
  w("ClickUp", "https://clickup.com", "One app to replace them all.", "productivity", "Freemium"),
  w("Trello", "https://trello.com", "Boards, lists, and cards.", "productivity", "Freemium"),
  w("Microsoft 365", "https://www.microsoft.com/microsoft-365", "Word, Excel, PowerPoint, and more.", "productivity", "Paid"),
  w("Airtable", "https://www.airtable.com", "Part spreadsheet, part database.", "productivity", "Freemium"),
  w("Asana", "https://asana.com", "Work management for teams.", "productivity", "Freemium"),

  // Cloud Storage
  w("Google Drive", "https://drive.google.com", "Cloud storage by Google.", "cloud-storage", "Freemium"),
  w("Dropbox", "https://www.dropbox.com", "Files anywhere, always in sync.", "cloud-storage", "Freemium"),
  w("OneDrive", "https://onedrive.live.com", "Microsoft's cloud storage.", "cloud-storage", "Freemium"),
  w("MEGA", "https://mega.io", "Secure cloud storage.", "cloud-storage", "Freemium"),
  w("Box", "https://www.box.com", "Cloud content management.", "cloud-storage", "Freemium"),
  w("iCloud", "https://www.icloud.com", "Apple's cloud storage and sync.", "cloud-storage", "Freemium"),
  w("Sync.com", "https://www.sync.com", "Secure cloud storage with encryption.", "cloud-storage", "Freemium"),
  w("pCloud", "https://www.pcloud.com", "Lifetime cloud storage plans.", "cloud-storage", "Freemium"),

  // PDF
  w("iLovePDF", "https://www.ilovepdf.com", "Every tool you need for PDFs.", "pdf-tools", "Freemium"),
  w("Smallpdf", "https://smallpdf.com", "The platform to work with PDFs.", "pdf-tools", "Freemium"),
  w("PDF24", "https://tools.pdf24.org", "Free PDF tools online.", "pdf-tools", "Free"),
  w("CloudConvert", "https://cloudconvert.com", "Convert anything to anything.", "pdf-tools", "Freemium"),
  w("TinyPNG", "https://tinypng.com", "Smart PNG and JPEG compression.", "pdf-tools", "Free"),
  w("Sejda PDF", "https://www.sejda.com", "Online PDF editor and tools.", "pdf-tools", "Freemium"),
  w("PDF Candy", "https://pdfcandy.com", "Free PDF tools online.", "pdf-tools", "Freemium"),
  w("Convertio", "https://convertio.co", "Convert files between 300+ formats.", "pdf-tools", "Freemium"),

  // Developers
  w("GitHub", "https://github.com", "Platform for developers to build and ship software.", "developers", "Free", { popular: true }),
  w("GitLab", "https://gitlab.com", "The DevSecOps platform.", "developers", "Freemium"),
  w("Vercel", "https://vercel.com", "Frontend cloud for developers.", "developers", "Freemium"),
  w("Netlify", "https://www.netlify.com", "Build, deploy, scale modern web apps.", "developers", "Freemium"),
  w("Firebase", "https://firebase.google.com", "Google's app development platform.", "developers", "Freemium"),
  w("CodePen", "https://codepen.io", "Front-end code playground.", "developers", "Freemium"),
  w("StackBlitz", "https://stackblitz.com", "Instant dev environments in the browser.", "developers", "Freemium"),
  w("Replit", "https://replit.com", "Code, collaborate, and deploy online.", "developers", "Freemium"),

  // Shopping
  w("Amazon", "https://www.amazon.com", "Everything store.", "shopping", "Free"),
  w("Flipkart", "https://www.flipkart.com", "India's leading online store.", "shopping", "Free"),
  w("Myntra", "https://www.myntra.com", "Fashion and lifestyle shopping.", "shopping", "Free"),
  w("Meesho", "https://www.meesho.com", "Affordable online shopping.", "shopping", "Free"),
  w("eBay", "https://www.ebay.com", "Buy and sell online.", "shopping", "Free"),
  w("Walmart", "https://www.walmart.com", "Save money. Live better.", "shopping", "Free"),
  w("AliExpress", "https://www.aliexpress.com", "Global online marketplace.", "shopping", "Free"),
  w("Etsy", "https://www.etsy.com", "Unique handmade and vintage items.", "shopping", "Free"),

  // Entertainment
  w("YouTube", "https://www.youtube.com", "Watch, learn, and explore millions of videos.", "entertainment", "Free", { popular: true }),
  w("Netflix", "https://www.netflix.com", "Stream movies and TV shows.", "entertainment", "Paid"),
  w("Prime Video", "https://www.primevideo.com", "Amazon Prime streaming.", "entertainment", "Paid"),
  w("Spotify", "https://www.spotify.com", "Music for everyone.", "entertainment", "Freemium"),
  w("Disney+", "https://www.disneyplus.com", "Movies, shows, and originals.", "entertainment", "Paid"),
  w("Hulu", "https://www.hulu.com", "Stream TV and movies.", "entertainment", "Paid"),
  w("Apple TV+", "https://tv.apple.com", "Apple originals and more.", "entertainment", "Paid"),
  w("Crunchyroll", "https://www.crunchyroll.com", "Anime streaming service.", "entertainment", "Freemium"),

  // Payments
  w("Google Pay", "https://pay.google.com", "Fast, simple, secure payments.", "payments", "Free"),
  w("PhonePe", "https://www.phonepe.com", "India's payments app.", "payments", "Free"),
  w("Paytm", "https://paytm.com", "Payments and financial services.", "payments", "Free"),
  w("PayPal", "https://www.paypal.com", "Global online payments.", "payments", "Free"),
  w("Stripe", "https://stripe.com", "Payments infrastructure for the internet.", "payments", "Freemium"),
  w("Wise", "https://wise.com", "International money transfers.", "payments", "Free + Paid"),
  w("Skrill", "https://www.skrill.com", "Digital wallet and payments.", "payments", "Free + Paid"),
  w("Razorpay", "https://razorpay.com", "Payments and business banking for India.", "payments", "Freemium"),

  // Health
  w("Practo", "https://www.practo.com", "Consult doctors online.", "health", "Freemium"),
  w("Apollo 24/7", "https://www.apollo247.com", "Healthcare at your doorstep.", "health", "Freemium"),
  w("WebMD", "https://www.webmd.com", "Better information. Better health.", "health", "Free"),
  w("Mayo Clinic", "https://www.mayoclinic.org", "Trusted medical information.", "health", "Free"),
  w("Healthline", "https://www.healthline.com", "Medical information you can trust.", "health", "Free"),
  w("MedlinePlus", "https://medlineplus.gov", "Trusted health information from the NIH.", "health", "Free"),
  w("Cleveland Clinic", "https://my.clevelandclinic.org", "Health information from Cleveland Clinic.", "health", "Free"),
  w("NHS", "https://www.nhs.uk", "UK's National Health Service.", "health", "Free"),

  // Travel
  w("Google Maps", "https://maps.google.com", "Explore the world.", "travel", "Free"),
  w("Booking.com", "https://www.booking.com", "Book hotels worldwide.", "travel", "Free"),
  w("Airbnb", "https://www.airbnb.com", "Stays and experiences.", "travel", "Free"),
  w("Uber", "https://www.uber.com", "Ride, eat, and more.", "travel", "Free"),
  w("MakeMyTrip", "https://www.makemytrip.com", "Flights, hotels, and holidays.", "travel", "Free"),
  w("Expedia", "https://www.expedia.com", "Flights, hotels, cars, and packages.", "travel", "Free"),
  w("Agoda", "https://www.agoda.com", "Book hotels and flights worldwide.", "travel", "Free"),
  w("Skyscanner", "https://www.skyscanner.com", "Compare cheap flights, hotels, cars.", "travel", "Free"),
];

export function categoryById(id: string) {
  return categories.find((c) => c.id === id);
}

export function faviconFor(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}