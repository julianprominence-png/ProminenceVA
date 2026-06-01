import { NextRequest, NextResponse } from "next/server";
import { quoteFormSchema } from "@/types/quote";
import { sanitizeInput } from "@/lib/sanitize";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import {
  firestoreAdd,
  firestoreSet,
  generateQuoteId,
} from "@/lib/firebase-admin";
import {
  sendQuoteConfirmation,
  sendAdminNotification,
} from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    /* 1. Rate limiting ─────────────────────────────────────────────────── */
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`quote:${ip}`, {
      maxRequests: 5,
      windowMs: 10 * 60 * 1000, // 10 minutes
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          status: "error",
          error: "Too many requests. Please try again later.",
        },
        { status: 429 }
      );
    }

    /* 2. Parse and validate ────────────────────────────────────────────── */
    const body = await req.json();
    const result = quoteFormSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0];
      return NextResponse.json(
        {
          status: "error",
          error: firstError?.message || "Validation failed",
        },
        { status: 400 }
      );
    }

    const data = result.data;

    /* 3. Sanitize inputs ───────────────────────────────────────────────── */
    const sanitized = {
      fullName: sanitizeInput(data.fullName),
      email: data.email, // already trimmed/lowered by Zod
      phone: data.phone ? sanitizeInput(data.phone) : "",
      company: data.company ? sanitizeInput(data.company) : "",
      services: data.services,
      projectDescription: sanitizeInput(data.projectDescription),
      budgetRange: data.budgetRange || "",
    };

    /* 4. Generate Quote ID ─────────────────────────────────────────────── */
    const quoteId = generateQuoteId();

    /* 5. Write to Firestore ────────────────────────────────────────────── */
    await firestoreSet("quotes", quoteId, {
      quoteId,
      fullName: sanitized.fullName,
      email: sanitized.email,
      phone: sanitized.phone,
      company: sanitized.company,
      services: sanitized.services,
      projectDescription: sanitized.projectDescription,
      budgetRange: sanitized.budgetRange,
      source: "landing-page",
      status: "new",
      internalNotes: "",
      createdAt: "SERVER_TIMESTAMP",
      updatedAt: "SERVER_TIMESTAMP",
    });

    /* 6. Store initial message in conversation subcollection ───────────── */
    try {
      await firestoreAdd(`quotes/${quoteId}/messages`, {
        sender: "client",
        content: sanitized.projectDescription,
        createdAt: "SERVER_TIMESTAMP",
      });
    } catch (msgErr) {
      console.error("[Quote] Failed to create initial message:", msgErr);
      // Non-critical — quote is already saved
    }

    /* 7. Send emails ──────────────────────────────────────────────────── */
    // Run emails in parallel, non-blocking
    const emailPromises = [
      sendQuoteConfirmation(
        sanitized.email,
        quoteId,
        sanitized.fullName,
        sanitized.services
      ),
      sendAdminNotification({
        quoteId,
        fullName: sanitized.fullName,
        email: sanitized.email,
        phone: sanitized.phone || undefined,
        company: sanitized.company || undefined,
        services: sanitized.services,
        projectDescription: sanitized.projectDescription,
        budgetRange: sanitized.budgetRange || undefined,
      }),
    ];

    // Don't await emails — let them send in background
    Promise.allSettled(emailPromises).then((results) => {
      results.forEach((r, i) => {
        if (r.status === "rejected") {
          console.error(`[Quote] Email ${i} failed:`, r.reason);
        }
      });
    });

    /* 8. Return success ───────────────────────────────────────────────── */
    return NextResponse.json({
      status: "success",
      quoteId,
    });
  } catch (err) {
    console.error("[Quote API] Error:", err);
    return NextResponse.json(
      {
        status: "error",
        error: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
