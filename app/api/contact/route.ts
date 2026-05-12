import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

/* ─── Firestore REST helpers ────────────────────────────────────────────── */
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

async function firestoreAdd(collectionName: string, fields: Record<string, unknown>) {
  const body: Record<string, unknown> = { fields: {} };
  const f = body.fields as Record<string, unknown>;

  for (const [key, value] of Object.entries(fields)) {
    if (value === "SERVER_TIMESTAMP") f[key] = { timestampValue: new Date().toISOString() };
    else if (typeof value === "string") f[key] = { stringValue: value };
    else if (typeof value === "boolean") f[key] = { booleanValue: value };
  }

  const res = await fetch(`${FIRESTORE_URL}/${collectionName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Firestore write failed (${res.status}): ${err}`);
  }

  const data = await res.json();
  // Extract doc ID from name: "projects/.../documents/contacts/DOC_ID"
  const docId = data.name?.split("/").pop() || "";
  return docId;
}

async function firestoreUpdate(collectionName: string, docId: string, fields: Record<string, unknown>) {
  const body: Record<string, unknown> = { fields: {} };
  const f = body.fields as Record<string, unknown>;

  for (const [key, value] of Object.entries(fields)) {
    if (typeof value === "string") f[key] = { stringValue: value };
    else if (typeof value === "boolean") f[key] = { booleanValue: value };
  }

  const updateMask = Object.keys(fields).map((k) => `updateMask.fieldPaths=${k}`).join("&");
  const res = await fetch(`${FIRESTORE_URL}/${collectionName}/${docId}?${updateMask}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error("Firestore update failed:", await res.text());
  }
}

/* ─── Nodemailer transport ──────────────────────────────────────────────── */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

/* ─── Validation ────────────────────────────────────────────────────────── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validatePayload(body: Record<string, unknown>): string | null {
  const { name, email, message } = body;
  if (!name || typeof name !== "string" || name.trim().length < 2) return "Name must be at least 2 characters.";
  if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim())) return "A valid email address is required.";
  if (!message || typeof message !== "string" || message.trim().length < 5) return "Message must be at least 5 characters.";
  return null;
}

/* ─── POST handler ──────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const error = validatePayload(body);
    if (error) {
      return NextResponse.json({ status: "error", error }, { status: 400 });
    }

    const name = (body.name as string).trim();
    const email = (body.email as string).trim();
    const message = (body.message as string).trim();

    /* 1. Store contact in Firestore ─────────────────────────────────────── */
    const contactId = await firestoreAdd("contacts", {
      name,
      email,
      message,
      status: "delivered",
      emailSent: "false",
      readByAdmin: false,
      createdAt: "SERVER_TIMESTAMP",
    });

    /* 2. Create admin notification ──────────────────────────────────────── */
    await firestoreAdd("notifications", {
      type: "new_contact",
      contactId,
      title: `New message from ${name}`,
      preview: message.length > 80 ? message.slice(0, 80) + "…" : message,
      senderEmail: email,
      read: false,
      createdAt: "SERVER_TIMESTAMP",
    });

    /* 3. Send email notification ────────────────────────────────────────── */
    let emailSent = false;
    try {
      await transporter.sendMail({
        from: `"Prominence VA" <${process.env.SMTP_EMAIL}>`,
        to: process.env.SMTP_EMAIL,
        replyTo: email,
        subject: `New Contact: ${name}`,
        html: `
          <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0814;color:#e2e8f0;border-radius:16px;overflow:hidden;border:1px solid rgba(147,51,234,0.2);">
            <div style="background:linear-gradient(135deg,#1a1a2e,#2d1b69);padding:32px;text-align:center;">
              <h1 style="color:#c084fc;font-size:20px;margin:0;letter-spacing:0.15em;text-transform:uppercase;">New Contact Received</h1>
              <p style="color:rgba(255,255,255,0.4);font-size:11px;margin-top:8px;letter-spacing:0.2em;text-transform:uppercase;">Prominence Command Center</p>
            </div>
            <div style="padding:32px;">
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:12px 0;color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:0.15em;width:100px;">Name</td><td style="padding:12px 0;color:#fff;font-size:15px;font-weight:600;">${name}</td></tr>
                <tr><td style="padding:12px 0;border-top:1px solid rgba(255,255,255,0.05);color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:0.15em;">Email</td><td style="padding:12px 0;border-top:1px solid rgba(255,255,255,0.05);"><a href="mailto:${email}" style="color:#c084fc;text-decoration:none;font-size:14px;">${email}</a></td></tr>
                <tr><td style="padding:12px 0;border-top:1px solid rgba(255,255,255,0.05);color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:0.15em;">Message</td><td style="padding:12px 0;border-top:1px solid rgba(255,255,255,0.05);color:rgba(255,255,255,0.75);font-size:14px;line-height:1.7;">${message.replace(/\n/g, "<br/>")}</td></tr>
              </table>
            </div>
            <div style="background:rgba(147,51,234,0.08);padding:16px 32px;text-align:center;">
              <p style="color:rgba(255,255,255,0.25);font-size:10px;margin:0;letter-spacing:0.2em;text-transform:uppercase;">Reply directly to this email to respond to ${name}</p>
            </div>
          </div>`,
      });
      emailSent = true;
    } catch (emailErr) {
      console.error("Email send failed:", emailErr);
    }

    /* 4. Update email status ────────────────────────────────────────────── */
    if (emailSent && contactId) {
      await firestoreUpdate("contacts", contactId, { emailSent: true });
    }

    return NextResponse.json({ status: "delivered", messageId: contactId, emailSent });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ status: "error", error: "Internal server error. Please try again." }, { status: 500 });
  }
}
