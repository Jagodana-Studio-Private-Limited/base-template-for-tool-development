export const siteConfig = {
  name: "User Agent Parser",
  title: "User Agent Parser — Decode Any UA String Instantly",
  description:
    "Parse any User-Agent string to identify browser name, version, OS, device type, and rendering engine. Paste a UA string or use your own — 100% client-side.",
  url: "https://user-agent-parser.tools.jagodana.com",
  ogImage: "/opengraph-image",

  headerIcon: "MonitorSmartphone",
  brandAccentColor: "#0ea5e9",

  keywords: [
    "user agent parser",
    "parse user agent string",
    "user agent decoder",
    "browser detection tool",
    "ua string parser",
    "user agent analyzer",
    "browser version detector",
    "OS detection from user agent",
    "device type detector",
    "online user agent parser",
  ],
  applicationCategory: "DeveloperApplication",

  themeColor: "#0284c7",

  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  socialProfiles: [
    "https://twitter.com/jagodana",
  ],

  links: {
    github: "https://github.com/Jagodana-Studio-Private-Limited/user-agent-parser",
    website: "https://jagodana.com",
  },

  footer: {
    about:
      "A free, browser-based User-Agent parser. Instantly identify any UA string's browser, OS, device, and engine — no data ever leaves your device.",
    featuresTitle: "Features",
    features: [
      "Parse any UA string instantly",
      "Detect browser, OS, device & engine",
      "Auto-fill your current browser's UA",
      "Copy results as JSON",
    ],
  },

  hero: {
    badge: "100% Client-Side & Private",
    titleLine1: "Decode Any",
    titleGradient: "User-Agent String",
    subtitle:
      "Instantly identify the browser, operating system, device type, and rendering engine behind any User-Agent string. Paste any UA or analyse your own in one click.",
  },

  featureCards: [
    {
      icon: "🔍",
      title: "Instant Parsing",
      description:
        "Paste any UA string and see a fully-structured breakdown of browser, OS, device type, and engine in milliseconds.",
    },
    {
      icon: "🛡️",
      title: "100% Private",
      description:
        "All parsing happens in your browser — no UA strings are ever sent to a server. Your data never leaves your device.",
    },
    {
      icon: "📋",
      title: "Copy as JSON",
      description:
        "Export the parsed result as a clean JSON object to paste directly into code, logs, or bug reports.",
    },
  ],

  relatedTools: [
    {
      name: "HTTP Status Debugger",
      url: "https://http-status-debugger.tools.jagodana.com",
      icon: "🌐",
      description: "Look up every HTTP status code with examples.",
    },
    {
      name: "Encoding Explorer",
      url: "https://encoding-explorer.tools.jagodana.com",
      icon: "🔐",
      description: "Encode & decode Base64, URL, HTML entities and more.",
    },
    {
      name: "JSON Formatter",
      url: "https://json-formatter.tools.jagodana.com",
      icon: "📄",
      description: "Format, validate and minify JSON online.",
    },
    {
      name: "Regex Playground",
      url: "https://regex-playground.tools.jagodana.com",
      icon: "🧪",
      description: "Build, test & debug regular expressions in real-time.",
    },
    {
      name: "OG Preview",
      url: "https://og-preview.tools.jagodana.com",
      icon: "🖼️",
      description: "Preview how your URL looks when shared on social media.",
    },
    {
      name: "CORS Headers Generator",
      url: "https://cors-headers-generator.tools.jagodana.com",
      icon: "🔗",
      description: "Generate correct CORS headers for any framework.",
    },
  ],

  howToSteps: [
    {
      name: "Paste or auto-fill a UA string",
      text: "Click 'Use My Browser UA' to load your own User-Agent, or paste any UA string into the input field.",
      url: "",
    },
    {
      name: "Click Parse",
      text: "Hit the Parse button to instantly decode the UA string into browser, OS, device type, and engine fields.",
      url: "",
    },
    {
      name: "Copy or share the result",
      text: "Copy the structured result as JSON, or share individual fields directly from the results panel.",
      url: "",
    },
  ],
  howToTotalTime: "PT30S",

  faq: [
    {
      question: "What is a User-Agent string?",
      answer:
        "A User-Agent (UA) string is a text field sent by a browser or HTTP client in the request header. It identifies the application, operating system, vendor, and version making the request. Web servers use it to tailor responses, and developers use it for browser detection and analytics.",
    },
    {
      question: "Is my User-Agent data sent to a server?",
      answer:
        "No. All parsing happens entirely in your browser using JavaScript. Your UA string never leaves your device — there are no server requests, no logging, and no tracking.",
    },
    {
      question: "Can I parse mobile or bot User-Agent strings?",
      answer:
        "Yes. The parser handles browser UAs (Chrome, Firefox, Safari, Edge), mobile UAs (iOS, Android), desktop OS UAs, headless browsers, and common crawler or bot strings like Googlebot.",
    },
    {
      question: "What information does the parser extract?",
      answer:
        "The parser extracts: browser name and version, operating system name and version, device type (desktop, mobile, tablet), device vendor and model where available, and the rendering engine (Blink, Gecko, WebKit, etc.).",
    },
    {
      question: "How do I find my own User-Agent string?",
      answer:
        "Click the 'Use My Browser UA' button — it auto-fills the input with your browser's current User-Agent from navigator.userAgent. You can also find it in browser dev tools under Network → request headers.",
    },
  ],

  pages: {
    "/": {
      title: "User Agent Parser — Decode Any UA String Instantly",
      description:
        "Parse any User-Agent string to identify browser name, version, OS, device type, and rendering engine. 100% client-side.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
