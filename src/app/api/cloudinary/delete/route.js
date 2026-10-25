import { v2 as cloudinary } from "cloudinary";
import { json, requireAdmin } from "@/lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Deletes one asset the dashboard uploaded (only inside the "izac/" folder).
export async function POST(request) {
  const g = await requireAdmin(request);
  if (g.error) return g.error;
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  const { publicId, resourceType } = await request.json().catch(() => ({}));
  if (typeof publicId !== "string" || !publicId.startsWith("izac/") || publicId.includes("..") || !["image", "video", "raw"].includes(resourceType)) {
    return json({ error: "Bad request" }, 400);
  }
  const res = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType, invalidate: true });
  return json({ result: res.result }, 200);
}
