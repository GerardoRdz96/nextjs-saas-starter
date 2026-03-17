"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, ArrowRight, Building2, User, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const steps = [
  { id: 1, name: "Profile", icon: User },
  { id: 2, name: "Organization", icon: Building2 },
  { id: 3, name: "Get Started", icon: Rocket },
];

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({ fullName: "", role: "" });
  const [orgData, setOrgData] = useState({ name: "", size: "" });
  const router = useRouter();

  async function handleComplete() {
    setLoading(true);
    try {
      // Mark onboarding as complete
      const res = await fetch("/api/org/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileName: profileData.fullName,
          orgName: orgData.name,
          orgSize: orgData.size,
        }),
      });
      if (!res.ok) throw new Error("Failed to complete onboarding");
      router.push("/dashboard");
      router.refresh();
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-lg">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  "flex items-center justify-center h-10 w-10 rounded-full border-2 transition-colors",
                  currentStep > step.id
                    ? "bg-brand-600 border-brand-600 text-white"
                    : currentStep === step.id
                    ? "border-brand-600 text-brand-600 dark:text-brand-400"
                    : "border-slate-300 text-slate-400 dark:border-slate-700"
                )}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-12 h-0.5 mx-2",
                    currentStep > step.id
                      ? "bg-brand-600"
                      : "bg-slate-300 dark:bg-slate-700"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <Card>
          {/* Step 1: Profile */}
          {currentStep === 1 && (
            <>
              <CardHeader>
                <CardTitle>Tell us about yourself</CardTitle>
                <CardDescription>
                  This helps us personalize your experience.
                </CardDescription>
              </CardHeader>
              <div className="space-y-4">
                <Input
                  id="onboard-name"
                  label="Full Name"
                  placeholder="Jane Doe"
                  value={profileData.fullName}
                  onChange={(e) =>
                    setProfileData({ ...profileData, fullName: e.target.value })
                  }
                />
                <Input
                  id="onboard-role"
                  label="Your Role"
                  placeholder="e.g., CTO, Product Manager, Developer"
                  value={profileData.role}
                  onChange={(e) =>
                    setProfileData({ ...profileData, role: e.target.value })
                  }
                />
                <Button
                  className="w-full"
                  onClick={() => setCurrentStep(2)}
                  disabled={!profileData.fullName}
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {/* Step 2: Organization */}
          {currentStep === 2 && (
            <>
              <CardHeader>
                <CardTitle>Set up your organization</CardTitle>
                <CardDescription>
                  Create a workspace for your team.
                </CardDescription>
              </CardHeader>
              <div className="space-y-4">
                <Input
                  id="onboard-org"
                  label="Organization Name"
                  placeholder="Acme Inc."
                  value={orgData.name}
                  onChange={(e) =>
                    setOrgData({ ...orgData, name: e.target.value })
                  }
                />
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Team Size
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["1-5", "6-25", "26+"].map((size) => (
                      <button
                        key={size}
                        onClick={() => setOrgData({ ...orgData, size })}
                        className={cn(
                          "px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                          orgData.size === size
                            ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400 dark:border-brand-500"
                            : "border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-900"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => setCurrentStep(3)}
                    disabled={!orgData.name}
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Step 3: Get Started */}
          {currentStep === 3 && (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                  <Rocket className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle>You&apos;re all set!</CardTitle>
                <CardDescription>
                  Your workspace <strong>{orgData.name}</strong> is ready.
                  Start by inviting your team or exploring the dashboard.
                </CardDescription>
              </CardHeader>
              <div className="space-y-3">
                <Button
                  className="w-full"
                  onClick={handleComplete}
                  loading={loading}
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setCurrentStep(2)}
                  className="w-full"
                >
                  Back
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
