"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save, UserPlus, Trash2 } from "lucide-react";

type Member = { id: string; full_name: string | null; email: string; role: string };

export default function SettingsPage() {
  const [orgName, setOrgName] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: membership } = await supabase
        .from("memberships")
        .select("organizations(id, name), role")
        .eq("user_id", user.id)
        .single();

      if (membership?.organizations) {
        const org = membership.organizations as { id: string; name: string };
        setOrgName(org.name);

        const { data: orgMembers } = await supabase
          .from("memberships")
          .select("role, profiles(id, full_name, email:auth_email)")
          .eq("org_id", org.id);

        setMembers(
          (orgMembers ?? []).map((m) => ({
            id: (m.profiles as { id: string }).id,
            full_name: (m.profiles as { full_name: string | null }).full_name,
            email: (m.profiles as { email: string }).email,
            role: m.role,
          }))
        );
      }
    }
    load();
  }, [supabase]);

  async function handleSaveOrg(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    // Update org name via API route in a real implementation
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviting(true);
    await fetch("/api/org/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail }),
    });
    setInviteEmail("");
    setInviting(false);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your organization and team.
        </p>
      </div>

      {/* Organization */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Organization</h2>
        <form onSubmit={handleSaveOrg} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Organization name
            </label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            {saved ? "Saved!" : saving ? "Saving…" : "Save changes"}
          </button>
        </form>
      </section>

      {/* Team Members */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Team members</h2>
          <span className="text-xs text-slate-500">{members.length} member{members.length !== 1 ? "s" : ""}</span>
        </div>

        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {members.length === 0 && (
            <li className="px-5 py-8 text-center text-sm text-slate-400">No members yet.</li>
          )}
          {members.map((m) => (
            <li key={m.id} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-400">
                  {(m.full_name ?? m.email)[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {m.full_name ?? m.email}
                  </p>
                  <p className="text-xs text-slate-500">{m.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 capitalize">
                  {m.role}
                </span>
                {m.role !== "owner" && (
                  <button className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* Invite */}
        <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-800">
          <form onSubmit={handleInvite} className="flex gap-2">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              disabled={inviting || !inviteEmail}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              {inviting ? "Sending…" : "Invite"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
