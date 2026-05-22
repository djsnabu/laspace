import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

function checkAuth(req: NextRequest, password: string): boolean {
  const auth = req.headers.get("authorization");
  if (!auth) return false;
  return auth.replace("Bearer ", "") === password;
}

async function syncToBrevo(env: any, email: string, firstName?: string, lastName?: string) {
  if (!env.BREVO_API_KEY) return;
  try {
    await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        attributes: {
          FIRSTNAME: firstName || "",
          LASTNAME: lastName || "",
        },
        listIds: [parseInt(env.BREVO_LIST_ID || "2")],
        updateEnabled: true,
      }),
    });
  } catch {
    // Brevo sync is non-blocking — don't fail the request
  }
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

  // Sync to Brevo (fire-and-forget — don't await, don't block)
  syncToBrevo(env, body.email, body.name);

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
