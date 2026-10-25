import { revalidatePath } from "next/cache";
import { defaultContent } from "@/content/defaults";
import { CONTENT_DOC, getContent, readStored } from "@/lib/content";
import { adminDb } from "@/lib/firebaseAdmin";
import { json, requireAdmin } from "@/lib/guard";
import { sanitizeContent } from "@/lib/sanitize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ref = () => adminDb().collection(CONTENT_DOC[0]).doc(CONTENT_DOC[1]);

// Dashboard loads the current content here (Firestore is closed to browsers by firestore.rules).
export async function GET(request) {
  const g = await requireAdmin(request);
  if (g.error) return g.error;
  const stored = await readStored();
  return json({ content: stored ? await getContent() : defaultContent, saved: Boolean(stored) }, 200);
}

export async function PUT(request) {
  const g = await requireAdmin(request);
  if (g.error) return g.error;
  try {
    if (Number(request.headers.get("content-length") || 0) > 600_000) return json({ error: "Payload too large" }, 413);
    const body = await request.json();
    const content = sanitizeContent(body.content);
    await ref().set(content);
    revalidatePath("/", "layout");
    return json({ ok: true }, 200);
  } catch (e) {
    return json({ error: e.message || "Invalid content" }, 400);
  }
}

// "Reset to defaults"
export async function DELETE(request) {
  const g = await requireAdmin(request);
  if (g.error) return g.error;
  await ref().delete();
  revalidatePath("/", "layout");
  return json({ ok: true }, 200);
}
