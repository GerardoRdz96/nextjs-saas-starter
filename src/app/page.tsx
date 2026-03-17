import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Zap,
  Users,
  CreditCard,
  Building2,
  Moon,
  ArrowRight,
  Check,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Shield,
    title: "Supabase Auth",
    description:
      "Email/password and GitHub OAuth with automatic session management and middleware protection.",
  },
  {
    icon: CreditCard,
    title: "Stripe Billing",
    description:
      "Integrated billing with Customer Portal, webhooks, and subscription lifecycle management.",
  },
  {
    icon: Building2,
    title: "Multi-Tenant Orgs",
    description:
      "Organizations with invite flow, roles (owner/admin/member), and Row Level Security.",
  },
  {
    icon: Users,
    title: "Team Management",
    description:
      "Invite members by email with role assignment and pending invite tracking.",
  },
  {
    icon: Zap,
    title: "Railway Ready",
    description:
      "One-click deploy to Railway with railway.toml configuration and health checks.",
  },
  {
    icon: Moon,
    title: "Dark Mode",
    description:
      "System-aware dark mode with manual toggle. Clean slate color palette throughout.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">
              SaaS Starter
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="success" className="mb-4">
            Open Source
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 dark:text-white tracking-tight">
            Ship your SaaS
            <br />
            <span className="text-brand-600 dark:text-brand-400">
              in record time
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A production-ready Next.js 15 starter with authentication, billing,
            multi-tenant organizations, and one-click Railway deployment. Start
            building your product, not your infrastructure.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg">
                Start Building
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <a
              href="https://github.com/GerardoRdz96/nextjs-saas-starter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" size="lg">
                View on GitHub
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Everything you need to launch
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Built with modern best practices so you can focus on your product.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950 w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Built with the best tools
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { name: "Next.js 15", desc: "App Router" },
              { name: "TypeScript", desc: "Type Safe" },
              { name: "Tailwind CSS", desc: "Utility-First" },
              { name: "Supabase", desc: "Auth + DB" },
              { name: "Stripe", desc: "Billing" },
              { name: "Lucide", desc: "Icons" },
              { name: "Railway", desc: "Deployment" },
              { name: "PostgreSQL", desc: "Database" },
            ].map((tech) => (
              <div
                key={tech.name}
                className="text-center p-4 rounded-lg border border-slate-200 dark:border-slate-800"
              >
                <p className="font-semibold text-slate-900 dark:text-white">
                  {tech.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {tech.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Built with patterns from{" "}
            <a
              href="https://penguinalley.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              Penguin Alley
            </a>{" "}
            &mdash; the platform where anyone turns ideas into apps.
          </p>
          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            MIT License &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
