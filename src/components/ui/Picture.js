import Image from "next/image";
import { imageSrcSet, imageUrl, isCld } from "@/lib/media";

/**
 * Fills its (relatively positioned) parent. Local files go through next/image (resized + AVIF/WebP),
 * Cloudinary files use Cloudinary's own on-the-fly resizing (f_auto,q_auto:eco + srcset).
 * src is 750 so it matches the preload in Hero (no double download).
 */
export default function Picture({ media, alt, sizes = "100vw", priority = false, className = "" }) {
  if (!media?.url) return null;
  if (isCld(media)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl(media, 750)}
        srcSet={imageSrcSet(media)}
        sizes={sizes}
        alt={alt}
        width={media.width || undefined}
        height={media.height || undefined}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        className={`absolute inset-0 h-full w-full ${className}`}
      />
    );
  }
  return <Image src={media.url} alt={alt} fill sizes={sizes} priority={priority} quality={70} className={className} />;
}