export const siteConfig = {
  name: "Cron Job Calculator",
  title: "Cron Job Calculator — Build, Test & Understand Cron Expressions",
  description:
    "Free online cron expression builder. Visually create cron schedules, get human-readable descriptions, preview the next 10 run times, and validate cron syntax instantly in your browser.",
  url: "https://cron-job-calculator.tools.jagodana.com",
  ogImage: "/opengraph-image",

  headerIcon: "Timer",
  brandAccentColor: "#06b6d4",

  keywords: [
    "cron expression generator",
    "cron job calculator",
    "cron schedule builder",
    "cron expression tester",
    "cron syntax validator",
    "online cron tool",
    "cron parser",
    "cron expression explainer",
    "unix cron",
    "linux cron job",
    "cron schedule calculator",
    "next cron run time",
  ],
  applicationCategory: "DeveloperApplication",

  themeColor: "#10b981",

  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  socialProfiles: [
    "https://twitter.com/jagodana",
  ],

  links: {
    github: "https://github.com/Jagodana-Studio-Private-Limited/cron-job-calculator",
    website: "https://jagodana.com",
  },

  footer: {
    about:
      "Cron Job Calculator helps developers build, test, and understand cron expressions instantly in the browser. No signup, no install — just type your expression and see it explained.",
    featuresTitle: "Features",
    features: [
      "Visual cron expression builder",
      "Human-readable schedule descriptions",
      "Next 10 run times preview",
      "Common schedule presets",
    ],
  },

  hero: {
    badge: "Free Developer Tool",
    titleLine1: "Build & Test",
    titleGradient: "Cron Expressions",
    subtitle:
      "Create cron schedules visually, get instant human-readable descriptions, and preview the next 10 run times — all in your browser, no install needed.",
  },

  featureCards: [
    {
      icon: "🧠",
      title: "Instant Explanations",
      description:
        "Type any cron expression and get a plain-English description of exactly when it runs.",
    },
    {
      icon: "📅",
      title: "Next Run Preview",
      description:
        "See the next 10 scheduled execution times so you can verify your schedule is correct.",
    },
    {
      icon: "⚡",
      title: "Presets & Shortcuts",
      description:
        "Start from common presets like @daily, @weekly, or @monthly, then customise as needed.",
    },
  ],

  relatedTools: [
    {
      name: "Regex Playground",
      url: "https://regex-playground.tools.jagodana.com",
      icon: "🧪",
      description: "Build, test & debug regular expressions in real-time.",
    },
    {
      name: "Favicon Generator",
      url: "https://favicon-generator.tools.jagodana.com",
      icon: "🎨",
      description: "Generate all favicon sizes + manifest from any image.",
    },
    {
      name: "Sitemap Checker",
      url: "https://sitemap-checker.tools.jagodana.com",
      icon: "🔍",
      description: "Discover and validate sitemaps on any website.",
    },
    {
      name: "Screenshot Beautifier",
      url: "https://screenshot-beautifier.tools.jagodana.com",
      icon: "📸",
      description: "Transform screenshots into beautiful images.",
    },
    {
      name: "Color Palette Explorer",
      url: "https://color-palette-explorer.tools.jagodana.com",
      icon: "🎭",
      description: "Extract color palettes from any image.",
    },
  ],

  howToSteps: [
    {
      name: "Enter a cron expression",
      text: "Type your cron expression in the input field or choose a preset from the dropdown.",
      url: "",
    },
    {
      name: "Read the explanation",
      text: "The tool instantly shows a plain-English description of your schedule.",
      url: "",
    },
    {
      name: "Check the next run times",
      text: "Review the next 10 scheduled executions to confirm the schedule is correct.",
      url: "",
    },
  ],
  howToTotalTime: "PT1M",

  faq: [
    {
      question: "What is a cron expression?",
      answer:
        "A cron expression is a string of five fields separated by spaces that defines a schedule: minute, hour, day-of-month, month, and day-of-week. For example, '0 9 * * 1' means every Monday at 9:00 AM.",
    },
    {
      question: "Does this tool work with AWS Lambda, GitHub Actions, or Kubernetes cron?",
      answer:
        "Yes. Standard 5-field cron expressions (minute hour dom month dow) are used by cron, Kubernetes CronJobs, GitHub Actions, and AWS EventBridge. Some platforms like Quartz use a 6-field format with a seconds field; this tool supports both 5-field and 6-field expressions.",
    },
    {
      question: "What is the difference between @daily, @weekly, and @monthly?",
      answer:
        "@daily (or @midnight) runs at 00:00 every day. @weekly runs at 00:00 every Sunday. @monthly runs at 00:00 on the 1st of every month. @yearly (or @annually) runs at 00:00 on 1 January.",
    },
    {
      question: "Can I use this tool offline?",
      answer:
        "All cron parsing logic runs entirely in your browser. Once the page loads, you can use it without an internet connection.",
    },
    {
      question: "What does the asterisk (*) mean in a cron expression?",
      answer:
        "An asterisk means 'every possible value' for that field. For example, * in the minute field means every minute; * in the day-of-week field means every day of the week.",
    },
  ],

  pages: {
    "/": {
      title:
        "Cron Job Calculator — Build, Test & Understand Cron Expressions",
      description:
        "Free online cron expression builder. Visually create cron schedules, get human-readable descriptions, and preview the next 10 run times instantly in your browser.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
