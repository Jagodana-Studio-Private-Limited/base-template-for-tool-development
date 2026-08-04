# Jagodana Tool Template

This is the base template for all Jagodana free tool websites. When creating a new tool from this template, follow these instructions exactly.

## Tech Stack (DO NOT CHANGE)

- **Framework**: Next.js 16.x with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 with OKLCH color tokens
- **UI Components**: shadcn/ui (new-york style) + Radix UI primitives
- **Icons**: lucide-react
- **Animations**: framer-motion
- **Fonts**: Geist Sans + Geist Mono (Google Fonts)
- **Theme**: next-themes (light/dark/system)
- **Toasts**: sonner
- **Env Validation**: @t3-oss/env-nextjs + zod
- **Analytics**: Google Analytics (via NEXT_PUBLIC_GA_ID env var)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (global metadata + title template, fonts, providers)
│   ├── page.tsx            # Home page (SERVER component → exports metadata, renders HomePage)
│   ├── globals.css         # Tailwind v4 theme tokens (OKLCH)
│   ├── robots.ts           # SEO robots.txt (disallows /api/, /_next/, /private/)
│   ├── sitemap.ts          # SEO sitemap.xml (auto-generated from siteConfig.pages)
│   ├── api/                # API routes (if needed)
│   └── (examples)/         # Example sub-page with per-page metadata (DELETE when starting)
│       └── about/page.tsx
├── components/
│   ├── home-page.tsx        # Home page CLIENT component (hero + tool + features)
│   ├── header.tsx           # Sticky header with gradient logo + theme toggle
│   ├── footer.tsx           # Footer with about + features + copyright
│   ├── theme-provider.tsx   # next-themes wrapper
│   ├── theme-toggle.tsx     # Animated sun/moon toggle
│   ├── google-analytics.tsx # GA4 script loader
│   ├── animated-gradient-text.tsx # Animated gradient text effect
│   ├── faq-section.tsx      # Accordion FAQ UI (reads from siteConfig.faq)
│   ├── related-tools.tsx    # Cross-tool internal linking grid
│   ├── breadcrumb.tsx       # Breadcrumb navigation with ARIA
│   ├── social-share.tsx     # Twitter/LinkedIn/Copy share buttons
│   ├── github-star.tsx      # Star on GitHub CTA button
│   ├── seo/
│   │   ├── structured-data.tsx    # JSON-LD WebApplication schema
│   │   ├── faq-schema.tsx         # JSON-LD FAQPage schema
│   │   ├── howto-schema.tsx       # JSON-LD HowTo schema
│   │   ├── organization-schema.tsx # JSON-LD Organization schema
│   │   └── breadcrumb-schema.tsx  # JSON-LD BreadcrumbList schema
│   └── ui/                  # shadcn/ui components (DO NOT MODIFY)
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── badge.tsx
│       ├── skeleton.tsx
│       ├── sonner.tsx
│       └── tabs.tsx
├── config/
│   └── site.ts             # ALL tool-specific config + pages registry
├── lib/
│   ├── utils.ts            # cn() helper
│   ├── seo.ts              # generatePageMetadata() helper for per-page SEO
│   └── analytics.ts        # GA4 trackEvent() + ToolEvents namespace
├── hooks/                   # Custom React hooks
├── types/                   # TypeScript type definitions
└── env.mjs                 # Environment variable validation
```

## How to Create a New Tool

### Step 1: Clone and Rename

```bash
git clone <template-repo-url> <new-tool-name>
cd <new-tool-name>
rm -rf .git
git init
```

### Step 2: Update `src/config/site.ts`

This is the SINGLE SOURCE OF TRUTH for all tool-specific content. Update every `{{PLACEHOLDER}}` value:

- `name` - Display name (e.g., "Favicon Generator")
- `title` - SEO title (e.g., "Favicon Generator - Create All Favicon Sizes + Manifest")
- `description` - SEO description
- `url` - Production URL (e.g., "https://favicon-generator.jagodana.com")
- `headerIcon` - lucide-react icon name for the header
- `brandAccentColor` - Hex accent color for OG image gradient (must match `--brand-accent` in globals.css)
- `keywords` - SEO keywords array
- `applicationCategory` - Schema.org category
- `themeColor` - Hex brand primary color for manifest/meta (must match `--brand` in globals.css)
- `hero.*` - All hero section content
- `featureCards` - 3 feature cards with emoji icons
- `footer.*` - Footer content
- `socialProfiles` - Array of social profile URLs (for Organization schema sameAs)
- `relatedTools` - Cross-links to other Jagodana tools (remove/add as needed)
- `howToSteps` - Step-by-step instructions (drives HowTo JSON-LD schema)
- `howToTotalTime` - ISO 8601 duration (e.g., "PT2M" = 2 minutes)
- `faq` - FAQ entries (drives both FAQ UI section and FAQPage JSON-LD schema)

### Step 3: Update `package.json`

Change the `"name"` field to your tool's slug.

### Step 4: Update `public/site.webmanifest`

Replace all `{{PLACEHOLDER}}` values with your tool's info.

### Step 5: Add Tool-Specific Dependencies

Install any additional packages needed for your tool's functionality.

### Step 6: Build the Tool UI

Replace the placeholder in `src/components/home-page.tsx` (the `TODO` section) with your tool's main component. The `page.tsx` is a server component that exports metadata and renders `<HomePage />`.

### Step 6b: Add Sub-Pages (if needed)

For each new page:
1. Add the route to `siteConfig.pages` in `src/config/site.ts`
2. Create `src/app/<route>/page.tsx` as a **server component**
3. Export metadata: `export const metadata = generatePageMetadata("/<route>");`
4. The sitemap auto-includes it (reads from `siteConfig.pages`)
5. Delete the `src/app/(examples)/` folder (it's just a reference)

### Step 7: Set Brand Colors in `globals.css`

Open `src/app/globals.css` and update the brand color CSS variables:

```css
:root {
  --brand: #10b981;        /* Your brand primary color */
  --brand-accent: #06b6d4; /* Your brand accent color */
}
.dark {
  --brand: #34d399;        /* Lighter variant for dark mode */
  --brand-accent: #22d3ee; /* Lighter variant for dark mode */
}
```

Common color pairs:
- `#10b981` / `#06b6d4` (emerald/cyan)
- `#3b82f6` / `#6366f1` (blue/indigo)
- `#a855f7` / `#ec4899` (purple/pink)
- `#f97316` / `#f59e0b` (orange/amber)
- `#f43f5e` / `#ef4444` (rose/red)

