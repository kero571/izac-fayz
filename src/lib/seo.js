import { SITE_URL } from "@/lib/content";

const PLATFORM_HOST = /instagram|linkedin|behance|youtube|facebook|twitter|x\.com|tiktok/i;

/** JSON-LD graph: WebSite + Person + services. (No Review/rating markup: testimonials are screenshots.) */
export function buildJsonLd(c) {
  const sameAs = (c.contact.socials || []).map((s) => s.url).filter((u) => PLATFORM_HOST.test(u));
  const [city, country] = (c.site.location || "").split(",").map((s) => s.trim());
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: c.site.name, description: c.site.description, inLanguage: "en" },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: c.site.name,
        jobTitle: c.site.jobTitle,
        url: SITE_URL,
        description: c.site.description,
        image: `${SITE_URL}/og-image.jpg`,
        address: { "@type": "PostalAddress", addressLocality: city, addressCountry: country === "Egypt" ? "EG" : country },
        alumniOf: { "@type": "EducationalOrganization", name: "Bachelor of Commerce in Marketing" },
        knowsAbout: c.site.keywords,
        sameAs,
        worksFor: { "@type": "Organization", name: "BiSocial Agency" },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#service`,
        name: c.site.studio,
        url: SITE_URL,
        areaServed: ["EG", "MENA", "EU", "US"],
        provider: { "@id": `${SITE_URL}/#person` },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Motion design services",
          itemListElement: c.services.items.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, description: s.text } })),
        },
      },
    ],
  };
}

/** Safe to inline inside <script type="application/ld+json">. */
export const jsonLdString = (obj) => JSON.stringify(obj).replace(/</g, "\\u003c");
