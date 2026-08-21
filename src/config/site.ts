export const siteConfig = {
  name: "CSS Specificity Calculator",
  title: "CSS Specificity Calculator — Visualize Selector Specificity Instantly",
  description:
    "Calculate and compare CSS selector specificity scores in seconds. Understand why some CSS rules override others with a visual (a,b,c) breakdown. Free, instant, 100% browser-based.",
  url: "https://css-specificity-calculator.tools.jagodana.com",
  ogImage: "/opengraph-image",

  headerIcon: "Code2",
  brandAccentColor: "#4f46e5",

  keywords: [
    "css specificity calculator",
    "css selector specificity",
    "css specificity checker",
    "css specificity visualizer",
    "css rule priority",
    "css specificity score",
    "css selector priority calculator",
    "css cascade specificity",
    "css specificity (a,b,c)",
    "id class element specificity",
  ],
  applicationCategory: "DeveloperApplication",

  themeColor: "#7c3aed",

  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  socialProfiles: [
    "https://twitter.com/jagodana",
  ],

  links: {
    github: "https://github.com/Jagodana-Studio-Private-Limited/css-specificity-calculator",
    website: "https://jagodana.com",
  },

  footer: {
    about:
      "CSS Specificity Calculator helps frontend developers instantly understand why CSS rules override each other — with clear (a,b,c) specificity scores and visual breakdowns.",
    featuresTitle: "Features",
    features: [
      "Instant (a,b,c) specificity scores",
      "Visual ID / Class / Element breakdown",
      "Side-by-side selector comparison",
      "100% browser-based, no sign-up",
    ],
  },

  hero: {
    badge: "CSS Developer Tool",
    titleLine1: "Calculate CSS Selector",
    titleGradient: "Specificity Instantly",
    subtitle:
      "Stop guessing why your CSS isn't applying. Paste any selector and get the exact (a,b,c) specificity score — with a visual breakdown of every ID, class, and element.",
  },

  featureCards: [
    {
      icon: "🎯",
      title: "Instant (a,b,c) Score",
      description:
        "Get the exact specificity score for any CSS selector in real time — no page reload needed.",
    },
    {
      icon: "⚖️",
      title: "Side-by-Side Compare",
      description:
        "Compare two selectors head-to-head and see exactly which one wins the cascade battle.",
    },
    {
      icon: "🔍",
      title: "Visual Breakdown",
      description:
        "Every ID, class, attribute, pseudo-class, and element is highlighted and explained.",
    },
  ],

  relatedTools: [
    {
      name: "CSS Grid Generator",
      url: "https://css-grid-generator.tools.jagodana.com",
      icon: "⬜",
      description: "Build CSS Grid layouts visually with live code output.",
    },
    {
      name: "CSS Flexbox Playground",
      url: "https://css-flexbox-playground.tools.jagodana.com",
      icon: "📐",
      description: "Explore all flexbox properties with live preview.",
    },
    {
      name: "CSS Variables Generator",
      url: "https://css-variables-generator.tools.jagodana.com",
      icon: "🎨",
      description: "Generate CSS custom properties from design tokens.",
    },
    {
      name: "Glassmorphism Generator",
      url: "https://glassmorphism-generator.tools.jagodana.com",
      icon: "🔮",
      description: "Create frosted glass UI effects with live CSS output.",
    },
    {
      name: "CSS Gradient Generator",
      url: "https://css-gradient-generator.tools.jagodana.com",
      icon: "🌈",
      description: "Create beautiful linear, radial, and conic CSS gradients.",
    },
    {
      name: "Regex Playground",
      url: "https://regex-playground.tools.jagodana.com",
      icon: "🧪",
      description: "Build, test, and debug regular expressions in real time.",
    },
  ],

  howToSteps: [
    {
      name: "Enter a CSS Selector",
      text: "Type or paste any CSS selector into the input field — e.g., #nav .menu > li:hover.",
      url: "",
    },
    {
      name: "View the Specificity Score",
      text: "Instantly see the (a,b,c) specificity score and a colour-coded breakdown of every selector component.",
      url: "",
    },
    {
      name: "Compare Two Selectors",
      text: "Switch to Compare mode, enter a second selector, and see which one wins the CSS cascade.",
      url: "",
    },
  ],
  howToTotalTime: "PT1M",

  faq: [
    {
      question: "What is CSS specificity?",
      answer:
        "CSS specificity is the algorithm browsers use to decide which CSS rule applies when multiple rules target the same element. It is represented as a three-part score (a,b,c): 'a' counts ID selectors, 'b' counts class, attribute, and pseudo-class selectors, and 'c' counts type (element) and pseudo-element selectors. A higher score means the rule takes priority.",
    },
    {
      question: "How is the specificity score calculated?",
      answer:
        "Count each part of the selector: IDs (#id) add 1 to 'a'; classes (.class), attributes ([href]), and pseudo-classes (:hover, :nth-child) add 1 to 'b'; type selectors (div, p) and pseudo-elements (::before) add 1 to 'c'. The universal selector (*), combinators (>, +, ~), and :where() add nothing. Specificity is compared left-to-right: (1,0,0) beats (0,10,0).",
    },
    {
      question: "Does !important affect specificity?",
      answer:
        "!important is not part of the (a,b,c) specificity score — it overrides specificity entirely and forces a rule to apply regardless of selector weight. Avoid using it unless absolutely necessary, as it makes CSS hard to debug and maintain.",
    },
    {
      question: "What about :is(), :not(), and :has()?",
      answer:
        ":is(), :not(), and :has() take the specificity of their most specific argument. For example, :is(h1, .title) has specificity (0,1,0) because .title is the most specific argument. :where() is a special case — it always contributes zero specificity, making it useful for low-specificity base styles.",
    },
    {
      question: "Which selector wins when specificity is equal?",
      answer:
        "When two selectors have identical specificity scores, the one that appears later in the stylesheet wins. This is called the 'source order' rule — the last declaration takes effect. Inline styles (style attribute) override all stylesheet rules, and !important overrides everything.",
    },
  ],

  pages: {
    "/": {
      title:
        "CSS Specificity Calculator — Visualize Selector Specificity Instantly",
      description:
        "Calculate and compare CSS selector specificity scores in seconds. Understand why some CSS rules override others with a visual (a,b,c) breakdown. Free, 100% browser-based.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    // No sub-pages for this tool
  },
} as const;

export type SiteConfig = typeof siteConfig;
