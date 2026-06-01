/**
 * Server-side Firestore helpers using the REST API.
 * Matches the existing pattern from api/contact/route.ts.
 *
 * Uses the public API key for writes (quotes collection allows public create).
 * Admin-only operations verify Firebase auth tokens before proceeding.
 */

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY!;
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

/* ─── Type Helpers ──────────────────────────────────────────────────────── */

type FirestoreValue =
  | { stringValue: string }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { timestampValue: string }
  | { arrayValue: { values: FirestoreValue[] } }
  | { mapValue: { fields: Record<string, FirestoreValue> } };

function toFirestoreValue(value: unknown): FirestoreValue {
  if (value === "SERVER_TIMESTAMP") {
    return { timestampValue: new Date().toISOString() };
  }
  if (typeof value === "string") {
    return { stringValue: value };
  }
  if (typeof value === "boolean") {
    return { booleanValue: value };
  }
  if (typeof value === "number") {
    return { integerValue: String(value) };
  }
  if (Array.isArray(value)) {
    return {
      arrayValue: {
        values: value.map((v) => toFirestoreValue(v)),
      },
    };
  }
  return { stringValue: String(value) };
}

function fromFirestoreValue(value: FirestoreValue): unknown {
  if ("stringValue" in value) return value.stringValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("timestampValue" in value) return value.timestampValue;
  if ("arrayValue" in value) {
    return (value.arrayValue.values || []).map(fromFirestoreValue);
  }
  if ("mapValue" in value) {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value.mapValue.fields)) {
      result[k] = fromFirestoreValue(v);
    }
    return result;
  }
  return null;
}

/* ─── Core Operations ───────────────────────────────────────────────────── */

/**
 * Add a document to a collection. Returns the generated document ID.
 */
export async function firestoreAdd(
  collectionPath: string,
  fields: Record<string, unknown>,
  token?: string
): Promise<string> {
  const body: Record<string, unknown> = { fields: {} };
  const f = body.fields as Record<string, FirestoreValue>;

  for (const [key, value] of Object.entries(fields)) {
    f[key] = toFirestoreValue(value);
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-goog-api-key": API_KEY,
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${FIRESTORE_URL}/${collectionPath}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Firestore write failed (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.name?.split("/").pop() || "";
}

/**
 * Add a document with a specific ID.
 */
export async function firestoreSet(
  collectionPath: string,
  docId: string,
  fields: Record<string, unknown>,
  token?: string
): Promise<void> {
  const body: Record<string, unknown> = { fields: {} };
  const f = body.fields as Record<string, FirestoreValue>;

  for (const [key, value] of Object.entries(fields)) {
    f[key] = toFirestoreValue(value);
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-goog-api-key": API_KEY,
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${FIRESTORE_URL}/${collectionPath}/${docId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Firestore set failed (${res.status}): ${err}`);
  }
}

/**
 * Update specific fields in a document.
 */
export async function firestoreUpdate(
  collectionPath: string,
  docId: string,
  fields: Record<string, unknown>,
  token?: string
): Promise<void> {
  const body: Record<string, unknown> = { fields: {} };
  const f = body.fields as Record<string, FirestoreValue>;

  for (const [key, value] of Object.entries(fields)) {
    f[key] = toFirestoreValue(value);
  }

  const updateMask = Object.keys(fields)
    .map((k) => `updateMask.fieldPaths=${k}`)
    .join("&");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-goog-api-key": API_KEY,
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(
    `${FIRESTORE_URL}/${collectionPath}/${docId}?${updateMask}`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Firestore update failed (${res.status}): ${err}`);
  }
}

/**
 * Get a single document by path.
 */
export async function firestoreGet(
  collectionPath: string,
  docId: string,
  token?: string
): Promise<Record<string, unknown> | null> {
  const headers: Record<string, string> = {
    "x-goog-api-key": API_KEY,
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(
    `${FIRESTORE_URL}/${collectionPath}/${docId}`,
    {
      method: "GET",
      headers,
    }
  );

  if (!res.ok) {
    if (res.status === 404) return null;
    const err = await res.text();
    throw new Error(`Firestore get failed (${res.status}): ${err}`);
  }

  const data = await res.json();
  if (!data.fields) return null;

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data.fields)) {
    result[key] = fromFirestoreValue(value as FirestoreValue);
  }
  return result;
}

/* ─── Quote ID Generator ────────────────────────────────────────────────── */

/**
 * Generate a unique, human-readable Quote ID.
 * Format: QT-{YYMMDD}-{4-char random}
 */
export function generateQuoteId(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `QT-${yy}${mm}${dd}-${rand}`;
}
