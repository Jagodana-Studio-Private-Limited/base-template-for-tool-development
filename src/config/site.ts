export const siteConfig = {
  name: "YAML to JSON Converter",
  title: "YAML to JSON Converter — Free Online YAML to JSON Tool",
  description:
    "Convert YAML to JSON instantly in your browser. Paste your YAML and get valid, formatted JSON in one click. 100% client-side, no uploads, no login.",
  url: "https://yaml-to-json-converter.tools.jagodana.com",
  ogImage: "/opengraph-image",

  // Header
  headerIcon: "ArrowLeftRight",
  brandAccentColor: "#6366f1", // indigo-500

  // SEO
  keywords: [
    "yaml to json",
    "yaml to json converter",
    "yaml json online",
    "convert yaml to json",
    "yaml parser online",
    "yaml to json free",
    "yaml formatter",
    "json formatter",
    "developer tools",
    "devtools",
  ],
  applicationCategory: "DeveloperApplication",

  // Theme
  themeColor: "#3b82f6", // blue-500

  // Branding
  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  // Social Profiles
  socialProfiles: [
    "https://twitter.com/jagodana",
  ],

  // Links
  links: {
    github:
      "https://github.com/Jagodana-Studio-Private-Limited/yaml-to-json-converter",
    website: "https://jagodana.com",
  },

  // Footer
  footer: {
    about:
      "Free online YAML to JSON converter. Paste your YAML config, Kubernetes manifest, Docker Compose file, or any YAML document and instantly get valid, formatted JSON — all processing happens in your browser.",
    featuresTitle: "Features",
    features: [
      "Instant YAML → JSON conversion",
      "Formatted & minified output",
      "Syntax error highlighting",
      "100% client-side & private",
    ],
  },

  // Hero Section
  hero: {
    badge: "Free Developer Tool",
    titleLine1: "Convert YAML to JSON",
    titleGradient: "Instantly",
    subtitle:
      "Paste any YAML — Kubernetes manifests, Docker Compose files, CI configs, or API specs — and get clean, formatted JSON in one click. No login, no uploads, no limits.",
  },

  // Feature Cards
  featureCards: [
    {
      icon: "⚡",
      title: "Instant Conversion",
      description:
        "Convert as you type or paste. No button clicks needed — results appear immediately.",
    },
    {
      icon: "🔒",
      title: "100% Private",
      description:
        "All processing happens in your browser. Your YAML never leaves your device.",
    },
    {
      icon: "🎨",
      title: "Formatted Output",
      description:
        "Choose between pretty-printed JSON with configurable indentation or compact minified output.",
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
      name: "Regex Playground",
      url: "https://regex-playground.tools.jagodana.com",
      icon: "🧪",
      description: "Build, test & debug regular expressions in real-time.",
    },
    {
      name: "Base64 Encoder",
      url: "https://base64-encoder.tools.jagodana.com",
      icon: "🔤",
      description: "Encode and decode Base64 strings instantly.",
    },
    {
      name: "Timestamp Converter",
      url: "https://timestamp-converter.tools.jagodana.com",
      icon: "🕐",
      description: "Convert Unix timestamps to human-readable dates.",
    },
    {
      name: "Favicon Generator",
      url: "https://favicon-generator.tools.jagodana.com",
      icon: "🎨",
      description: "Generate all favicon sizes + manifest from any image.",
    },
    {
      name: "Color Palette Explorer",
      url: "https://color-palette-explorer.tools.jagodana.com",
      icon: "🎭",
      description: "Extract color palettes from any image.",
    },
  ],

  // HowTo Steps
  howToSteps: [
    {
      name: "Paste your YAML",
      text: "Copy your YAML content — a Kubernetes manifest, Docker Compose file, CI config, or any YAML document — and paste it into the left panel.",
      url: "",
    },
    {
      name: "JSON appears instantly",
      text: "The converter parses your YAML and displays formatted JSON in the right panel immediately. Any syntax errors are highlighted with a clear message.",
      url: "",
    },
    {
      name: "Copy or download",
      text: "Click Copy to copy the JSON to your clipboard, or choose Minify for compact output. All processing stays in your browser — nothing is sent to any server.",
      url: "",
    },
  ],
  howToTotalTime: "PT30S",

  // FAQ
  faq: [
    {
      question: "Is this YAML to JSON converter free?",
      answer:
        "Yes, completely free. No sign-up, no API key, no limits. Open the page and start converting.",
    },
    {
      question: "Does my YAML data get sent to a server?",
      answer:
        "No. Conversion runs entirely in your browser using JavaScript. Your YAML never leaves your device, making it safe to use with private configs, API keys, or credentials.",
    },
    {
      question: "What YAML features does it support?",
      answer:
        "The converter handles YAML 1.2 including multi-document files, anchors & aliases, block and flow sequences/mappings, multi-line strings (literal and folded blocks), comments (stripped in output), and all scalar types (strings, numbers, booleans, null).",
    },
    {
      question: "What happens with YAML anchors and aliases?",
      answer:
        "Anchors (&) and aliases (*) are fully resolved. The JSON output contains the expanded values — aliases are replaced with the data they reference.",
    },
    {
      question: "Can I convert multi-document YAML files?",
      answer:
        "Yes. YAML files with multiple documents separated by --- are converted to a JSON array, one element per document.",
    },
    {
      question: "What's the difference between pretty-print and minify?",
      answer:
        "Pretty-print formats the JSON with 2-space indentation for readability. Minify removes all whitespace to produce the smallest possible JSON string, useful for APIs or storage.",
    },
  ],

  // Pages registry
  pages: {
    "/": {
      title:
        "YAML to JSON Converter — Free Online YAML to JSON Tool",
      description:
        "Convert YAML to JSON instantly in your browser. Paste your YAML and get valid, formatted JSON in one click. 100% client-side, no uploads, no login.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
