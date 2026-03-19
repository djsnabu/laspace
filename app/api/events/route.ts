import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";


function checkAuth(req: NextRequest, password: string): boolean {
  const auth = req.headers.get("authorization");
  if (!auth) return false;
  return auth.replace("Bearer ", "") === password;
}

export async function GET() {
  const { env } = await getCloudflareContext({ async: true });
  const result = await env.DB.prepare(
    "SELECT * FROM events WHERE visible = 1 ORDER BY date ASC"
  ).all();
  return NextResponse.json(result.results);
}

export async function POST(req: NextRequest) {
  const { env } = await getCloudflareContext({ async: true });
  if (!checkAuth(req, env.ADMIN_PASS)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  await env.DB.prepare(
    "INSERT INTO events (name, date, date_label, venue, description, ticket_url, image_url, color, visible, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  )
    .bind(
      body.name,
      body.date,
      body.date_label || "",
      body.venue,
      body.description || "",
      body.ticket_url || "",
      body.image_url || "",
      body.color || "purple",
      body.visible ?? 1,
      body.sort_order || 0
    )
    .run();
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { env } = await getCloudflareContext({ async: true });
  if (!checkAuth(req, env.ADMIN_PASS)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  await env.DB.prepare(
    "UPDATE events SET name=?, date=?, date_label=?, venue=?, description=?, ticket_url=?, image_url=?, color=?, visible=? WHERE id=?"
  )
    .bind(
      body.name,
      body.date,
      body.date_label || "",
      body.venue,
      body.description || "",
      body.ticket_url || "",
      body.image_url || "",
      body.color || "purple",
      body.visible ?? 1,
      body.id
    )
    .run();
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { env } = await getCloudflareContext({ async: true });
  if (!checkAuth(req, env.ADMIN_PASS)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  await env.DB.prepare("DELETE FROM events WHERE id=?").bind(id).run();
  return NextResponse.json({ ok: true });
}