**Also update** `siteConfig.themeColor` and `siteConfig.brandAccentColor` to match the hex values.

Components use Tailwind classes `text-brand`, `from-brand`, `to-brand-accent`, etc. — these are registered via `@theme inline` and always work (no purging issues).

### Step 8: Add favicon.svg

Create or place a custom `public/favicon.svg` for the tool. Then regenerate PWA icons:
```bash
node -e "const s=require('sharp'),f=require('fs');const svg=f.readFileSync('public/favicon.svg');Promise.all([s(svg).resize(192,192).png().toFile('public/icon-192.png'),s(svg).resize(512,512).png().toFile('public/icon-512.png')])"
```

### Step 9: Update Environment

Copy `.env.example` to `.env.local` and set values.

## Page Layout Pattern (MUST FOLLOW)

Every tool page follows this exact structure:

1. **Header** - Sticky, blurred backdrop, gradient logo, theme toggle
2. **Hero Section**
   - Animated badge (Sparkles icon + text)
   - Large heading with AnimatedGradientText
   - Subtitle paragraph
   - "Try Now" CTA button (smooth-scrolls to tool section)
3. **Feature Cards** - 3-column grid highlighting key features
4. **Tool Interface** - The main interactive area (`id="tool"`, scroll target)
5. **FAQ Section** - Accordion FAQ from siteConfig
6. **Related Tools** - Cross-tool internal linking for SEO
7. **Footer** - About + features list + copyright + "More Tools" link

## Animation Pattern

All sections use framer-motion staggered animations:
- `initial={{ opacity: 0, y: 20 }}`
- `animate={{ opacity: 1, y: 0 }}`
- `transition={{ delay: 0.1 * index }}`

## Color Scheme (Brand Colors)

Each tool has a unique brand gradient defined as CSS custom properties in `globals.css`:
- `--brand` / `--brand-accent` in `:root` (light mode)
- `--brand` / `--brand-accent` in `.dark` (dark mode, usually lighter variants)

These are registered in `@theme inline` as `--color-brand` / `--color-brand-accent`, enabling Tailwind utility classes:
- `text-brand`, `bg-brand`, `border-brand`, `from-brand`, `shadow-brand/25`
- `text-brand-accent`, `bg-brand-accent`, `to-brand-accent`, `via-brand-accent`

**NEVER** use dynamic Tailwind class construction like `` `text-${variable}` `` — Tailwind v4 JIT cannot detect these and will purge the CSS. Always use the static `brand` / `brand-accent` classes.

## Per-Page SEO Pattern (CRITICAL)

Every page MUST be a **server component** to export metadata. Use this pattern:

```tsx
// src/app/some-page/page.tsx (SERVER component - NO "use client")
import { generatePageMetadata } from "@/lib/seo";
import { SomePageClient } from "@/components/some-page-client";

export const metadata = generatePageMetadata("/some-page");

export default function SomePage() {
  return <SomePageClient />;
}
```

```tsx
// src/components/some-page-client.tsx (CLIENT component)
"use client";
export function SomePageClient() {
  // Interactive UI here
}
```

