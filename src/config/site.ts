export const siteConfig = {
  // ====== CUSTOMIZE THESE FOR EACH TOOL ======
  name: "CSS Text Gradient Generator",
  title: "CSS Text Gradient Generator — Free Online Tool",
  description:
    "Generate beautiful CSS text gradients instantly. Pick colors, adjust angle and gradient type, preview live, and copy production-ready CSS. No login required.",
  url: "https://css-text-gradient-generator.tools.jagodana.com",
  ogImage: "/opengraph-image",

  // Header
  headerIcon: "Palette",
  brandAccentColor: "#a855f7", // hex accent for OG image gradient (must match --brand-accent in globals.css)

  // SEO
  keywords: [
    "css text gradient generator",
    "gradient text css",
    "css text color gradient",
    "linear gradient text",
    "css gradient text generator online",
    "text gradient css code",
    "webkit background clip text",
    "css gradient typography",
    "free gradient text tool",
    "css text effect generator",
  ],
  applicationCategory: "DeveloperApplication",

  // Theme
  themeColor: "#3b82f6",

  // Branding
  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  // Social Profiles (for Organization schema sameAs)
  socialProfiles: ["https://twitter.com/jagodana"],

  // Links
  links: {
    github:
      "https://github.com/Jagodana-Studio-Private-Limited/css-text-gradient-generator",
    website: "https://jagodana.com",
  },

  // Footer
  footer: {
    about:
      "CSS Text Gradient Generator is a free browser-based tool to create beautiful gradient text effects with one-click CSS output. No signup, no install.",
    featuresTitle: "Features",
    features: [
      "Linear & radial gradient types",
      "Live preview as you adjust",
      "Custom color stops & angle control",
      "One-click CSS copy",
    ],
  },

  // Hero Section
  hero: {
    badge: "Free CSS Tool",
    titleLine1: "Create Beautiful",
    titleGradient: "Text Gradients",
    subtitle:
      "Pick your colors, choose a direction, and instantly generate production-ready CSS gradient text. Fully client-side — nothing leaves your browser.",
  },

  // Feature Cards (shown on homepage)
  featureCards: [
    {
      icon: "🎨",
      title: "Full Color Control",
      description:
        "Add up to 5 color stops with exact hex values or native color pickers. Position each stop freely along the gradient.",
    },
    {
      icon: "⚡",
      title: "Live Preview",
      description:
        "See your gradient text update in real time as you adjust colors, angle, type, font size, and font weight.",
    },
    {
      icon: "📋",
      title: "Copy-Ready CSS",
      description:
        "One click copies the complete CSS snippet — background gradient, -webkit-background-clip, and background-clip — ready to paste into any project.",
    },
  ],

  // Related Tools (cross-linking to sibling Jagodana tools for internal SEO)
  relatedTools: [
    {
      name: "CSS Gradient Generator",
      url: "https://css-gradient-generator.tools.jagodana.com",
      icon: "🌈",
      description: "Generate CSS gradients for backgrounds and borders.",
    },
    {
      name: "Color Format Converter",
      url: "https://color-format-converter.tools.jagodana.com",
      icon: "🔄",
      description: "Convert between HEX, RGB, HSL, and other color formats.",
    },
    {
      name: "CSS Box Shadow Generator",
      url: "https://css-box-shadow-generator.tools.jagodana.com",
      icon: "🟦",
      description: "Build multi-layer box shadows with live preview.",
    },
    {
      name: "Color Palette Explorer",
      url: "https://color-palette-explorer.tools.jagodana.com",
      icon: "🎭",
      description: "Extract color palettes from any image.",
    },
    {
      name: "CSS Filter Builder",
      url: "https://css-filter-builder.tools.jagodana.com",
      icon: "🔭",
      description: "Build CSS filter effects with real-time preview.",
    },
    {
      name: "Claymorphism Generator",
      url: "https://claymorphism-generator.tools.jagodana.com",
      icon: "🏺",
      description: "Create CSS clay-effect UI elements instantly.",
    },
  ],

  // HowTo Steps (drives HowTo JSON-LD schema for rich results)
  howToSteps: [
    {
      name: "Choose gradient type",
      text: "Select Linear or Radial gradient from the type selector at the top of the tool.",
      url: "",
    },
    {
      name: "Set your colors",
      text: "Click each color swatch to pick a stop color using the hex input or native color picker. Add or remove stops as needed.",
      url: "",
    },
    {
      name: "Adjust angle and text",
      text: "For linear gradients, drag the angle slider to rotate the gradient direction. Adjust font size and weight to match your design.",
      url: "",
    },
    {
      name: "Copy the CSS",
      text: "Click 'Copy CSS' to copy the complete snippet — background gradient, -webkit-background-clip, and background-clip — ready to paste.",
      url: "",
    },
  ],
  howToTotalTime: "PT1M",

  // FAQ (drives both the FAQ UI section and FAQPage JSON-LD schema)
  faq: [
    {
      question: "How do I create gradient text in CSS?",
      answer:
        "Apply a background gradient to an element, then use `-webkit-background-clip: text` and `-webkit-text-fill-color: transparent` (plus the unprefixed `background-clip: text`) to reveal the gradient through the text shape. This generator writes that code for you.",
    },
    {
      question: "Is CSS gradient text supported in all browsers?",
      answer:
        "Yes — the `-webkit-background-clip: text` technique works in all modern browsers including Chrome, Firefox, Safari, and Edge. The generator includes both prefixed and unprefixed properties for maximum compatibility.",
    },
    {
      question: "Can I use more than two colors in a text gradient?",
      answer:
        "Absolutely. The generator supports up to 5 color stops so you can create rich multi-color gradients like rainbow or sunset text effects.",
    },
    {
      question:
        "What is the difference between linear and radial gradient text?",
      answer:
        "A linear gradient flows in a straight line at a given angle (e.g., left-to-right or diagonal). A radial gradient radiates outward from the center of the element, creating a spotlight or circular color transition.",
    },
    {
      question: "Does this tool require a login or API key?",
      answer:
        "No. Everything runs in your browser — no account, no API key, no data sent to any server. Just open the tool and start generating.",
    },
    {
      question: "Can I use the generated CSS in any framework?",
      answer:
        "Yes. The output is plain CSS that works in any project — vanilla HTML/CSS, React, Vue, Angular, Tailwind CSS (via arbitrary values), and any other framework.",
    },
  ],

  // ====== PAGES (for sitemap + per-page SEO) ======
  pages: {
    "/": {
      title: "CSS Text Gradient Generator — Free Online Tool",
      description:
        "Generate beautiful CSS text gradients instantly. Pick colors, adjust angle and type, preview live, and copy production-ready CSS. No login required.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
