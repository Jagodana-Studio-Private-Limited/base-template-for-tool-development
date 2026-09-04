export const siteConfig = {
  // ====== CUSTOMIZE THESE FOR EACH TOOL ======
  name: "YAML Formatter",
  title: "YAML Formatter & Validator — Free Online Tool",
  description:
    "Format, validate, and minify YAML instantly in your browser. Paste your YAML and get perfectly indented, validated output with detailed error reporting. 100% client-side, no uploads.",
  url: "https://yaml-formatter.tools.jagodana.com",
  ogImage: "/opengraph-image",

  // Header
  headerIcon: "FileCode2", // lucide-react icon name
  brandAccentColor: "#10b981", // hex accent for OG image gradient (must match --brand-accent in globals.css)

  // SEO
  keywords: [
    "yaml formatter",
    "yaml validator",
    "yaml beautifier",
    "yaml minifier",
    "yaml linter",
    "format yaml online",
    "validate yaml online",
    "yaml parser",
    "yaml checker",
    "online yaml tool",
    "yaml pretty print",
    "yaml syntax checker",
    "kubernetes yaml formatter",
    "docker compose yaml formatter",
  ],
  applicationCategory: "DeveloperApplication",

  // Theme
  themeColor: "#0d9488",

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
    github: "https://github.com/Jagodana-Studio-Private-Limited/yaml-formatter",
    website: "https://jagodana.com",
  },

  // Footer
  footer: {
    about:
      "YAML Formatter is a free browser-based tool that formats, validates, and minifies YAML files instantly — no uploads, no accounts, 100% private.",
    featuresTitle: "Features",
    features: [
      "Format & prettify YAML",
      "Validate YAML syntax",
      "Minify YAML output",
      "Detailed error reporting",
    ],
  },

  // Hero Section
  hero: {
    badge: "Free YAML Tool",
    titleLine1: "Format & Validate",
    titleGradient: "YAML Instantly",
    subtitle:
      "Paste any YAML — Kubernetes configs, Docker Compose, CI/CD pipelines — and get perfectly formatted, validated output in one click. 100% client-side, nothing leaves your browser.",
  },

  // Feature Cards (shown on homepage)
  featureCards: [
    {
      icon: "✨",
      title: "Format & Prettify",
      description:
        "Instantly reformat messy YAML with consistent 2-space indentation and proper structure.",
    },
    {
      icon: "✅",
      title: "Validate Syntax",
      description:
        "Catch YAML errors before they break your CI/CD pipeline — with precise line and column numbers.",
    },
    {
      icon: "🔒",
      title: "100% Private",
      description:
        "Everything runs in your browser. Your YAML configs never leave your machine.",
    },
  ],

  // Related Tools (cross-linking to sibling Jagodana tools for internal SEO)
  relatedTools: [
    {
      name: "JSON Formatter",
      url: "https://json-formatter.tools.jagodana.com",
      icon: "📋",
      description: "Format, validate, and minify JSON with syntax highlighting.",
    },
    {
      name: "XML Formatter",
      url: "https://xml-formatter.tools.jagodana.com",
      icon: "📄",
      description: "Format and validate XML documents instantly.",
    },
    {
      name: "CORS Headers Generator",
      url: "https://cors-headers-generator.tools.jagodana.com",
      icon: "🌐",
      description: "Generate CORS configurations for Express, Nginx, Apache & more.",
    },
    {
      name: "JWT Debugger",
      url: "https://jwt-debugger.tools.jagodana.com",
      icon: "🔑",
      description: "Decode and inspect JSON Web Tokens instantly.",
    },
    {
      name: "Regex Pattern Tester",
      url: "https://regex-pattern-tester.tools.jagodana.com",
      icon: "🧪",
      description: "Build, test and debug regular expressions in real-time.",
    },
    {
      name: "CSV to JSON",
      url: "https://csv-to-json.tools.jagodana.com",
      icon: "🔄",
      description: "Convert CSV data to JSON format instantly.",
    },
  ],

  // HowTo Steps (drives HowTo JSON-LD schema for rich results)
  howToSteps: [
    {
      name: "Paste your YAML",
      text: "Paste or type your YAML content into the input editor on the left.",
      url: "",
    },
    {
      name: "Click Format or Validate",
      text: 'Click "Format YAML" to prettify and validate, or "Minify" to compress the output.',
      url: "",
    },
    {
      name: "Copy the result",
      text: 'Click "Copy" to copy the formatted output to your clipboard.',
      url: "",
    },
  ],
  howToTotalTime: "PT1M",

  // FAQ (drives both the FAQ UI section and FAQPage JSON-LD schema)
  faq: [
    {
      question: "Is this YAML formatter free to use?",
      answer:
        "Yes, completely free — no account, no signup, no rate limits. All processing happens in your browser using the js-yaml library.",
    },
    {
      question: "Does my YAML get uploaded to a server?",
      answer:
        "No. Everything runs 100% client-side in your browser. Your YAML configuration files never leave your device, making it safe to use with sensitive Kubernetes secrets, Docker Compose files, or CI/CD configs.",
    },
    {
      question: "What YAML versions does this support?",
      answer:
        "This tool supports YAML 1.2 (the latest standard), which is the version used by Kubernetes, Helm, GitHub Actions, CircleCI, Docker Compose, and most modern DevOps tooling.",
    },
    {
      question: "Why does my YAML validation fail?",
      answer:
        "Common causes include: tabs instead of spaces (YAML requires spaces), inconsistent indentation, unquoted special characters like colons or brackets, or unclosed brackets/braces. The error message shows the exact line and column to help you fix it.",
    },
    {
      question: "Can I use this to format Kubernetes manifests?",
      answer:
        "Yes! This formatter works perfectly with Kubernetes YAML manifests, Helm chart values files, Docker Compose files, GitHub Actions workflows, and any other YAML-based configuration format.",
    },
    {
      question: "What is YAML minification used for?",
      answer:
        "YAML minification removes comments and unnecessary whitespace to reduce file size. It's useful when embedding YAML as a string in other files or when minimizing config payload size in API calls.",
    },
  ],

  // ====== PAGES (for sitemap + per-page SEO) ======
  pages: {
    "/": {
      title: "YAML Formatter & Validator — Free Online Tool",
      description:
        "Format, validate, and minify YAML instantly in your browser. Paste your YAML and get perfectly indented, validated output with detailed error reporting. 100% client-side, no uploads.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
