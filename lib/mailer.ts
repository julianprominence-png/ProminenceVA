import nodemailer from "nodemailer";

/* ─── Client Initialization ─────────────────────────────────────────────── */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const FROM_EMAIL = `"Prominence VA" <${process.env.SMTP_EMAIL}>`;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.SMTP_EMAIL || "prominence.va@gmail.com";

/* ─── Email Templates ───────────────────────────────────────────────────── */

function brandHeader(title: string, subtitle: string): string {
  return `
    <div style="background:linear-gradient(135deg,#1a1a2e 0%,#2d1b69 100%);padding:40px 32px;text-align:center;">
      <h1 style="color:#c084fc;font-size:22px;margin:0;letter-spacing:0.15em;text-transform:uppercase;font-family:'Segoe UI',Arial,sans-serif;">
        ${title}
      </h1>
      <p style="color:rgba(255,255,255,0.4);font-size:11px;margin-top:10px;letter-spacing:0.25em;text-transform:uppercase;font-family:'Segoe UI',Arial,sans-serif;">
        ${subtitle}
      </p>
    </div>`;
}

function brandFooter(quoteId: string): string {
  return `
    <div style="background:rgba(147,51,234,0.08);padding:20px 32px;text-align:center;">
      <p style="color:rgba(255,255,255,0.35);font-size:10px;margin:0 0 6px;letter-spacing:0.2em;text-transform:uppercase;font-family:'Segoe UI',Arial,sans-serif;">
        Quote Reference: ${quoteId}
      </p>
      <p style="color:rgba(255,255,255,0.2);font-size:10px;margin:0;letter-spacing:0.15em;font-family:'Segoe UI',Arial,sans-serif;">
        Prominence VA · ${ADMIN_EMAIL}
      </p>
    </div>`;
}

function emailWrapper(content: string): string {
  return `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0814;color:#e2e8f0;border-radius:16px;overflow:hidden;border:1px solid rgba(147,51,234,0.2);">
      ${content}
    </div>`;
}

function infoRow(label: string, value: string, isLink = false): string {
  const displayValue = isLink
    ? `<a href="mailto:${value}" style="color:#c084fc;text-decoration:none;font-size:14px;">${value}</a>`
    : `<span style="color:rgba(255,255,255,0.85);font-size:14px;">${value}</span>`;

  return `
    <tr>
      <td style="padding:12px 0;border-top:1px solid rgba(255,255,255,0.05);color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:0.15em;width:120px;vertical-align:top;">
        ${label}
      </td>
      <td style="padding:12px 0;border-top:1px solid rgba(255,255,255,0.05);">
        ${displayValue}
      </td>
    </tr>`;
}

/* ─── Send Functions ────────────────────────────────────────────────────── */

/**
 * Send confirmation email to the client after quote submission.
 */
export async function sendQuoteConfirmation(
  email: string,
  quoteId: string,
  fullName: string,
  services: string[]
): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: `Quote Request Received — ${quoteId}`,
      html: emailWrapper(`
        ${brandHeader("Quote Request Received", "Thank you for reaching out")}
        <div style="padding:32px;">
          <p style="color:rgba(255,255,255,0.85);font-size:15px;line-height:1.8;margin:0 0 24px;">
            Hi ${fullName},
          </p>
          <p style="color:rgba(255,255,255,0.7);font-size:14px;line-height:1.8;margin:0 0 24px;">
            We've received your quote request and our team is reviewing your project details. 
            We'll get back to you within <strong style="color:#c084fc;">24 hours</strong>.
          </p>
          <div style="background:rgba(147,51,234,0.08);border:1px solid rgba(147,51,234,0.15);border-radius:12px;padding:20px;margin:0 0 24px;">
            <p style="color:rgba(255,255,255,0.4);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">
              Services Requested
            </p>
            <p style="color:#c084fc;font-size:14px;font-weight:600;margin:0;">
              ${services.join(" · ")}
            </p>
          </div>
          <p style="color:rgba(255,255,255,0.5);font-size:13px;line-height:1.7;margin:0;">
            If you have any additional information to share, feel free to reply to this email.
          </p>
        </div>
        ${brandFooter(quoteId)}
      `),
    });
    return true;
  } catch (err) {
    console.error("[Nodemailer] Failed to send confirmation email:", err);
    return false;
  }
}

/**
 * Send notification email to admin when a new quote is submitted.
 */
export async function sendAdminNotification(data: {
  quoteId: string;
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  services: string[];
  projectDescription: string;
  budgetRange?: string;
}): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      replyTo: data.email,
      subject: `New Quote: ${data.fullName} — ${data.services.join(", ")}`,
      html: emailWrapper(`
        ${brandHeader("New Quote Request", "Prominence Command Center")}
        <div style="padding:32px;">
          <table style="width:100%;border-collapse:collapse;">
            ${infoRow("Quote ID", data.quoteId)}
            ${infoRow("Name", data.fullName)}
            ${infoRow("Email", data.email, true)}
            ${data.phone ? infoRow("Phone", data.phone) : ""}
            ${data.company ? infoRow("Company", data.company) : ""}
            ${infoRow("Services", data.services.join(", "))}
            ${data.budgetRange ? infoRow("Budget", data.budgetRange) : ""}
          </table>
          <div style="margin-top:24px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.05);">
            <p style="color:rgba(255,255,255,0.4);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">
              Project Description
            </p>
            <p style="color:rgba(255,255,255,0.75);font-size:14px;line-height:1.8;margin:0;white-space:pre-wrap;">
              ${data.projectDescription.replace(/\n/g, "<br/>")}
            </p>
          </div>
        </div>
        ${brandFooter(data.quoteId)}
      `),
    });
    return true;
  } catch (err) {
    console.error("[Nodemailer] Failed to send admin notification:", err);
    return false;
  }
}

/**
 * Send admin reply email to the client.
 */
export async function sendAdminReply(
  clientEmail: string,
  clientName: string,
  quoteId: string,
  message: string
): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: clientEmail,
      replyTo: ADMIN_EMAIL,
      subject: `Re: Your Quote Request — ${quoteId}`,
      html: emailWrapper(`
        ${brandHeader("Message from Prominence", `Regarding Quote ${quoteId}`)}
        <div style="padding:32px;">
          <p style="color:rgba(255,255,255,0.85);font-size:15px;line-height:1.8;margin:0 0 24px;">
            Hi ${clientName},
          </p>
          <div style="background:rgba(147,51,234,0.06);border-left:3px solid #7c3aed;padding:16px 20px;border-radius:0 8px 8px 0;margin:0 0 24px;">
            <p style="color:rgba(255,255,255,0.8);font-size:14px;line-height:1.8;margin:0;white-space:pre-wrap;">
              ${message.replace(/\n/g, "<br/>")}
            </p>
          </div>
          <p style="color:rgba(255,255,255,0.5);font-size:13px;line-height:1.7;margin:0;">
            Reply directly to this email to continue the conversation.
          </p>
        </div>
        ${brandFooter(quoteId)}
      `),
    });
    return true;
  } catch (err) {
    console.error("[Nodemailer] Failed to send admin reply:", err);
    return false;
  }
}
