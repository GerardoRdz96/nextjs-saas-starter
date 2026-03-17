"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

type InviteRole = "admin" | "member";

export default function InvitePage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InviteRole>("member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/org/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to send invite");
      }

      setSuccess(true);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardShell
      title="Team Members"
      description="Invite people to collaborate in your organization."
    >
      <div className="space-y-6 max-w-2xl">
        {/* Invite form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Invite a Member
            </CardTitle>
            <CardDescription>
              Send an invitation by email. They&apos;ll receive a link to join
              your organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="space-y-4">
              <Input
                id="invite-email"
                label="Email Address"
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Role
                </label>
                <div className="flex gap-2">
                  {(["member", "admin"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={cn(
                        "px-4 py-2 rounded-lg border text-sm font-medium capitalize transition-colors",
                        role === r
                          ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400 dark:border-brand-500"
                          : "border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-900"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
              {success && (
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  Invitation sent successfully!
                </p>
              )}

              <Button type="submit" loading={loading} disabled={!email.trim()}>
                <Mail className="h-4 w-4" />
                Send Invitation
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Members list placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Current Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <p className="text-sm">
                Members will appear here once you create an organization and
                invite people.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
