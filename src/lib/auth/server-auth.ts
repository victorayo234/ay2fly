import { createClient } from "@/lib/supabase/server";

export async function getAuthenticatedUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}

export async function verifyAdmin() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return { authorized: false as const, status: 401, error: "Authentication required. Please sign in." };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      return {
        authorized: false as const,
        status: 403,
        error: "Forbidden. Administrative privileges required.",
      };
    }

    return { authorized: true as const, user, profile };
  } catch (err: any) {
    return {
      authorized: false as const,
      status: 500,
      error: err.message || "Failed to verify administrative authorization.",
    };
  }
}
