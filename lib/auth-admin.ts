/**
 * Admin authentication verification for API routes.
 * Verifies Firebase ID tokens sent in the Authorization header.
 */

const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY!;

interface TokenInfo {
  uid: string;
  email: string;
}

/**
 * Verify a Firebase ID token using the public token verification endpoint.
 * This uses the Google Identity Toolkit REST API to validate tokens without
 * requiring the Firebase Admin SDK service account.
 */
export async function verifyAdminToken(
  request: Request
): Promise<(TokenInfo & { rawToken: string }) | null> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const idToken = authHeader.slice(7);

  try {
    // Use Google's secure token verification endpoint
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    );

    if (!res.ok) {
      console.error("[Auth] Token verification failed:", res.status);
      return null;
    }

    const data = await res.json();
    const user = data.users?.[0];

    if (!user) {
      return null;
    }

    return {
      uid: user.localId,
      email: user.email,
      rawToken: idToken,
    };
  } catch (err) {
    console.error("[Auth] Token verification error:", err);
    return null;
  }
}

/**
 * Require admin authentication. Returns 401 response if not authenticated.
 */
export async function requireAdmin(
  request: Request
): Promise<{ user: TokenInfo; token: string } | { error: Response }> {
  const adminUser = await verifyAdminToken(request);

  if (!adminUser) {
    return {
      error: new Response(
        JSON.stringify({ status: "error", error: "Unauthorized" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      ),
    };
  }

  return { user: adminUser, token: adminUser.rawToken };
}
