import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orgName, profileName } = (await request.json()) as {
      orgName: string;
      profileName?: string;
    };

    if (!orgName?.trim()) {
      return NextResponse.json(
        { error: "Organization name is required" },
        { status: 400 }
      );
    }

    const slug = generateSlug(orgName);

    // Check slug uniqueness
    const { data: existing } = await supabase
      .from("organizations")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "An organization with this name already exists" },
        { status: 409 }
      );
    }

    // Create the organization
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .insert({
        name: orgName.trim(),
        slug,
        owner_id: user.id,
      })
      .select()
      .single();

    if (orgError) throw orgError;

    // Add the creator as owner
    const { error: memberError } = await supabase.from("org_members").insert({
      org_id: org.id,
      user_id: user.id,
      role: "owner",
    });

    if (memberError) throw memberError;

    // Update profile if name provided (onboarding flow)
    if (profileName) {
      await supabase
        .from("profiles")
        .update({
          full_name: profileName.trim(),
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
    }

    // Log activity
    await supabase.from("activity_log").insert({
      org_id: org.id,
      user_id: user.id,
      action: "org.created",
      metadata: { org_name: org.name },
    });

    return NextResponse.json({ org });
  } catch (error) {
    console.error("Create org error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
