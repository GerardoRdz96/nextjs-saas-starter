import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SettingsForm } from "./settings-form";
import { BillingSection } from "./billing-section";

export const metadata = { title: "Settings | SaaS Starter" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <DashboardShell
      title="Settings"
      description="Manage your account and billing preferences."
    >
      <div className="space-y-6 max-w-2xl">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Update your personal information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SettingsForm
              defaultName={profile?.full_name ?? ""}
              defaultEmail={user.email ?? ""}
            />
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Billing</CardTitle>
                <CardDescription>
                  Manage your subscription and payment method.
                </CardDescription>
              </div>
              <Badge variant={profile?.subscription_status === "active" ? "success" : "default"}>
                {profile?.subscription_tier ?? "Free"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <BillingSection />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
