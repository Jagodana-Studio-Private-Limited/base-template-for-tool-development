"use client";

import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-border/40 mt-20">
      <div className="container max-w-screen-xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-semibold mb-3">About</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {siteConfig.footer.about}
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-3">{siteConfig.footer.featuresTitle}</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              {siteConfig.footer.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <a
              href={siteConfig.creatorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-brand transition-colors"
            >
              {siteConfig.creator}
            </a>
            . All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href={siteConfig.links.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              More Tools
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
