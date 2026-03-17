import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get("orgId");

    if (!orgId) {
      return NextResponse.json(
        { error: "orgId is required" },
        { status: 400 }
      );
    }

    // Verify user is member of this org
    const { data: membership } = await supabase
      .from("org_members")
      .select("role")
      .eq("org_id", orgId)
      .eq("user_id", user.id)
      .single();

    if (!membership) {
      return NextResponse.json({ error: "Not a member" }, { status: 403 });
    }

    // Fetch members with profiles
    const { data: members, error } = await supabase
      .from("org_members")
      .select(
        `
        id,
        role,
        joined_at,
        user_id,
        profiles:user_id (
          full_name,
          email,
          avatar_url
        )
      `
      )
      .eq("org_id", orgId)
      .order("joined_at", { ascending: true });

    if (error) throw error;

    // Fetch pending invites (only for owners/admins)
    let invites = null;
    if (membership.role === "owner" || membership.role === "admin") {
      const { data } = await supabase
        .from("org_invites")
        .select("id, email, role, created_at, expires_at, accepted_at")
        .eq("org_id", orgId)
        .is("accepted_at", null)
        .order("created_at", { ascending: false });

      invites = data;
    }

    return NextResponse.json({ members, invites });
  } catch (error) {
    console.error("Members error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
