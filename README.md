# Next.js SaaS Starter

A production-ready SaaS starter template built with Next.js 15, Supabase, Stripe, and Tailwind CSS. Deploy to Railway in one click.

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/hopeful-wonder)

## Features

- **Authentication** — Email/password and GitHub OAuth via Supabase Auth (`@supabase/ssr`)
- **Billing** — Stripe Checkout + Customer Portal for subscription management
- **Multi-Tenant Organizations** — Create orgs, invite members, assign roles (owner/admin/member)
- **Dashboard** — KPI cards, activity feed, and quick actions
- **Onboarding** — 3-step wizard for new user setup
- **Dark Mode** — System-aware with manual toggle
- **Mobile Responsive** — Collapsible sidebar layout
- **Row Level Security** — Complete RLS policies for all tables
- **Type Safe** — Full TypeScript with strict mode
- **Railway Ready** — `railway.toml` with health checks and deploy configuration

## Tech Stack

| Tool | Purpose |
|---|---|
| [Next.js 15](https://nextjs.org) | React framework (App Router) |
| [TypeScript](https://typescriptlang.org) | Type safety |
| [Tailwind CSS](https://tailwindcss.com) | Styling |
| [Supabase](https://supabase.com) | Auth + PostgreSQL database |
| [Stripe](https://stripe.com) | Billing and subscriptions |
| [Lucide React](https://lucide.dev) | Icons |
| [Railway](https://railway.com) | Deployment |

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/GerardoRdz96/nextjs-saas-starter.git
cd nextjs-saas-starter
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in all the values in `.env.local`. See [docs/RAILWAY.md](docs/RAILWAY.md) for detailed setup instructions.

### 3. Set up the database

Run the SQL schema in your Supabase project's SQL Editor:

```bash
# Copy the contents of supabase/schema.sql to the Supabase SQL Editor
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/          # Protected dashboard routes
│   │   ├── dashboard/        # Main dashboard with KPIs
│   │   ├── settings/         # Profile & billing settings
│   │   └── org/              # Organization management
│   │       ├── new/          # Create organization
│   │       └── invite/       # Invite members
│   ├── auth/                 # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   ├── callback/         # OAuth callback handler
│   │   └── confirm/          # Email verification
│   ├── onboarding/           # 3-step onboarding wizard
│   └── api/
│       ├── health/           # Health check endpoint
│       ├── stripe/           # Stripe checkout, portal, webhook
│       └── org/              # Org CRUD and invite APIs
├── components/
│   ├── ui/                   # Reusable UI primitives
│   ├── auth/                 # Auth form component
│   ├── dashboard/            # Dashboard-specific components
│   ├── layout/               # Sidebar and shell
│   └── onboarding/           # Onboarding wizard
└── lib/
    ├── supabase/             # Supabase client (server, client, middleware)
    ├── types/                # Database types
    ├── stripe.ts             # Stripe config and plans
    ├── theme.tsx             # Dark mode provider
    └── utils.ts              # Utility functions
```

## Database Schema

See [`supabase/schema.sql`](supabase/schema.sql) for the complete schema including:

- **profiles** — User profiles (auto-created on signup)
- **organizations** — Multi-tenant workspaces
- **org_members** — Organization membership with roles
- **org_invites** — Pending invitations with token-based acceptance
- **activity_log** — Audit trail for org actions

All tables have Row Level Security (RLS) policies.

## Deployment

See [docs/RAILWAY.md](docs/RAILWAY.md) for complete deployment instructions.

## License

MIT

---

Built with patterns from [Penguin Alley](https://penguinalley.com) — the platform where anyone turns ideas into apps.
