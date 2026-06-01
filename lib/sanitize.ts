/**
 * Input sanitization utilities for server-side use.
 * Strips HTML tags, normalizes whitespace, and prevents injection.
 */

/** Strip all HTML tags from a string */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}

/** Normalize excessive whitespace while preserving single line breaks */
export function normalizeWhitespace(input: string): string {
  return input
    .replace(/[^\S\n]+/g, " ") // collapse horizontal whitespace
    .replace(/\n{3,}/g, "\n\n") // max 2 consecutive newlines
    .trim();
}

/** Full sanitization pipeline for user text input */
export function sanitizeInput(input: string): string {
  return normalizeWhitespace(stripHtml(input));
}

/** Sanitize all string values in an object (shallow) */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj };
  for (const key in sanitized) {
    if (typeof sanitized[key] === "string") {
      (sanitized as Record<string, unknown>)[key] = sanitizeInput(
        sanitized[key] as string
      );
    }
  }
  return sanitized;
}
