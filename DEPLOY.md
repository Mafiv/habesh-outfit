# Production Deployment Guide

## Architecture

| Service | Platform | Notes |
|---------|----------|-------|
| **Frontend** | Vercel / Render static | Vite build → `dist/` |
| **Django API** | Railway / Render Docker | `backend/Dockerfile` |
| **Auth service** | Railway / Render Docker | `auth-service/Dockerfile` |
| **MongoDB** | MongoDB Atlas | Shared connection string |

## 1. MongoDB Atlas

1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Copy connection string: `mongodb+srv://user:pass@cluster.mongodb.net/stylish`
3. Set `MONGODB_URI` on API and auth services

## 2. Frontend (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from repo root
vercel --prod
```

Set environment variables in Vercel dashboard:

```
VITE_API_URL=https://your-api.railway.app/api
VITE_AUTH_URL=https://your-auth.railway.app
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

`vercel.json` handles SPA routing automatically.

## 3. Django API (Railway)

1. Connect GitHub repo to Railway
2. Set root directory / use `railway.toml` with Docker builder
3. Environment variables:

```
MONGODB_URI=mongodb+srv://...
BETTER_AUTH_SECRET=<32+ char secret>
BETTER_AUTH_URL=https://your-auth.railway.app
FRONTEND_URL=https://your-app.vercel.app
DJANGO_SECRET_KEY=<random>
DEBUG=False
ALLOWED_HOSTS=your-api.railway.app,localhost
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
ADMIN_API_KEY=<secure-random-key>
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.sendgrid.net
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=SG.xxx
DEFAULT_FROM_EMAIL=orders@yourdomain.com
```

## 4. Auth Service (Railway)

```
MONGODB_URI=mongodb+srv://...
BETTER_AUTH_SECRET=<same as API>
BETTER_AUTH_URL=https://your-auth.railway.app
FRONTEND_URL=https://your-app.vercel.app
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

## 5. Stripe Webhooks (Production)

1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://your-api.railway.app/api/payments/webhook/`
3. Events: `checkout.session.completed`, `checkout.session.expired`
4. Copy signing secret → `STRIPE_WEBHOOK_SECRET`

Local testing:

```bash
stripe listen --forward-to localhost:8000/api/payments/webhook/
```

## 6. Admin Dashboard

Visit `https://your-app.vercel.app/admin` and enter `ADMIN_API_KEY`.

## 7. Seed Products

```bash
cd backend && MONGODB_URI=... python3 manage.py seed_products
```

## Health Checks

- API: `GET /api/health/`
- Auth: `GET /health`
