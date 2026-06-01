import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth-admin";
import { firestoreAdd, firestoreGet, firestoreUpdate } from "@/lib/firebase-admin";
import { sanitizeInput } from "@/lib/sanitize";
import { sendAdminReply } from "@/lib/mailer";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ quoteId: string }> }
) {
  try {
    const { quoteId } = await params;
    // 1. Auth Guard
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split("Bearer ")[1];
    
    const adminUser = await verifyAdminToken(req);
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse & Sanitize
    const { content } = await req.json();
    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Message content required." }, { status: 400 });
    }
    const sanitizedContent = sanitizeInput(content.trim());

    // 3. Get Quote Details (for client email/name)
    const quoteData = await firestoreGet("quotes", quoteId, token);
    if (!quoteData) {
      return NextResponse.json({ error: "Quote not found." }, { status: 404 });
    }

    // 4. Add Message to Subcollection
    const messageId = Date.now().toString() + "-" + Math.random().toString(36).substring(2, 9);
    await firestoreAdd(`quotes/${quoteId}/messages`, {
      sender: "admin",
      content: sanitizedContent,
      createdAt: "SERVER_TIMESTAMP",
    }, token);

    // 5. Update Parent Quote Status to "contacted" if it was "new"
    const currentStatus = (quoteData.status as string) || "new";
    if (currentStatus === "new") {
      await firestoreUpdate("quotes", quoteId, {
        status: "contacted",
        updatedAt: "SERVER_TIMESTAMP",
      }, adminUser.rawToken);
    } else {
      await firestoreUpdate("quotes", quoteId, {
        updatedAt: "SERVER_TIMESTAMP",
      }, adminUser.rawToken);
    }

    // 6. Send Email via Nodemailer
    const clientEmail = quoteData.email as string;
    const clientName = quoteData.fullName as string;
    
    if (clientEmail && clientName) {
      await sendAdminReply(clientEmail, clientName, quoteId, sanitizedContent);
    }

    return NextResponse.json({ success: true, messageId }, { status: 201 });
  } catch (error: any) {
    console.error("Quote reply error:", error);
    return NextResponse.json(
      { error: error?.message || String(error) },
      { status: 500 }
    );
  }
}
