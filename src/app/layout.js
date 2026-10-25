import "./globals.css";
import { getContent, SITE_URL } from "@/lib/content";
import { fontAssets, themeCss } from "@/lib/theme";

export async function generateMetadata() {
  const c = await getContent();
  const { site } = c;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: site.title, template: `%s | ${site.name}` },
    description: site.description,
    keywords: site.keywords,
    authors: [{ name: site.name, url: SITE_URL }],
    creator: site.name,
    alternates: { canonical: "/" },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-video-preview": -1, "max-snippet": -1 } },
    openGraph: { type: "website", url: SITE_URL, siteName: site.name, title: site.title, description: site.description, locale: "en_US", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: site.title }] },
    twitter: { card: "summary_large_image", title: site.title, description: site.description, images: ["/og-image.jpg"] },
    // Local SEO / geo signals
    other: { "geo.region": "EG-GH", "geo.placename": site.location, "geo.position": "30.7865;31.0004", ICBM: "30.7865, 31.0004" },
    formatDetection: { telephone: false },
  };
}

export async function generateViewport() {
  const c = await getContent();
  return { width: "device-width", initialScale: 1, themeColor: c.theme.bg, colorScheme: "dark" };
}

export default async function RootLayout({ children }) {
  const c = await getContent();
  const fonts = fontAssets(c.theme);
  return (
    <html lang="en">
      <head>
        {fonts.preloads.map((p) => (
          <link key={p.href} rel="preload" href={p.href} as="font" type={p.type} crossOrigin="anonymous" />
        ))}
        {fonts.google && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="stylesheet" href={fonts.google} />
          </>
        )}
        <style dangerouslySetInnerHTML={{ __html: themeCss(c.theme) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
