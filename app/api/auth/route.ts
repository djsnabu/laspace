import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";


export async function POST(req: NextRequest) {
  const { env } = await getCloudflareContext({ async: true });
  const { password } = await req.json();
  if (password === env.ADMIN_PASS) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
