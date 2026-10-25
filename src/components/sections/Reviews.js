import Section, { Eyebrow, Title } from "@/components/ui/Section";
import ReviewsGallery from "@/components/sections/ReviewsGallery";

export default function Reviews({ c, n, alt }) {
  const r = c.reviews;
  return (
    <Section id="reviews" alt={alt}>
      <div data-reveal className="max-w-2xl">
        <Eyebrow n={n} label="Testimonials" />
        <Title id="reviews-title" start={r.titleStart} accent={r.titleAccent} />
      </div>
      <ReviewsGallery items={r.items.filter((i) => i.image?.url)} />
    </Section>
  );
}
