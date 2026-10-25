import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Experience from "@/components/sections/Experience";
import Hero from "@/components/sections/Hero";
import Reviews from "@/components/sections/Reviews";
import Services from "@/components/sections/Services";
import Work from "@/components/sections/Work";
import Reveal from "@/components/ui/Reveal";
import { getContent } from "@/lib/content";
import { buildJsonLd, jsonLdString } from "@/lib/seo";

// Static page, refreshed instantly when the dashboard saves (revalidatePath) and at least hourly.
export const revalidate = 1800;

const SECTIONS = {
  about: About,
  services: Services,
  work: Work,
  experience: Experience,
  reviews: Reviews,
  contact: Contact,
};

// A section with nothing to show is skipped automatically.
const hasContent = (id, c) =>
  id === "work" ? c.work.items.some((i) => i.visible !== false) : id === "reviews" ? c.reviews.items.some((i) => i.image?.url) : true;

export default async function Home() {
  const c = await getContent();
  const visible = c.sections.order.filter((id) => SECTIONS[id] && !c.sections.hidden.includes(id) && hasContent(id, c));
  const shown = new Set(["home", ...visible]);
  const nav = c.nav.filter((n) => !n.href.startsWith("#") || shown.has(n.href.slice(1)));
  const contactShown = shown.has("contact");

  return (
    <>
      <Header name={c.site.name} nav={nav} cta={{ label: "Hire Me", href: contactShown ? "#contact" : "#home" }} />
      <main>
        <Hero c={c} />
        {visible.map((id, i) => {
          const Section = SECTIONS[id];
          return <Section key={id} c={c} n={i + 1} alt={i % 2 === 1} />;
        })}
      </main>
      <Footer studio={c.site.studio} tagline={c.footer.tagline} nav={nav} backToTop={c.footer.backToTop} />
      <Reveal />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(buildJsonLd(c)) }} />
    </>
  );
}
