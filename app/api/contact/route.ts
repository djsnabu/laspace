import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

function checkAuth(req: NextRequest, password: string): boolean {
  const auth = req.headers.get("authorization");
  if (!auth) return false;
  return auth.replace("Bearer ", "") === password;
}

export async function POST(req: NextRequest) {
  const { env } = await getCloudflareContext({ async: true });
  const body = await req.json();
  if (!body.name || !body.email || !body.message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  await env.DB.prepare(
    "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)"
  ).bind(body.name, body.email, body.message).run();
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const { env } = await getCloudflareContext({ async: true });
  if (!checkAuth(req, env.ADMIN_PASS)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await env.DB.prepare(
    "SELECT * FROM contacts ORDER BY created_at DESC"
  ).all();
  return NextResponse.json(result.results);
}

export async function PATCH(req: NextRequest) {
  const { env } = await getCloudflareContext({ async: true });
  if (!checkAuth(req, env.ADMIN_PASS)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  await env.DB.prepare("UPDATE contacts SET read=1 WHERE id=?").bind(body.id).run();
  return NextResponse.json({ ok: true });
}
