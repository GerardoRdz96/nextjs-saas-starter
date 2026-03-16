# Deploying the Next.js SaaS Starter on Railway

This guide walks you through deploying the **Next.js SaaS Starter** on Railway from scratch.

---

## Prerequisites

- A [Railway](https://railway.app) account
- A [Supabase](https://supabase.com) project
- A [Stripe](https://stripe.com) account

---

## Step 1 — One-click deploy

Click the button below to deploy directly to Railway:

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/nextjs-saas-starter)

Railway will fork this repository to your account and walk you through setting up environment variables.

---

## Step 2 — Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Open the **SQL Editor** and run the contents of [`supabase/schema.sql`](../supabase/schema.sql) to create the required tables, triggers, and RLS policies.
3. In your Supabase project, go to **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` key → `SUPABASE_SERVICE_ROLE_KEY`
4. *(Optional)* To enable GitHub OAuth: go to **Authentication → Providers → GitHub**, enable it, and add your GitHub OAuth app credentials. Set the callback URL to `https://your-app.up.railway.app/auth/callback`.

---

## Step 3 — Set up Stripe

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com) → **Developers → API Keys** and copy:
   - Secret key → `STRIPE_SECRET_KEY`
   - Publishable key → `STRIPE_PUBLISHABLE_KEY`
2. Go to **Developers → Webhooks** → **Add endpoint**:
   - URL: `https://your-app.up.railway.app/api/billing/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the **Signing secret** → `STRIPE_WEBHOOK_SECRET`
3. *(Optional)* Create products and prices in Stripe for your subscription tiers.

---

## Step 4 — Configure environment variables in Railway

In your Railway project, go to **Variables** and add:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `STRIPE_SECRET_KEY` | Your Stripe secret key |
| `STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Your Stripe webhook signing secret |
| `NEXT_PUBLIC_APP_URL` | Your Railway app URL (e.g. `https://your-app.up.railway.app`) |

Railway sets `PORT` automatically — no need to configure it.

---

## Step 5 — Deploy

Railway will automatically build and deploy on every push to your main branch. The build uses [nixpacks](https://nixpacks.com/) for zero-config Node.js detection.

**Build command:** `npm install && npm run build`
**Start command:** `npm start`

---

## Step 6 — (Optional) Custom domain

1. In Railway, go to your service → **Settings → Networking → Custom Domain**.
2. Add your domain and copy the CNAME record.
3. Add the CNAME record in your DNS provider.
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain.
5. Update the Stripe webhook URL to your custom domain.
6. Update the Supabase OAuth callback URL to your custom domain.

---

## Troubleshooting

**Build fails with "Cannot find module"**
Make sure all dependencies are in `dependencies` (not just `devDependencies`) in `package.json`.

**Auth redirects to wrong URL**
Ensure `NEXT_PUBLIC_APP_URL` matches your actual Railway URL exactly (no trailing slash).

**Stripe portal returns 400**
The user needs a `stripe_customer_id` in their profile. This is set automatically when they complete their first checkout session.

**Supabase auth not working**
Check that your Supabase project's Site URL is set to your Railway URL: **Authentication → URL Configuration → Site URL**.

---

## Built with Penguin Alley

This template was built using [Penguin Alley](https://penguinalley.com) — the platform where anyone turns ideas into production-ready apps.
