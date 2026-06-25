import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const CONTACT_TO_EMAIL = "laspace@laspaceevents.fi";
const CONTACT_TO_NAME = "Laspace Events";
const CONTACT_FROM_EMAIL = "laspace@laspaceevents.fi";
const CONTACT_FROM_NAME = "Laspace Events Website";

function checkAuth(req: NextRequest, password: string): boolean {
  const auth = req.headers.get("authorization");
  if (!auth) return false;
  return auth.replace("Bearer ", "") === password;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeField(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
    // Brevo contact sync is non-blocking — don't fail the request
  }
}

class ContactEmailError extends Error {}

async function sendContactEmail(env: any, data: { name: string; email: string; message: string }) {
  if (!env.BREVO_API_KEY) {
    throw new ContactEmailError("BREVO_API_KEY is not configured");
  }

  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safeMessage = escapeHtml(data.message).replaceAll("\n", "<br />");
  const submittedAt = new Date().toLocaleString("fi-FI", { timeZone: "Europe/Helsinki" });

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": env.BREVO_API_KEY,
      "accept": "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: CONTACT_FROM_NAME,
        email: CONTACT_FROM_EMAIL,
      },
      to: [
        {
          name: CONTACT_TO_NAME,
          email: CONTACT_TO_EMAIL,
        },
      ],
      replyTo: {
        name: data.name,
        email: data.email,
      },
      subject: `Uusi yhteydenotto Laspace-sivulta: ${data.name}`,
      htmlContent: `
        <div style="font-family: Arial, Helvetica, sans-serif; background:#0b0b0f; color:#ffffff; padding:28px;">
          <div style="max-width:680px; margin:0 auto; background:#14141c; border:1px solid #2d2d3a; border-radius:18px; padding:28px;">
            <h1 style="margin:0 0 18px; color:#ffffff;">Uusi yhteydenotto Laspace-sivulta</h1>
            <p style="margin:0 0 22px; color:#b8b8c7;">Lähetetty: ${escapeHtml(submittedAt)}</p>
            <p><strong>Nimi / Ravintola:</strong><br />${safeName}</p>
            <p><strong>Sähköposti:</strong><br /><a href="mailto:${safeEmail}" style="color:#75d7ff;">${safeEmail}</a></p>
            <p><strong>Viesti:</strong><br />${safeMessage}</p>
          </div>
        </div>
      `,
      textContent: `Uusi yhteydenotto Laspace-sivulta\n\nLähetetty: ${submittedAt}\n\nNimi / Ravintola: ${data.name}\nSähköposti: ${data.email}\n\nViesti:\n${data.message}\n`,
    }),
  });

  const responseText = await res.text();
  if (!res.ok) {
    throw new ContactEmailError(`Brevo email send failed: ${res.status} ${responseText}`);
  }

  try {
    return JSON.parse(responseText) as { messageId?: string };
  } catch {
    return { messageId: undefined };
  }
}

export async function POST(req: NextRequest) {
  const { env } = await getCloudflareContext({ async: true });
  const body = await req.json();
  const name = normalizeField(body.name);
  const email = normalizeField(body.email);
  const message = normalizeField(body.message);

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  await env.DB.prepare(
    "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)"
  ).bind(name, email, message).run();

  try {
    const emailResult = await sendContactEmail(env, { name, email, message });
    await syncToBrevo(env, email, name);

    return NextResponse.json({ ok: true, emailSent: true, messageId: emailResult.messageId }, { status: 201 });
  } catch (error) {
    console.error("Contact email failed", error);
    return NextResponse.json(
      { error: "Message saved but email delivery failed" },
      { status: 502 }
    );
  }
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
