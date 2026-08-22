export const siteConfig = {
  name: "JSON to TypeScript",
  title: "JSON to TypeScript Converter — Instant Interface Generator",
  description:
    "Convert any JSON to TypeScript interfaces instantly. Paste JSON, get typed interfaces with nested types, arrays, and optional fields. 100% free, no login required.",
  url: "https://json-to-typescript.tools.jagodana.com",
  ogImage: "/opengraph-image",

  // Header
  headerIcon: "Code2",
  brandAccentColor: "#6366f1",

  // SEO
  keywords: [
    "json to typescript",
    "json to typescript interface",
    "convert json to typescript",
    "json typescript converter",
    "json to ts",
    "typescript interface generator",
    "json to type alias",
    "online typescript generator",
  ],
  applicationCategory: "DeveloperApplication",

  // Theme
  themeColor: "#3b82f6",

  // Branding
  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  // Social Profiles (for Organization schema sameAs)
  socialProfiles: [
    "https://twitter.com/jagodana",
  ],

  // Links
  links: {
    github: "https://github.com/Jagodana-Studio-Private-Limited/json-to-typescript",
    website: "https://jagodana.com",
  },

  // Footer
  footer: {
    about:
      "JSON to TypeScript Converter — free, instant, and 100% client-side. Convert JSON objects to fully-typed TypeScript interfaces with nested types and arrays in one click.",
    featuresTitle: "Features",
    features: [
      "Instant JSON to TypeScript conversion",
      "Nested object & array support",
      "Smart optional field detection",
      "Copy to clipboard in one click",
    ],
  },

  // Hero Section
  hero: {
    badge: "Free TypeScript Interface Generator",
    titleLine1: "Convert JSON to",
    titleGradient: "TypeScript Interfaces",
    subtitle:
      "Paste any JSON and get clean, typed TypeScript interfaces instantly. Handles nested objects, arrays, optional fields, and more — 100% in your browser.",
  },

  // Feature Cards
  featureCards: [
    {
      icon: "⚡",
      title: "Instant Conversion",
      description:
        "Paste JSON and get TypeScript interfaces in milliseconds, including deeply nested objects and arrays.",
    },
    {
      icon: "🔁",
      title: "Smart Type Inference",
      description:
        "Automatically detects strings, numbers, booleans, arrays, null, and nested objects to create accurate types.",
    },
    {
      icon: "📋",
      title: "One-Click Copy",
      description:
        "Copy generated TypeScript interfaces directly to your clipboard and paste straight into your codebase.",
    },
  ],

  // Related Tools
  relatedTools: [
    {
      name: "JSON Formatter",
      url: "https://json-formatter.tools.jagodana.com",
      icon: "📝",
      description: "Format, validate, and beautify JSON data.",
    },
    {
      name: "JSON to Zod",
      url: "https://json-to-zod.tools.jagodana.com",
      icon: "🛡️",
      description: "Generate Zod validation schemas from JSON.",
    },
    {
      name: "JSON Diff Viewer",
      url: "https://json-diff-viewer.tools.jagodana.com",
      icon: "🔍",
      description: "Compare two JSON objects and highlight differences.",
    },
    {
      name: "XML Formatter",
      url: "https://xml-formatter.tools.jagodana.com",
      icon: "📄",
      description: "Format and validate XML documents online.",
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
      icon: "🔐",
      description: "Encode and decode strings in multiple formats.",
    },
  ],

  // HowTo Steps
  howToSteps: [
    {
      name: "Paste your JSON",
      text: "Paste or type your JSON data into the input editor on the left side.",
      url: "",
    },
    {
      name: "Convert to TypeScript",
      text: "Click the Convert button or wait for auto-conversion to instantly generate TypeScript interfaces.",
      url: "",
    },
    {
      name: "Copy the result",
      text: "Click Copy to clipboard to copy the generated TypeScript interfaces and paste them into your project.",
      url: "",
    },
  ],
  howToTotalTime: "PT1M",

  // FAQ
  faq: [
    {
      question: "What is the JSON to TypeScript converter?",
      answer:
        "It is a free online tool that converts JSON data into TypeScript interface definitions instantly. You paste your JSON and the tool generates clean, typed TypeScript interfaces — all in your browser with no login or server upload required.",
    },
    {
      question: "Does it handle nested objects?",
      answer:
        "Yes. Nested JSON objects generate separate named TypeScript interfaces with proper type references. For example, a nested 'address' object becomes an 'Address' interface and the parent interface references it by name.",
    },
    {
      question: "Can I convert JSON arrays to TypeScript?",
      answer:
        "Yes. Arrays are converted to typed arrays such as User[] or string[]. The element type is inferred from the items in the array. Mixed-type arrays produce a union type.",
    },
    {
      question: "Is my JSON data sent to a server?",
      answer:
        "No. All conversion happens 100% in your browser using JavaScript. Your JSON data never leaves your device and is never uploaded to any server.",
    },
    {
      question: "Can I generate type aliases instead of interfaces?",
      answer:
        "Yes. Use the toggle in the tool to switch between 'interface' and 'type alias' output. Both are equivalent for object types in TypeScript.",
    },
    {
      question: "What happens with null values in JSON?",
      answer:
        "Null values are typed as 'null' by default. You can enable the 'Optional fields' toggle to mark any nullable field as optional (fieldName?: Type | null) instead.",
    },
  ],

  // Pages (for sitemap + per-page SEO)
  pages: {
    "/": {
      title: "JSON to TypeScript Converter — Instant Interface Generator",
      description:
        "Convert any JSON to TypeScript interfaces instantly. Paste JSON, get typed interfaces with nested types, arrays, and optional fields. 100% free, no login required.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
