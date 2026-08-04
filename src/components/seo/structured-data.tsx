import { siteConfig } from "@/config/site";

export function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    applicationCategory: siteConfig.applicationCategory,
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: siteConfig.creator,
      url: siteConfig.creatorUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
