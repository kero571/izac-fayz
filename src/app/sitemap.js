import { SITE_URL } from "@/lib/content";

export default function sitemap() {
  return [{ url: SITE_URL, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
