"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PLANS, type PlanKey } from "@/lib/stripe";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function BillingSection() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleCheckout(plan: PlanKey, interval: "monthly" | "annual") {
    if (plan === "free") return;
    setLoading(`${plan}-${interval}`);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, interval }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      // Handle error
    } finally {
      setLoading(null);
    }
  }

  async function handlePortal() {
    setLoading("portal");
    try {
      const res = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      // Handle error
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Manage existing subscription */}
      <div>
        <Button
          variant="secondary"
          onClick={handlePortal}
          loading={loading === "portal"}
        >
          Manage Subscription
        </Button>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Update payment method, view invoices, or cancel your subscription via
          the Stripe Customer Portal.
        </p>
      </div>

      {/* Plan cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {(Object.entries(PLANS) as [PlanKey, (typeof PLANS)[PlanKey]][]).map(
          ([key, plan]) => (
            <Card
              key={key}
              className={cn(
                "p-4",
                key === "pro" && "ring-2 ring-brand-600 dark:ring-brand-400"
              )}
            >
              <h4 className="font-semibold text-slate-900 dark:text-white">
                {plan.name}
              </h4>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                ${plan.price.monthly}
                <span className="text-sm font-normal text-slate-500">/mo</span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {plan.description}
              </p>
              <ul className="mt-4 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              {key !== "free" && (
                <Button
                  className="w-full mt-4"
                  size="sm"
                  variant={key === "pro" ? "primary" : "secondary"}
                  loading={loading === `${key}-monthly`}
                  onClick={() => handleCheckout(key, "monthly")}
                >
                  Upgrade to {plan.name}
                </Button>
              )}
            </Card>
          )
        )}
      </div>
    </div>
  );
}
