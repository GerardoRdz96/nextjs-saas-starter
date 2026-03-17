"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateSlug } from "@/lib/utils";

export default function NewOrgPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/org/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgName: name }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to create organization");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardShell
      title="Create Organization"
      description="Set up a new workspace for your team."
    >
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
          <CardDescription>
            Choose a name for your organization. You can change this later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              id="org-name"
              label="Organization Name"
              placeholder="Acme Inc."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {name && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                URL slug:{" "}
                <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs">
                  {generateSlug(name)}
                </code>
              </p>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" loading={loading} disabled={!name.trim()}>
              Create Organization
            </Button>
          </form>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
