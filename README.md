# Next.js SaaS Starter

A production-ready SaaS starter built with Next.js 15, Supabase, and Stripe. Deploy to Railway in one click.

> Built with the same patterns used by [Penguin Alley](https://penguinalley.com) — the platform where anyone turns ideas into apps.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/nextjs-saas-starter)

---

## Features

- **Authentication** — Email/password + GitHub OAuth via Supabase
- **Multi-tenant** — Organizations with owner / admin / member roles
- **Dashboard** — KPI cards + activity feed (ready to connect to real data)
- **Team management** — Invite teammates by email
- **Billing** — Stripe Customer Portal for subscription management
- **Onboarding** — 3-step wizard (org setup → invite team → ready)
- **Dark mode** — Full dark mode support with Tailwind
- **Responsive** — Mobile-first, collapsible sidebar

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth + DB | Supabase |
| Payments | Stripe |
| Hosting | Railway |

## Quick start

```bash
# Clone
git clone https://github.com/GerardoRdz96/nextjs-saas-starter.git
cd nextjs-saas-starter

# Install
npm install

# Configure
cp .env.example .env.local
# Fill in your Supabase and Stripe keys

# Database
# Run supabase/schema.sql in your Supabase SQL editor

# Dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Railway

See the full deployment guide: [docs/RAILWAY.md](docs/RAILWAY.md)

## Project structure

```
app/
├── (auth)/          # Login + register pages
├── (dashboard)/     # Protected dashboard pages
│   ├── page.tsx     # Dashboard home (KPIs)
│   ├── settings/    # Org + team management
│   └── billing/     # Stripe billing portal
├── onboarding/      # 3-step onboarding wizard
├── auth/callback/   # Supabase OAuth callback
└── api/
    ├── auth/signout/
    ├── billing/portal/
    └── org/invite/
lib/
├── supabase/        # Browser + server clients
└── stripe.ts
supabase/
└── schema.sql       # Tables, triggers, RLS policies
```

## Environment variables

See [`.env.example`](.env.example) for all required variables.

## License

MIT — free to use for personal and commercial projects.

---

*Built with [Penguin Alley](https://penguinalley.com)*
