# Habesh Outfit — Full-Stack E-Commerce

Mobile-first e-commerce app with **React** frontend, **Django** API, **Better Auth** authentication, **MongoDB** database, and **Stripe** payments.

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  React (Vite)   │────▶│  Better Auth     │────▶│    MongoDB      │
│  :5173          │     │  (Node) :3001    │     │    :27017       │
└────────┬────────┘     └──────────────────┘     └────────▲────────┘
         │                                                 │
         │  JWT Bearer token                               │
         ▼                                                 │
┌─────────────────┐────────────────────────────────────────┘
│  Django REST    │
│  API :8000      │────▶ Stripe Checkout
└─────────────────┘
```

| Service | Tech | Port | Purpose |
|---------|------|------|---------|
| **Frontend** | React + Vite + Tailwind | 5173 | Mobile UI |
| **Auth** | Better Auth + Express + MongoDB | 3001 | Login, signup, JWT tokens |
| **API** | Django + DRF + mongoengine | 8000 | Products, orders, addresses, reviews |
| **Database** | MongoDB | 27017 | Shared by auth + API |
| **Payments** | Stripe | — | Checkout sessions + webhooks |

> **Note:** [Better Auth](https://www.better-auth.com) is TypeScript-only. It runs as a separate Node service. Django verifies JWT tokens issued by Better Auth using the shared `BETTER_AUTH_SECRET`.

## Prerequisites

- Node.js 20+
- Python 3.12+
- MongoDB 7+ (via Docker or local install)
- Stripe test keys (optional, for payments)

## Quick Start

### 1. Start MongoDB (or full stack)

```bash
# MongoDB only
docker compose up -d mongodb

# Full stack (MongoDB + Auth + Django API)
docker compose up -d
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your Stripe keys if needed
cp auth-service/.env.example auth-service/.env
```

### 3. Install dependencies

```bash
# Frontend
npm install

# Auth service
cd auth-service && npm install && cd ..

# Django API
pip install -r backend/requirements.txt
```

### 4. Seed product catalog

```bash
cd backend && python3 manage.py seed_products
```

### 5. Run all services

```bash
# Terminal 1 — Auth (Better Auth)
cd auth-service && npm run dev

# Terminal 2 — Django API
cd backend && python3 manage.py runserver 8000

# Terminal 3 — Frontend
npm run dev
```

Open http://localhost:5173 (mobile viewport ~390px).

## API Endpoints

### Public
- `GET /api/health/` — Health check (includes MongoDB ping)
- `GET /api/catalog/products/` — List products
- `GET /api/catalog/products/:id/` — Product detail

### Authenticated (Bearer JWT from Better Auth)
- `GET/PUT/POST/DELETE /api/cart/` — Server-side cart sync
- `GET/POST /api/orders/` — Orders
- `GET/POST /api/addresses/` — Shipping addresses
- `GET/POST /api/payment-methods/` — Payment methods
- `GET/POST /api/reviews/` — Reviews
- `GET/POST /api/favorites/` — Favorites
- `GET /api/payments/promocodes/` — Promocodes
- `POST /api/payments/validate-promocode/` — Validate a promo code (public)
- `POST /api/payments/create-checkout-session/` — Stripe checkout (creates pending order)

### Public catalog extras
- `GET /api/catalog/products/?q=search&page=1&pageSize=20` — Search + pagination
- `GET /api/catalog/products/:id/reviews/` — Product reviews

### Admin
- `GET /api/admin/orders/` — List all orders
- `PATCH /api/admin/orders/:id/` — Update order status (header: `X-Admin-Key`)
- `GET /api/admin/products/` — List products with stock
- `PATCH /api/admin/products/:id/` — Update stock/price

### Stripe payment methods
- `GET /api/payments/config/` — Stripe publishable key + enabled flag
- `POST /api/payments/setup-intent/` — Create SetupIntent for saving cards
- `POST /api/payments/sync-payment-methods/` — Sync Stripe cards to profile

### Admin UI

Visit `/admin` in the app and enter your `ADMIN_API_KEY`.

## Production Deploy

See [DEPLOY.md](./DEPLOY.md) for Vercel + Railway/Render setup, Stripe webhooks, and MongoDB Atlas.

## E2E Tests

```bash
npm run test:e2e
```

## CI/CD

[![CI](https://github.com/Mafiv/habesh-outfit/actions/workflows/ci.yml/badge.svg)](https://github.com/Mafiv/habesh-outfit/actions/workflows/ci.yml)
[![CD](https://github.com/Mafiv/habesh-outfit/actions/workflows/cd.yml/badge.svg)](https://github.com/Mafiv/habesh-outfit/actions/workflows/cd.yml)

### CI (every PR & push)

| Job | What it does |
|-----|--------------|
| **frontend** | `npm ci` → lint → build → upload artifact |
| **auth-service** | `npm ci` → syntax check |
| **backend** | Django check + unit tests |
| **docker** | Build API & auth Docker images |
| **e2e** | Playwright tests (Chromium) |

### CD (push to `main`)

| Job | What it does |
|-----|--------------|
| **publish-docker** | Push `api` + `auth` images to `ghcr.io` |
| **deploy-frontend** | Deploy to Vercel (when enabled) |
| **smoke-test** | Health-check deployed URLs |

### Enable Vercel deploy

1. Add GitHub **repository secrets**:
   - `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
   - `VITE_API_URL`, `VITE_AUTH_URL`, `VITE_STRIPE_PUBLISHABLE_KEY`
2. Add GitHub **repository variable**: `ENABLE_VERCEL_DEPLOY` = `true`
3. Optional smoke-test secrets: `API_HEALTH_URL`, `FRONTEND_URL`

### Pull Docker images

```bash
docker pull ghcr.io/mafiv/habesh-outfit/api:latest
docker pull ghcr.io/mafiv/habesh-outfit/auth:latest
```

See [DEPLOY.md](./DEPLOY.md) for full production setup.

### Auth (Better Auth service)
- `POST /api/auth/sign-up/email` — Register
- `POST /api/auth/sign-in/email` — Login
- `GET /api/auth/token` — Get JWT for Django API

## Stripe Setup

1. Get test keys from https://dashboard.stripe.com/test/apikeys
2. Set in `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
3. For webhooks (production): `stripe listen --forward-to localhost:8000/api/payments/webhook/`

## Promocodes

- `SAVE10` — 10% off
- `STYLE20` — 20% off
- `WELCOME15` — 15% off

## Frontend-only fallback

If the Django API is unavailable, the app falls back to local mock product data. Auth and user data require the backend services running.
