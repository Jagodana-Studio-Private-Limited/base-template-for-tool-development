export const siteConfig = {
  name: "YAML to JSON Converter",
  title: "YAML to JSON Converter — Bidirectional, Instant, 100% Free",
  description:
    "Convert YAML to JSON and JSON to YAML instantly in your browser. No upload, no signup, no server — 100% client-side. Validates, pretty-prints, and handles complex nested structures.",
  url: "https://yaml-to-json-converter.tools.jagodana.com",
  ogImage: "/opengraph-image",

  headerIcon: "ArrowLeftRight",
  brandAccentColor: "#6366f1",

  keywords: [
    "yaml to json",
    "json to yaml",
    "yaml converter",
    "json converter",
    "yaml parser",
    "convert yaml",
    "online yaml editor",
    "yaml to json online",
    "json to yaml online",
    "yaml formatter",
    "yaml validator",
    "developer tools",
  ],
  applicationCategory: "DeveloperApplication",

  themeColor: "#3b82f6",

  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  socialProfiles: [
    "https://twitter.com/jagodana",
  ],

  links: {
    github: "https://github.com/Jagodana-Studio-Private-Limited/yaml-to-json-converter",
    website: "https://jagodana.com",
  },

  footer: {
    about:
      "Instantly convert between YAML and JSON in your browser. Validate, format, and copy — all client-side with zero data uploads.",
    featuresTitle: "Features",
    features: [
      "YAML → JSON conversion",
      "JSON → YAML conversion",
      "Syntax error detection",
      "Pretty-print & minify",
    ],
  },

  hero: {
    badge: "Instant YAML ↔ JSON",
    titleLine1: "Convert YAML & JSON",
    titleGradient: "in Seconds",
    subtitle:
      "Paste YAML and get JSON. Paste JSON and get YAML. Validates in real-time, runs entirely in your browser — no server, no sign-up, no data ever leaves your machine.",
  },

  featureCards: [
    {
      icon: "🔄",
      title: "Bidirectional",
      description:
        "Convert YAML to JSON or JSON to YAML with a single click. Auto-detects the input format.",
    },
    {
      icon: "✅",
      title: "Live Validation",
      description:
        "Instant syntax error highlighting with clear messages so you can fix issues fast.",
    },
    {
      icon: "🔒",
      title: "100% Private",
      description:
        "All processing happens in your browser. Your data never touches a server.",
    },
  ],

  relatedTools: [
    {
      name: "JSON Formatter",
      url: "https://json-formatter.tools.jagodana.com",
      icon: "📋",
      description: "Format and validate JSON with syntax highlighting.",
    },
    {
      name: "JSON Diff Viewer",
      url: "https://json-diff-viewer.tools.jagodana.com",
      icon: "🔍",
      description: "Compare two JSON objects and see the differences.",
    },
    {
      name: "JSON to Zod",
      url: "https://json-to-zod.tools.jagodana.com",
      icon: "🛡️",
      description: "Generate Zod schemas from any JSON structure.",
    },
    {
      name: "Regex Playground",
      url: "https://regex-playground.tools.jagodana.com",
      icon: "🧪",
      description: "Build, test and debug regular expressions in real-time.",
    },
    {
      name: "Encoding Explorer",
      url: "https://encoding-explorer.tools.jagodana.com",
      icon: "🔤",
      description: "Encode and decode Base64, URL, HTML entities and more.",
    },
    {
      name: "XML Formatter",
      url: "https://xml-formatter.tools.jagodana.com",
      icon: "📄",
      description: "Format, validate and minify XML documents.",
    },
  ],

  howToSteps: [
    {
      name: "Paste your YAML or JSON",
      text: "Paste your YAML or JSON text into the left panel. The tool auto-detects the format.",
      url: "",
    },
    {
      name: "Click Convert",
      text: "Click the Convert button or use the direction arrows to convert between YAML and JSON instantly.",
      url: "",
    },
    {
      name: "Copy the result",
      text: "Click Copy to copy the output to your clipboard, or download it as a file.",
      url: "",
    },
  ],
  howToTotalTime: "PT30S",

  faq: [
    {
      question: "Is this YAML to JSON converter free?",
      answer:
        "Yes, completely free — no signup, no ads, no rate limits. All conversion happens in your browser so your data stays private.",
    },
    {
      question: "Does it support all YAML features?",
      answer:
        "The converter supports YAML 1.2 including anchors, aliases, multi-line strings, nested structures, arrays, booleans, nulls, and numbers. Edge cases in YAML 1.1 (like implicit boolean values such as 'yes'/'no') are handled by the js-yaml library.",
    },
    {
      question: "Can I convert JSON back to YAML?",
      answer:
        "Yes — the tool is fully bidirectional. Paste JSON in the left panel and click the JSON→YAML direction button. The output will be formatted YAML with proper indentation.",
    },
    {
      question: "What happens to my data?",
      answer:
        "Nothing is sent to any server. Conversion runs entirely in JavaScript inside your browser tab. Your YAML and JSON data never leave your device.",
    },
    {
      question: "Why is my YAML not converting?",
      answer:
        "The error panel shows exactly what went wrong. Common issues include incorrect indentation (YAML is indentation-sensitive), missing colons after keys, or mixing tabs and spaces. Use spaces only in YAML.",
    },
    {
      question: "Can I pretty-print or minify the JSON output?",
      answer:
        "Yes — use the Pretty / Minify toggle above the output panel to switch between formatted JSON with 2-space indentation and compact single-line JSON.",
    },
  ],

  pages: {
    "/": {
      title: "YAML to JSON Converter — Bidirectional, Instant, 100% Free",
      description:
        "Convert YAML to JSON and JSON to YAML instantly in your browser. No upload, no signup — 100% client-side YAML validator and converter.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
