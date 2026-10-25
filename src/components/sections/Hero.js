import ReactDOM from "react-dom";
import Picture from "@/components/ui/Picture";
import BrandsStrip from "@/components/sections/BrandsStrip";
import { safeHref, imageUrl, imageSrcSet, isCld, HERO_SIZES } from "@/lib/media";

const PAD = "relative z-10 mx-auto w-full max-w-6xl px-5 md:px-8";

/**
 * Hero + Brands = ارتفاع الشاشة - ارتفاع الـ nav بالظبط.
 * موبايل: الصورة خلفية لكل المنطقة والنص فوقها. ديسكتوب: النص شمال والصورة يمين.
 * لازم يفضل Server Component (من غير "use client") عشان الـ preload يشتغل.
 */
export default function Hero({ c }) {
  const h = c.hero;

  // Preload للصورة (Cloudinary فقط) - الصور المحلية next/image بيعمل لها preload تلقائي مع priority
  if (isCld(h.image)) {
    ReactDOM.preconnect("https://res.cloudinary.com", { crossOrigin: "anonymous" });
    ReactDOM.preload(imageUrl(h.image, 750), {
      as: "image",
      imageSrcSet: imageSrcSet(h.image),
      imageSizes: HERO_SIZES,
      fetchPriority: "high",
    });
  }

  return (
    <section id="home" aria-label="Introduction"
      className="relative flex h-[calc(100svh-var(--nav-h))] flex-col overflow-hidden bg-base">

      <div className="relative flex min-h-0 flex-1 flex-col">
        {/* الصورة: موبايل = خلفية كاملة من أول الـ section | ديسكتوب = يمين */}
        <div className="absolute inset-x-0 bottom-0 top-0 lg:inset-y-0 lg:left-[46%] lg:right-0 lg:[mask-image:linear-gradient(to_right,transparent,#000_22%)]">
          <Picture
            media={h.image}
            alt={h.imageAlt}
            priority
            sizes={HERO_SIZES}
            className="object-cover object-[50%_0%] lg:object-contain lg:object-center"
          />
        </div>

        {/* ديسكتوب: fade على الجنب | موبايل: gradient خفيف تحت النص بس */}
        <div className="hero-fade absolute inset-0 hidden lg:block" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-base via-base/70 to-transparent lg:hidden" aria-hidden="true" />

        {/* Badge */}
        <div className={`${PAD} anim-rise flex shrink-0 justify-center pt-[clamp(0.5rem,1.8vh,1.25rem)] lg:mt-auto lg:justify-start lg:pt-0`}>
          <p className="inline-flex items-center gap-2 rounded-full border bg-base/80 px-3 py-[clamp(0.3rem,1vh,0.5rem)] text-[9px] font-bold uppercase tracking-[0.12em] text-ink backdrop-blur-sm min-[400px]:text-[10px] sm:text-xs lg:bg-base/60 lg:px-4 lg:py-2.5 lg:text-xs lg:tracking-[0.16em]">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent lg:h-2 lg:w-2" aria-hidden="true" />
            {h.badge}
          </p>
        </div>

        {/* يدفع النص لتحت على الموبايل */}
        <div className="min-h-0 flex-1 lg:hidden" />

        {/* النص */}
        <div className={`${PAD} shrink-0 pb-[clamp(0.5rem,1.5vh,1rem)] lg:mb-auto lg:mt-[clamp(1rem,3vh,2rem)] lg:pb-0`}>
          <div className="lg:max-w-[48%]">
            <h1 className="anim-rise text-center text-[clamp(20px,3.8vh,30px)] font-bold leading-[1.18] text-ink sm:text-4xl lg:text-balance lg:text-left lg:text-[clamp(2rem,8vh,3.5rem)]" style={{ "--d": "90ms" }}>
              {h.titleStart} <span className="text-accent">{h.titleAccent}</span>
            </h1>

            <div className="anim-rise mt-[clamp(0.5rem,1.8vh,1.25rem)] grid grid-cols-2 gap-3 lg:mt-[clamp(1rem,3vh,2rem)] lg:inline-grid lg:grid-cols-[auto_auto]" style={{ "--d": "180ms" }}>
              <a href={safeHref(h.primary.href)} className="lift flex h-[clamp(40px,6vh,48px)] items-center justify-center rounded-full bg-accent px-7 text-[15px] font-bold text-on-accent hover:shadow-[0_10px_30px_-8px_var(--accent)] lg:h-12">
                {h.primary.label}
              </a>
              <a href={safeHref(h.secondary.href)} className="lift flex h-[clamp(40px,6vh,48px)] items-center justify-center rounded-full border bg-base/40 px-7 text-[15px] font-bold text-accent backdrop-blur-sm lg:h-12 lg:bg-transparent">
                {h.secondary.label}
              </a>
            </div>

            {h.stats?.length > 0 && (
              <dl className="anim-rise mt-[clamp(0.5rem,1.5vh,0.75rem)] flex items-center rounded-2xl border bg-card/90 py-[clamp(0.5rem,1.6vh,0.75rem)] backdrop-blur-sm lg:mt-[clamp(0.75rem,2.5vh,1.5rem)] lg:max-w-md" style={{ "--d": "270ms" }}>
                {h.stats.map((s, i) => (
                  <div key={s.label + i} className="relative flex-1 text-center">
                    {i > 0 && <span className="absolute left-0 top-1/2 h-8 w-px -translate-y-1/2 bg-line" aria-hidden="true" />}
                    <dd className="text-[clamp(18px,3vh,22px)] font-bold leading-none text-accent">{s.value}</dd>
                    <dt className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-muted">{s.label}</dt>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </div>

      {h.showBrands && (
        <div className="shrink-0">
          <BrandsStrip label={h.brandsLabel} brands={c.brands} />
        </div>
      )}
    </section>
  );
}