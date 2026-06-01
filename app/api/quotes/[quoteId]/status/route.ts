import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-admin";
import { firestoreUpdate } from "@/lib/firebase-admin";
import { QUOTE_STATUSES } from "@/types/quote";

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

    if (
      !body.status ||
      !QUOTE_STATUSES.includes(body.status)
    ) {
      return NextResponse.json(
        {
          status: "error",
          error: `Invalid status. Must be one of: ${QUOTE_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    /* 3. Update status ─────────────────────────────────────────────────── */
    await firestoreUpdate("quotes", quoteId, {
      status: body.status,
      updatedAt: "SERVER_TIMESTAMP",
    }, authResult.token);

    return NextResponse.json({ status: "success" });
  } catch (err) {
    console.error("[Status API] Error:", err);
    return NextResponse.json(
      { status: "error", error: "Failed to update status" },
      { status: 500 }
    );
  }
}
