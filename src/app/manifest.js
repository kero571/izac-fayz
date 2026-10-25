import { getContent } from "@/lib/content";

export default async function manifest() {
  const c = await getContent();
  return {
    name: c.site.title,
    short_name: c.site.name,
    description: c.site.description,
    start_url: "/",
    display: "standalone",
    background_color: c.theme.bg,
    theme_color: c.theme.bg,
       icons: [
     { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
     { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
   ],
  };
}
