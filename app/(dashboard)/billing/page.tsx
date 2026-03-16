"use client";

import { useState } from "react";
import { CreditCard, ExternalLink, CheckCircle } from "lucide-react";

const PLANS = [
  {
    name: "Starter",
    price: "$29",
    period: "/mo",
    features: ["Up to 5 team members", "10 projects", "Basic analytics", "Email support"],
    current: false,
  },
  {
    name: "Pro",
    price: "$99",
    period: "/mo",
    features: ["Unlimited team members", "Unlimited projects", "Advanced analytics", "Priority support", "Custom domain"],
    current: true,
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: ["Everything in Pro", "SLA guarantee", "Dedicated support", "Custom integrations", "SSO/SAML"],
    current: false,
  },
];

export default function BillingPage() {
  const [loading, setLoading] = useState(false);

  async function openPortal() {
    setLoading(true);
    const res = await fetch("/api/billing/portal", { method: "POST" });
    const { url } = await res.json();
    if (url) window.location.href = url;
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Billing</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your subscription and payment details.
        </p>
      </div>

      {/* Current plan banner */}
      <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-xl p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-brand-600" />
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">Pro plan — $99/month</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Next billing date: April 16, 2026</p>
          </div>
        </div>
        <button
          onClick={openPortal}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-300 dark:border-brand-700 text-sm font-medium text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900/40 disabled:opacity-50 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          {loading ? "Opening…" : "Manage"}
        </button>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PLANS.map(({ name, price, period, features, current, highlighted }) => (
          <div
            key={name}
            className={`rounded-xl border p-5 ${
              highlighted
                ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 dark:border-brand-700"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            }`}
          >
            {highlighted && (
              <span className="inline-block text-xs font-medium text-brand-700 dark:text-brand-300 bg-brand-100 dark:bg-brand-900/50 px-2 py-0.5 rounded-full mb-3">
                Current plan
              </span>
            )}
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{name}</h3>
            <div className="mt-1 mb-4">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{price}</span>
              <span className="text-sm text-slate-500">{period}</span>
            </div>
            <ul className="space-y-2 mb-5">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            {!current && name !== "Enterprise" && (
              <button
                onClick={openPortal}
                className="w-full py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Upgrade
              </button>
            )}
            {name === "Enterprise" && (
              <a
                href="mailto:hello@yourapp.com"
                className="block text-center w-full py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Contact us
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
