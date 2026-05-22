import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(req: NextRequest) {
  const { env } = await getCloudflareContext({ async: true });

  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  if (!env.BREVO_API_KEY) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: body.email,
        listIds: [parseInt(env.BREVO_LIST_ID || "2")],
        updateEnabled: true,
      }),
    });

    if (res.ok || res.status === 204) {
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    // If contact already exists, Brevo returns 400 with "duplicate"
    const data = await res.json() as { code?: string };
    if (data.code === "duplicate_parameter") {
      return NextResponse.json({ ok: true, already_subscribed: true });
    }

    return NextResponse.json({ error: "Brevo error" }, { status: 502 });
  } catch {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
}
