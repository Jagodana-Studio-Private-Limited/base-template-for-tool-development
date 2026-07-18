# Jagodana Tool Template

Base template for creating free tool websites at Jagodana. Clone this repo to start a new tool project instantly.

## Quick Start

```bash
# 1. Clone the template
git clone <this-repo-url> my-new-tool
cd my-new-tool
rm -rf .git && git init

# 2. Install dependencies
npm install

# 3. Update src/config/site.ts with your tool's info

# 4. Update package.json name field

# 5. Update public/site.webmanifest

# 6. Start developing
npm run dev
```

## What's Included

- Next.js 16 + TypeScript + Tailwind CSS v4
- Dark/light theme with animated toggle
- shadcn/ui components (Button, Card, Input, Badge, Skeleton, Tabs, Toaster)
- Animated header with gradient logo
- Footer with about section and feature list
- Google Analytics integration
- Full SEO setup (metadata, robots.txt, sitemap.xml, JSON-LD, Open Graph)
- Security headers (HSTS, X-Frame-Options, CSP, etc.)
- Environment validation with @t3-oss/env-nextjs + zod
- Framer Motion animations
- Responsive design

## Customization

All tool-specific content is centralized in `src/config/site.ts`. Update this single file to customize:

- App name, title, description
- Header icon and gradient colors
- SEO keywords
- Hero section content
- Feature cards
- Footer content

See `CLAUDE.md` for detailed instructions.

## Scripts

```bash
npm run dev    # Start development server
npm run build  # Production build
npm run start  # Start production server
npm run lint   # Run ESLint
```

## Existing Tools Built With This Template

- [Favicon Generator](https://favicon-generator.jagodana.com)
- [Logo Maker](https://logo-maker.jagodana.com)
- [Regex Playground](https://regex-playground.jagodana.com)
- [Sitemap Checker](https://sitemap-checker.jagodana.com)
- [Sitemap URL Extractor](https://sitemap-url-extractor.jagodana.com)
- [Screenshot Beautifier](https://screenshot-beautifier.jagodana.com)
- [Color Palette Explorer](https://color-palette-explorer.jagodana.com)
