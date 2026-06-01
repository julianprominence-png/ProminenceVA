import { z } from "zod";

/* ─── Constants ─────────────────────────────────────────────────────────── */

export const SERVICE_OPTIONS = [
  "Web Development",
  "Graphic Design",
  "Video Editing",
] as const;

export const BUDGET_RANGES = [
  "Under $500",
  "$500 – $1,000",
  "$1,000 – $2,500",
  "$2,500 – $5,000",
  "$5,000 – $10,000",
  "$10,000+",
  "Not sure yet",
] as const;

export const QUOTE_STATUSES = [
  "new",
  "contacted",
  "in-progress",
  "won",
  "lost",
] as const;

/* ─── Zod Schemas ───────────────────────────────────────────────────────── */

export const quoteFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .transform((v) => v.trim()),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(254, "Email is too long")
    .transform((v) => v.trim().toLowerCase()),
  phone: z
    .string()
    .max(20, "Phone number is too long")
    .regex(/^[+\d\s\-().]*$/, "Invalid phone number format")
    .optional()
    .or(z.literal("")),
  company: z
    .string()
    .max(100, "Company name is too long")
    .optional()
    .or(z.literal("")),
  services: z
    .array(z.enum(SERVICE_OPTIONS))
    .min(1, "Please select at least one service"),
  projectDescription: z
    .string()
    .min(10, "Please describe your project in at least 10 characters")
    .max(5000, "Description is too long")
    .transform((v) => v.trim()),
  budgetRange: z
    .enum(BUDGET_RANGES)
    .optional()
    .or(z.literal("")),
});

export type QuoteFormData = z.infer<typeof quoteFormSchema>;

/* ─── Firestore Document Types ──────────────────────────────────────────── */

export type QuoteStatus = (typeof QUOTE_STATUSES)[number];
export type ServiceOption = (typeof SERVICE_OPTIONS)[number];
export type BudgetRange = (typeof BUDGET_RANGES)[number];

export interface QuoteDocument {
  quoteId: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  services: ServiceOption[];
  projectDescription: string;
  budgetRange: string;
  source: "landing-page";
  status: QuoteStatus;
  internalNotes: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface QuoteMessage {
  id?: string;
  sender: "client" | "admin";
  content: string;
  createdAt: string; // ISO timestamp
}

/* ─── API Response Types ────────────────────────────────────────────────── */

export interface QuoteSubmitResponse {
  status: "success" | "error";
  quoteId?: string;
  error?: string;
}

export interface QuoteReplyPayload {
  content: string;
}

export interface QuoteStatusPayload {
  status: QuoteStatus;
}

export interface QuoteNotesPayload {
  internalNotes: string;
}
