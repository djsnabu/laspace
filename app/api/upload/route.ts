import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";


export async function POST(req: NextRequest) {
  const { env } = await getCloudflareContext({ async: true });
  const auth = req.headers.get("authorization");
  if (!auth || auth.replace("Bearer ", "") !== env.ADMIN_PASS) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("image") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${Date.now()}.${ext}`;

  await env.IMAGES.put(filename, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  });

  return NextResponse.json({ url: `/api/images/${filename}` });
}
