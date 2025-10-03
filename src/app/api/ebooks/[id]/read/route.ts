// ✅ src/app/api/ebooks/[id]/read/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { createClientServer } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js"; // ✅ use direct client for signing

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params;
  const id = decodeURIComponent(rawId).trim();

  // 1️⃣ Check user authentication
  const supaSSR = await createClientServer();
  const {
    data: { user },
  } = await supaSSR.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 2️⃣ Create service role client (for database queries)
  const service = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 3️⃣ Verify purchase
  const { data: purchase } = await service
    .from("purchases")
    .select("ebook_id")
    .eq("user_id", user.id)
    .eq("ebook_id", id)
    .single();

  if (!purchase) {
    const { data: paidOrder } = await service
      .from("orders")
      .select("id")
      .eq("user_id", user.id)
      .eq("ebook_id", id)
      .eq("status", "paid")
      .maybeSingle();

    if (!paidOrder)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 4️⃣ Get file path from ebooks table
  const { data: ebookRow, error: ebookErr } = await service
    .from("ebooks")
    .select("ebook_file_path")
    .eq("id", id)
    .maybeSingle();

  const rawPath = ebookRow?.ebook_file_path?.trim();
  if (!rawPath)
    return NextResponse.json(
      {
        error: "File path not configured for this ebook",
        debug: { ebookErr, searchedId: id },
      },
      { status: 404 }
    );

  // 5️⃣ Normalize bucket + path
  let bucket = "ebook-files";
  let path = rawPath;

  try {
    if (/^https?:\/\//i.test(path)) {
      const url = new URL(path);
      const parts = url.pathname.split("/").filter(Boolean);
      const idx = parts.indexOf("public");
      if (idx >= 0 && parts[idx + 1]) {
        bucket = parts[idx + 1];
        path = parts.slice(idx + 2).join("/");
      }
    }
  } catch {}

  // Remove leading slashes / bucket prefixes
  if (path.startsWith(bucket + "/")) path = path.slice(bucket.length + 1);
  if (path.startsWith("/")) path = path.slice(1);

  // 6️⃣ Try to create a signed URL (longer expiry for reading)
  const { data: signed, error } = await service.storage
    .from(bucket)
    .createSignedUrl(path, 3600); // 1 hour expiry for reading

  if (!signed?.signedUrl || error) {
    // 🧠 Debug info if file not found
    const { data: list } = await service.storage.from(bucket).list();
    return NextResponse.json(
      {
        error: error?.message || "File not found",
        bucket,
        triedPath: path,
        objectCount: list?.length || 0,
        sampleObjects: list?.map((f: any) => f.name),
      },
      { status: 404 }
    );
  }

  // 7️⃣ Return the signed URL directly (for iframe embedding)
  return NextResponse.json({ 
    url: signed.signedUrl,
    expiresAt: new Date(Date.now() + 3600 * 1000).toISOString()
  });
}
