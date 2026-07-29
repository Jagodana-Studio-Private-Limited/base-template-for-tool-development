export const siteConfig = {
  // ====== CUSTOMIZE THESE FOR EACH TOOL ======
  name: "cURL to Fetch Converter",
  title: "cURL to Fetch Converter — Convert curl Commands to JavaScript fetch()",
  description:
    "Instantly convert any cURL command to clean JavaScript fetch() or TypeScript code. Supports headers, methods, bodies, auth, form data, and more — 100% client-side.",
  url: "https://curl-to-fetch-converter.tools.jagodana.com",
  ogImage: "/opengraph-image",

  // Header
  headerIcon: "Terminal",
  brandAccentColor: "#6366f1",

  // SEO
  keywords: [
    "curl to fetch converter",
    "curl to javascript",
    "curl to fetch",
    "convert curl command",
    "curl to typescript",
    "curl command parser",
    "fetch api converter",
    "curl to node fetch",
    "api request converter",
    "developer tools",
  ],
  applicationCategory: "DeveloperApplication",

  // Theme
  themeColor: "#3b82f6",

  // Branding
  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  // Social Profiles
  socialProfiles: ["https://twitter.com/jagodana"],

  // Links
  links: {
    github: "https://github.com/Jagodana-Studio-Private-Limited/curl-to-fetch-converter",
    website: "https://jagodana.com",
  },

  // Footer
  footer: {
    about:
      "Free online tool to convert cURL commands to JavaScript fetch() API calls. Perfect for web developers integrating API docs into their projects.",
    featuresTitle: "Features",
    features: [
      "Paste & convert instantly",
      "JavaScript & TypeScript output",
      "Supports all common curl flags",
      "100% client-side, no data sent",
    ],
  },

  // Hero Section
  hero: {
    badge: "Free Developer Tool",
    titleLine1: "Convert cURL to",
    titleGradient: "JavaScript Fetch",
    subtitle:
      "Paste any cURL command and get clean, ready-to-use JavaScript fetch() or TypeScript code in seconds. Supports headers, methods, request bodies, basic auth, form data, and more.",
  },

  // Feature Cards
  featureCards: [
    {
      icon: "⚡",
      title: "Instant Conversion",
      description:
        "Paste your curl command and get clean fetch() code instantly — no button click needed.",
    },
    {
      icon: "🧩",
      title: "Full Flag Support",
      description:
        "Handles -X, -H, -d, -u, -F, --data-raw, --user-agent, --compressed and all common curl flags.",
    },
    {
      icon: "🔒",
      title: "100% Private",
      description:
        "Everything runs in your browser. Your API keys and request data never leave your machine.",
    },
  ],

  // Related Tools
  relatedTools: [
    {
      name: "JSON Formatter",
      url: "https://json-formatter.tools.jagodana.com",
      icon: "📋",
      description: "Format and validate JSON with syntax highlighting.",
    },
    {
      name: "Base64 Encoder",
      url: "https://base64-encoder.tools.jagodana.com",
      icon: "🔢",
      description: "Encode and decode Base64 strings instantly.",
    },
    {
      name: "JWT Decoder",
      url: "https://jwt-decoder.tools.jagodana.com",
      icon: "🔑",
      description: "Decode and inspect JWT tokens securely in your browser.",
    },
    {
      name: "Regex Playground",
      url: "https://regex-playground.tools.jagodana.com",
      icon: "🧪",
      description: "Build, test & debug regular expressions in real-time.",
    },
    {
      name: "Timestamp Converter",
      url: "https://unix-timestamp-converter.tools.jagodana.com",
      icon: "🕐",
      description: "Convert Unix timestamps to human-readable dates.",
    },
    {
      name: "URL Encoder",
      url: "https://url-encoder.tools.jagodana.com",
      icon: "🔗",
      description: "Encode and decode URL components safely.",
    },
  ],

  // HowTo Steps
  howToSteps: [
    {
      name: "Paste Your curl Command",
      text: "Copy any curl command from API docs, Postman, or your terminal and paste it into the input box.",
      url: "",
    },
    {
      name: "Choose Output Language",
      text: "Select JavaScript or TypeScript as your target output format.",
      url: "",
    },
    {
      name: "Copy the Generated Code",
      text: "Click 'Copy Code' to copy the generated fetch() snippet and paste it directly into your project.",
      url: "",
    },
  ],
  howToTotalTime: "PT30S",

  // FAQ
  faq: [
    {
      question: "What curl flags does this tool support?",
      answer:
        "The converter supports all common curl flags including: -X / --request (HTTP method), -H / --header (headers), -d / --data / --data-raw / --data-binary (request body), -u / --user (basic auth), -F / --form (multipart form data), -A / --user-agent (User-Agent), -e / --referer (Referer), --compressed (Accept-Encoding), -L / --location (follow redirects note), and -b / --cookie (cookies).",
    },
    {
      question: "Does this tool support TypeScript output?",
      answer:
        "Yes! Toggle to TypeScript mode to get output with proper type annotations, including typed RequestInit options.",
    },
    {
      question: "Is my data safe? Does it get sent to a server?",
      answer:
        "Completely safe. The entire conversion happens in your browser using JavaScript — no data is ever sent to any server. Your API keys, tokens, and request bodies remain entirely private.",
    },
    {
      question: "What should I do with the generated fetch() code?",
      answer:
        "Paste it directly into any JavaScript or TypeScript project. It works in modern browsers, Node.js (v18+), and any environment that supports the native fetch() API. For older Node.js versions, you may need to import 'node-fetch'.",
    },
  ],

  // ====== PAGES ======
  pages: {
    "/": {
      title:
        "cURL to Fetch Converter — Convert curl Commands to JavaScript fetch()",
      description:
        "Instantly convert any cURL command to clean JavaScript fetch() or TypeScript code. Supports headers, methods, bodies, auth, form data, and more — 100% client-side.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
