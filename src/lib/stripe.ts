import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export const PLANS = {
  free: {
    name: "Free",
    description: "For individuals getting started",
    price: { monthly: 0, annual: 0 },
    features: [
      "1 organization",
      "Up to 3 members",
      "Basic analytics",
      "Community support",
    ],
  },
  pro: {
    name: "Pro",
    description: "For growing teams",
    price: { monthly: 29, annual: 290 },
    stripePriceId: {
      monthly: process.env.STRIPE_PRICE_PRO_MONTHLY ?? "",
      annual: process.env.STRIPE_PRICE_PRO_ANNUAL ?? "",
    },
    features: [
      "Unlimited organizations",
      "Up to 25 members",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
    ],
  },
  enterprise: {
    name: "Enterprise",
    description: "For large organizations",
    price: { monthly: 99, annual: 990 },
    stripePriceId: {
      monthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY ?? "",
      annual: process.env.STRIPE_PRICE_ENTERPRISE_ANNUAL ?? "",
    },
    features: [
      "Unlimited everything",
      "SSO & SAML",
      "Audit logs",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;
