import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email } = await request.json() as { email: string };

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Get the org this user belongs to (as owner or admin)
  const { data: membership } = await supabase
    .from("memberships")
    .select("org_id, role")
    .eq("user_id", user.id)
    .in("role", ["owner", "admin"])
    .single();

  if (!membership) {
    return NextResponse.json({ error: "Not authorized to invite" }, { status: 403 });
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const { error } = await supabase.from("invitations").insert({
    org_id: membership.org_id,
    email,
    token,
    invited_by: user.id,
    expires_at: expiresAt,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // In production, send an email here using your preferred email provider
  // e.g. Resend, SendGrid, Postmark
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/join?token=${token}`;
  console.log(`Invite URL for ${email}: ${inviteUrl}`);

  return NextResponse.json({ success: true });
}
