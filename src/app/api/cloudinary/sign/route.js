import { v2 as cloudinary } from "cloudinary";
import { json, requireAdmin } from "@/lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TYPES = ["image", "video", "raw"];
const FOLDERS = ["hero", "about", "brands", "works", "posters", "reviews", "files", "fonts"];

// Signs a direct browser → Cloudinary upload (big videos never pass through our server).
export async function POST(request) {
  const g = await requireAdmin(request);
  if (g.error) return g.error;
  const secret = process.env.CLOUDINARY_API_SECRET;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!secret || !apiKey || !cloudName) return json({ error: "Cloudinary env vars are missing" }, 503);

  const { resourceType, folder } = await request.json().catch(() => ({}));
  if (!TYPES.includes(resourceType) || !FOLDERS.includes(folder)) return json({ error: "Bad request" }, 400);

  const params = { timestamp: Math.round(Date.now() / 1000), folder: `izac/${folder}` };
  const signature = cloudinary.utils.api_sign_request(params, secret);
  return json({ ...params, signature, apiKey, cloudName }, 200);
}
