# Neon Postgres setup (no Docker)

Use this when Docker Desktop cannot start (for example virtualization blocked).

## 1. Create a Neon database

1. Sign up at [https://neon.tech](https://neon.tech)
2. Create a project (region close to Ghana/Europe is fine)
3. Open **Connection details**
4. Copy the **connection string** (URI)

It looks like:

```text
postgresql://USER:PASSWORD@ep-xxxx.REGION.aws.neon.tech/neondb?sslmode=require
```

Prefer the **pooled** connection string for Vercel / serverless.

## 2. Put it in `.env.local`

```bash
DATABASE_URL=postgresql://USER:PASSWORD@ep-xxxx.REGION.aws.neon.tech/neondb?sslmode=require
AUTH_SECRET=generate-with-openssl-rand-base64-32
AUTH_TRUST_HOST=true
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=strong-password
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Do not commit `.env.local`.

## 3. Migrate and seed

```bash
npm run db:migrate
npm run db:seed
npm run dev
```

Then open:

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin/login

## 4. Deploy later (Vercel)

Add the same `DATABASE_URL`, `AUTH_SECRET`, `AUTH_TRUST_HOST=true`, and `NEXT_PUBLIC_SITE_URL` in the Vercel project env settings. Run migrate/seed once against production (or from your machine with the prod URL).

## Notes

- Neon replaces local Docker Postgres. You do not need `npm run db:up`.
- Image uploads on Vercel are ephemeral; use pasted https image URLs or the media library on a VPS with disk.
- Keep a Neon backup / point-in-time recovery enabled on the Neon dashboard.
