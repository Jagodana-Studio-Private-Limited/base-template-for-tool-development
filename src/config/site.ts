export const siteConfig = {
  name: "CSS Box Shadow Generator",
  title: "CSS Box Shadow Generator - Create & Copy Perfect Shadows Instantly",
  description:
    "Free online CSS box shadow generator. Add multiple shadow layers, live preview, copy CSS code. Create neon glows, material shadows, neumorphism effects instantly in your browser.",
  url: "https://css-box-shadow-generator.tools.jagodana.com",
  ogImage: "/opengraph-image",

  headerIcon: "Layers",
  brandAccentColor: "#6366f1",

  keywords: [
    "css box shadow generator",
    "box shadow css",
    "box shadow tool",
    "css shadow generator",
    "css shadow maker",
    "online box shadow",
    "box shadow code generator",
    "css box shadow online",
    "box shadow creator",
    "web developer tools",
  ],
  applicationCategory: "DeveloperApplication",

  themeColor: "#3b82f6",

  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  socialProfiles: ["https://twitter.com/jagodana"],

  links: {
    github:
      "https://github.com/Jagodana-Studio-Private-Limited/css-box-shadow-generator",
    website: "https://jagodana.com",
  },

  footer: {
    about:
      "CSS Box Shadow Generator creates beautiful box shadows with live preview and one-click CSS copy. No sign-up, 100% free, runs entirely in your browser.",
    featuresTitle: "Features",
    features: [
      "Multiple shadow layers",
      "Live preview",
      "Preset shadows",
      "Copy CSS instantly",
    ],
  },

  hero: {
    badge: "Free CSS Tool",
    titleLine1: "CSS Box Shadow",
    titleGradient: "Generator",
    subtitle:
      "Create beautiful box shadows with multiple layers. Adjust offsets, blur, spread, color, and opacity. Live preview and one-click CSS copy — 100% client-side, no sign-up needed.",
  },

  featureCards: [
    {
      icon: "🎨",
      title: "Multi-Layer Shadows",
      description:
        "Stack unlimited shadow layers to create complex, professional effects like neon glows and neumorphism.",
    },
    {
      icon: "⚡",
      title: "Live Preview",
      description:
        "See your shadow update instantly as you tweak sliders. No page reloads, no lag — pure browser speed.",
    },
    {
      icon: "📋",
      title: "One-Click Copy",
      description:
        "Copy the complete CSS box-shadow property to your clipboard and paste it straight into your stylesheet.",
    },
  ],

  relatedTools: [
    {
      name: "CSS Gradient Generator",
      url: "https://css-gradient-generator.tools.jagodana.com",
      icon: "🌈",
      description:
        "Create beautiful linear, radial & conic CSS gradients with live preview.",
    },
    {
      name: "Glassmorphism Generator",
      url: "https://glassmorphism-generator.tools.jagodana.com",
      icon: "🪟",
      description: "Create stunning frosted glass CSS effects for your UI.",
    },
    {
      name: "CSS Grid Generator",
      url: "https://css-grid-generator.tools.jagodana.com",
      icon: "⊞",
      description:
        "Visual CSS Grid builder with live preview and code output.",
    },
    {
      name: "Color Palette Explorer",
      url: "https://color-palette-explorer.tools.jagodana.com",
      icon: "🎭",
      description: "Extract color palettes from any image.",
    },
    {
      name: "CSS Clip Path Generator",
      url: "https://css-clip-path-generator.tools.jagodana.com",
      icon: "✂️",
      description: "Visually create CSS clip-path shapes.",
    },
    {
      name: "Gradient Generator",
      url: "https://gradient-generator.tools.jagodana.com",
      icon: "🎨",
      description: "Generate beautiful CSS gradients instantly.",
    },
  ],

  howToSteps: [
    {
      name: "Add Shadow Layers",
      text: "Click 'Add Layer' to create one or more shadow layers. Each layer can have its own offset, blur, spread, color, and opacity.",
      url: "",
    },
    {
      name: "Adjust Shadow Properties",
      text: "Use the sliders and color picker to fine-tune each shadow — horizontal offset, vertical offset, blur radius, spread radius, and color.",
      url: "",
    },
    {
      name: "Preview and Copy CSS",
      text: "See the live preview update instantly, then click 'Copy CSS' to copy the complete box-shadow CSS property to your clipboard.",
      url: "",
    },
  ],
  howToTotalTime: "PT1M",

  faq: [
    {
      question: "What is a CSS box shadow?",
      answer:
        "A CSS box shadow is a visual effect that adds one or more shadows to an element using the box-shadow property. You can control the horizontal offset (X), vertical offset (Y), blur radius, spread radius, color, and whether the shadow is inset (inside) or outset (outside the element).",
    },
    {
      question: "Can I add multiple box shadows in CSS?",
      answer:
        "Yes! CSS allows you to stack multiple shadows by separating them with commas. For example: `box-shadow: 2px 2px 10px rgba(0,0,0,0.3), -2px -2px 10px rgba(255,255,255,0.5);`. Our generator lets you add as many layers as you need and combines them automatically.",
    },
    {
      question: "What does the spread radius do?",
      answer:
        "The spread radius expands or contracts the shadow. A positive value makes the shadow larger than the element, while a negative value makes it smaller. Setting spread to 0 gives you a clean shadow that exactly matches the element's size.",
    },
    {
      question: "What is an inset box shadow?",
      answer:
        "An inset shadow appears inside the element rather than outside. It's useful for creating pressed-button effects, inner glows, and neumorphism designs. Toggle the 'Inset' checkbox on any shadow layer to switch between inset and outset.",
    },
    {
      question: "Is this CSS box shadow generator free to use?",
      answer:
        "Yes, completely free — no sign-up, no login, and no limits. The tool runs entirely in your browser (100% client-side), so nothing is uploaded to any server. Just generate your shadow and copy the CSS.",
    },
  ],

  pages: {
    "/": {
      title:
        "CSS Box Shadow Generator - Create & Copy Perfect Shadows Instantly",
      description:
        "Free online CSS box shadow generator. Add multiple shadow layers, live preview, copy CSS code. Create neon glows, material shadows, neumorphism effects instantly in your browser.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
