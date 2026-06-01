import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-admin";
import { firestoreUpdate } from "@/lib/firebase-admin";
import { sanitizeInput } from "@/lib/sanitize";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ quoteId: string }> }
) {
  try {
    /* 1. Verify admin authentication ───────────────────────────────────── */
    const authResult = await requireAdmin(req);
    if ("error" in authResult) return authResult.error;

    /* 2. Parse request ─────────────────────────────────────────────────── */
    const { quoteId } = await params;
    const body = await req.json();

    if (typeof body.internalNotes !== "string") {
      return NextResponse.json(
        { status: "error", error: "internalNotes must be a string" },
        { status: 400 }
      );
    }

    const notes = sanitizeInput(body.internalNotes);

    /* 3. Update Notes ──────────────────────────────────────────────────── */
    await firestoreUpdate("quotes", quoteId, {
      internalNotes: notes,
      updatedAt: "SERVER_TIMESTAMP",
    }, authResult.token);

    return NextResponse.json({ status: "success" });
  } catch (err) {
    console.error("[Notes API] Error:", err);
    return NextResponse.json(
      { status: "error", error: "Failed to update notes" },
      { status: 500 }
    );
  }
}
