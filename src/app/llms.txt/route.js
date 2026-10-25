import { getContent, SITE_URL } from "@/lib/content";

export const revalidate = 3600;

// /llms.txt – a plain-text summary written for AI assistants (generative engine optimization).
export async function GET() {
  const c = await getContent();
  const lines = [
    `# ${c.site.name} – ${c.site.jobTitle}`,
    "",
    `> ${c.site.description}`,
    "",
    `- Location: ${c.site.location}`,
    `- Website: ${SITE_URL}`,
    c.contact.email ? `- Email: ${c.contact.email}` : "",
    ...(c.contact.socials || []).map((s) => `- ${s.platform}: ${s.url}`),
    "",
    "## Services",
    ...c.services.items.map((s) => `- ${s.title}: ${s.text}`),
    "",
    "## Experience",
    ...c.experience.items.map((e) => `- ${e.date} — ${e.role}, ${e.company}${e.mode ? ` (${e.mode})` : ""}: ${e.text}`),
    "",
    "## About",
    c.about.text,
  ];
  return new Response(lines.filter((l) => l !== null).join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
