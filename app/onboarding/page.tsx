"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { CheckCircle, Building2, Users, Rocket } from "lucide-react";

const STEPS = ["Organization", "Team", "Ready"] as const;
type Step = (typeof STEPS)[number];

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("Organization");
  const [orgName, setOrgName] = useState("");
  const [inviteEmails, setInviteEmails] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const stepIndex = STEPS.indexOf(step);

  async function handleOrgStep(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("organizations").insert({
      name: orgName,
      owner_id: user.id,
    }).select("id").single();

    if (!error) setStep("Team");
    setLoading(false);
  }

  async function handleFinish() {
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  i < stepIndex
                    ? "bg-brand-600 text-white"
                    : i === stepIndex
                    ? "bg-brand-600 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                }`}
              >
                {i < stepIndex ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-0.5 w-12 transition-colors ${
                    i < stepIndex ? "bg-brand-600" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          {/* Step 1: Organization */}
          {step === "Organization" && (
            <form onSubmit={handleOrgStep}>
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-brand-600" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-center text-slate-900 dark:text-white mb-1">
                Name your organization
              </h2>
              <p className="text-sm text-slate-500 text-center mb-6">
                This is how your team will identify your workspace.
              </p>
              <input
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Acme Corp"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 mb-4"
              />
              <button
                type="submit"
                disabled={loading || !orgName.trim()}
                className="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                {loading ? "Saving…" : "Continue"}
              </button>
            </form>
          )}

          {/* Step 2: Team */}
          {step === "Team" && (
            <div>
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
                  <Users className="w-6 h-6 text-brand-600" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-center text-slate-900 dark:text-white mb-1">
                Invite your team
              </h2>
              <p className="text-sm text-slate-500 text-center mb-6">
                Add teammates by email. You can always do this later.
              </p>
              <textarea
                value={inviteEmails}
                onChange={(e) => setInviteEmails(e.target.value)}
                placeholder={"colleague@company.com\nanother@company.com"}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 mb-4 resize-none"
              />
              <button
                onClick={() => setStep("Ready")}
                className="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors mb-2"
              >
                {inviteEmails.trim() ? "Send invites & continue" : "Skip for now"}
              </button>
            </div>
          )}

          {/* Step 3: Ready */}
          {step === "Ready" && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                You&apos;re all set!
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Your workspace is ready. Let&apos;s go to your dashboard.
              </p>
              <button
                onClick={handleFinish}
                className="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors"
              >
                Go to dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
