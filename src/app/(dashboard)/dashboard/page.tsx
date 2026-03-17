import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { KPICards } from "@/components/dashboard/kpi-cards";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { QuickActions } from "@/components/dashboard/quick-actions";

export const metadata = { title: "Dashboard | SaaS Starter" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const displayName =
    profile?.full_name ?? user.user_metadata?.full_name ?? "there";

  return (
    <DashboardShell
      title={`Welcome back, ${displayName}`}
      description="Here's an overview of your workspace."
    >
      <KPICards />
      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityFeed />
        <QuickActions />
      </div>
    </DashboardShell>
  );
}
