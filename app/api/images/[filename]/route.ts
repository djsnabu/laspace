import { NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";


export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const { env } = await getCloudflareContext({ async: true });
  const file = await env.IMAGES.get(filename);

  if (!file) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(file.body, {
    headers: {
      "Content-Type": file.httpMetadata?.contentType || "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
