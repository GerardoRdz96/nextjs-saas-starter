# Deploying to Railway

This guide walks you through deploying the Next.js SaaS Starter to [Railway](https://railway.com).

## Prerequisites

1. A [Railway](https://railway.com) account
2. A [Supabase](https://supabase.com) project with the schema applied
3. A [Stripe](https://stripe.com) account with products and prices configured

## One-Click Deploy

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/hopeful-wonder)

## Manual Deploy

### 1. Create a Railway Project

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init
```

### 2. Set Environment Variables

In the Railway dashboard, navigate to your service and add the following environment variables:

```
NEXT_PUBLIC_APP_URL=https://your-app.up.railway.app
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_ANNUAL=price_...
STRIPE_PRICE_ENTERPRISE_MONTHLY=price_...
STRIPE_PRICE_ENTERPRISE_ANNUAL=price_...
```

### 3. Set Up Supabase

1. Go to your Supabase project's **SQL Editor**
2. Paste the contents of `supabase/schema.sql`
3. Run the query

#### Configure Auth Providers

**Email/Password:**
- Already enabled by default in Supabase

**GitHub OAuth:**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set the callback URL to: `https://your-project.supabase.co/auth/v1/callback`
4. Copy the Client ID and Client Secret
5. In Supabase Dashboard → Authentication → Providers → GitHub, enable and paste the credentials

### 4. Set Up Stripe

1. Create products and prices in the [Stripe Dashboard](https://dashboard.stripe.com)
2. Set up a webhook endpoint pointing to `https://your-app.up.railway.app/api/stripe/webhook`
3. Subscribe to these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

#### Configure Customer Portal

1. Go to [Stripe Customer Portal Settings](https://dashboard.stripe.com/settings/billing/portal)
2. Enable the features you want (update payment method, cancel subscription, etc.)
3. Save the configuration

### 5. Deploy

```bash
# Deploy to Railway
railway up
```

Or push to your connected GitHub repository — Railway will auto-deploy.

### 6. Configure Domain (Optional)

1. In Railway dashboard, go to your service → Settings → Domains
2. Add a custom domain or use the generated `*.up.railway.app` domain
3. Update `NEXT_PUBLIC_APP_URL` to match your domain

## Health Check

The app exposes a health check endpoint at `/api/health` that Railway uses to verify the deployment is running correctly.

```bash
curl https://your-app.up.railway.app/api/health
# {"status":"healthy","timestamp":"2025-01-01T00:00:00.000Z"}
```

## Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│                     Railway                          │
│  ┌──────────────────────────────────────────────┐    │
│  │  Next.js 15 (App Router)                     │    │
│  │  ├── Pages (SSR + Client Components)         │    │
│  │  ├── API Routes (Stripe, Org management)     │    │
│  │  └── Middleware (Auth session refresh)        │    │
│  └──────────────┬───────────────┬───────────────┘    │
│                 │               │                    │
└─────────────────┼───────────────┼────────────────────┘
                  │               │
        ┌─────────▼──────┐  ┌────▼────────┐
        │   Supabase     │  │   Stripe    │
        │  ├── Auth      │  │  ├── Billing│
        │  ├── Database  │  │  ├── Portal │
        │  └── RLS       │  │  └── Hooks  │
        └────────────────┘  └─────────────┘
```

## Troubleshooting

### Build fails with "out of memory"

Add this environment variable in Railway:

```
NODE_OPTIONS=--max-old-space-size=4096
```

### Supabase connection issues

Make sure your Supabase project's API settings allow connections from Railway's IP ranges, or keep the default "Allow all" setting.

### Stripe webhooks not working

1. Verify the webhook URL is correct and accessible
2. Check that `STRIPE_WEBHOOK_SECRET` matches the signing secret shown in Stripe Dashboard
3. Ensure the webhook is subscribed to the correct events
