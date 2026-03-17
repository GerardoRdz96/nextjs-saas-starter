import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, role = "member", orgId } = (await request.json()) as {
      email: string;
      role?: "admin" | "member";
      orgId?: string;
    };

    if (!email?.trim()) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find user's org (use provided orgId or get first owned org)
    let targetOrgId: string;
    if (orgId) {
      targetOrgId = orgId;
    } else {
      const { data: membership } = await supabase
        .from("org_members")
        .select("org_id")
        .eq("user_id", user.id)
        .in("role", ["owner", "admin"])
        .limit(1)
        .single();

      if (!membership) {
        return NextResponse.json(
          { error: "You must be an owner or admin to invite members" },
          { status: 403 }
        );
      }
      targetOrgId = membership.org_id;
    }

    // Verify user has permission in this org
    const { data: userRole } = await supabase
      .from("org_members")
      .select("role")
      .eq("org_id", targetOrgId)
      .eq("user_id", user.id)
      .single();

    if (!userRole || (userRole.role !== "owner" && userRole.role !== "admin")) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Check if already a member
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    if (existingProfile) {
      const { data: isMember } = await supabase
        .from("org_members")
        .select("id")
        .eq("org_id", targetOrgId)
        .eq("user_id", existingProfile.id)
        .single();

      if (isMember) {
        return NextResponse.json(
          { error: "User is already a member of this organization" },
          { status: 409 }
        );
      }
    }

    // Create invite
    const token = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7-day expiry

    const { error: inviteError } = await supabase.from("org_invites").insert({
      org_id: targetOrgId,
      email: email.toLowerCase().trim(),
      role,
      invited_by: user.id,
      token,
      expires_at: expiresAt.toISOString(),
    });

    if (inviteError) throw inviteError;

    // Log activity
    await supabase.from("activity_log").insert({
      org_id: targetOrgId,
      user_id: user.id,
      action: "member.invited",
      metadata: { email: email.toLowerCase(), role },
    });

    return NextResponse.json({ success: true, token });
  } catch (error) {
    console.error("Invite error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