**Why this split?** Next.js only allows metadata exports from server components. Client interactivity goes in a separate `"use client"` component.

### Title Template

`layout.tsx` uses a title template: `%s | {{TOOL_NAME}}`. Per-page metadata titles like "About" become "About | Tool Name" automatically. The homepage uses `default` to show the full title without the template.

### generatePageMetadata() Helper

Located at `src/lib/seo.ts`. It:
- Reads page config from `siteConfig.pages`
- Generates full Metadata object (title, description, OG, Twitter, canonical URL)
- Supports overrides for custom title/description per page
- Supports `noIndex: true` for private pages

### siteConfig.pages Registry

Every route must be registered in `siteConfig.pages`:

```ts
pages: {
  "/": { title: "...", description: "...", changeFrequency: "weekly", priority: 1 },
  "/about": { title: "...", description: "...", changeFrequency: "monthly", priority: 0.7 },
}
```

This feeds both:
- `sitemap.ts` - auto-generates sitemap.xml from all registered pages
- `generatePageMetadata()` - reads title/description from here

## SEO Checklist

Every tool MUST have:
- [x] `layout.tsx` global metadata (title template, description, keywords, OG, Twitter)
- [x] Per-page metadata via `generatePageMetadata()` on every page.tsx
- [x] `robots.ts` with sitemap reference + disallow rules (/api/, /_next/, /private/)
- [x] `robots.ts` environment-aware (blocks crawling in non-production)
- [x] `sitemap.ts` auto-generated from `siteConfig.pages`
- [x] Dynamic OG image via `opengraph-image.tsx` + `twitter-image.tsx` (@vercel/og)
- [x] JSON-LD WebApplication schema (`seo/structured-data.tsx`)
- [x] JSON-LD FAQPage schema (`seo/faq-schema.tsx`) + FAQ UI section
- [x] JSON-LD HowTo schema (`seo/howto-schema.tsx`)
- [x] JSON-LD Organization schema (`seo/organization-schema.tsx`)
- [x] JSON-LD BreadcrumbList schema (`seo/breadcrumb-schema.tsx`)
- [x] Cross-tool internal linking (`related-tools.tsx`)
- [x] DNS prefetch + preconnect resource hints in layout.tsx
- [x] Enhanced PWA manifest with multiple icon sizes + maskable
- [x] `site.webmanifest` in public/
- [x] `favicon.svg` in public/
- [x] Canonical URL per page via `alternates.canonical`
- [x] `viewport` export with themeColor
- [x] Every new page registered in `siteConfig.pages`
- [x] GA4 event tracking via `analytics.ts`

### When to customize per tool:
- Update `siteConfig.faq` with tool-specific Q&A
- Update `siteConfig.howToSteps` with tool-specific steps
- Update `siteConfig.relatedTools` to exclude self and add relevant tools
- Add `<SocialShare />` and `<GitHubStar />` where appropriate in the UI
- Add `<Breadcrumb />` + `<BreadcrumbSchema />` on sub-pages

## Security Headers (next.config.ts)

Already configured:
- HSTS
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

## Common Patterns

### Client-Side Processing
Most tools process data client-side for privacy. Emphasize "100% client-side" and "No uploads to server" in copy.

### Toast Notifications
```tsx
import { toast } from "sonner";
toast.success("Done!");
toast.error("Something went wrong");
```

### Adding shadcn/ui Components
```bash
npx shadcn@latest add [component-name]
```

### Analytics Event Tracking
```tsx
import { ToolEvents } from "@/lib/analytics";
ToolEvents.toolUsed("export");       // User performed a tool action
ToolEvents.fileUploaded("svg", 1024); // File uploaded
ToolEvents.resultExported("png");     // Result exported
ToolEvents.resultCopied();            // Result copied to clipboard
ToolEvents.shareClicked("twitter");   // Social share button clicked
```

### Social Sharing
```tsx
import { SocialShare } from "@/components/social-share";
<SocialShare /> // Uses siteConfig defaults for title/text/url
```

### GitHub Star CTA
```tsx
import { GitHubStar } from "@/components/github-star";
<GitHubStar /> // Links to siteConfig.links.github
```

### Breadcrumbs (for sub-pages)
```tsx
import { Breadcrumb } from "@/components/breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
<BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "About" }]} />
<Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About" }]} />
```

### API Routes (if needed)
Place in `src/app/api/[route]/route.ts`. Add env vars to `src/env.mjs`.

## DO NOT

- Change the base UI components in `src/components/ui/`
- Remove security headers from `next.config.ts`
- Hardcode secrets or API keys
- Change the font from Geist
- Remove Google Analytics integration
- Skip structured data / JSON-LD
- Use Tailwind v3 patterns (use v4 @theme inline)
- Use dynamic Tailwind class construction (`` `text-${variable}` ``) — use `text-brand` / `text-brand-accent` instead
