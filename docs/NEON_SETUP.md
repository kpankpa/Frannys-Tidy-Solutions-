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

## 5. Image uploads (Neon Object Storage)

Local `public/uploads` works on your PC or a Namecheap VPS. On **Vercel** (and most serverless hosts) disk is read-only, so admin Media upload fails unless you use a bucket.

1. In the Neon console, open your project → **Storage** (Object Storage; currently AWS `us-east-2`).
2. Create a bucket, e.g. `frannys-media`, with access **`public_read`**.
3. Create a credential with `storage:write` (includes read).
4. Copy the S3 endpoint, access key id, and secret into `.env.local` / Vercel env:

```bash
STORAGE_S3_ENDPOINT=https://YOUR_BRANCH.storage.c-2.us-east-2.aws.neon.tech
STORAGE_S3_REGION=us-east-2
STORAGE_S3_ACCESS_KEY_ID=...
STORAGE_S3_SECRET_ACCESS_KEY=...
STORAGE_S3_BUCKET=frannys-media
STORAGE_PUBLIC_BASE_URL=https://YOUR_BRANCH.storage.c-2.us-east-2.aws.neon.tech/frannys-media
```

5. Restart the app. Admin → Media should show **Storage: Neon / S3 bucket**.

Until that is set, paste https image URLs on products instead of uploading files.

## Notes

- Neon Postgres replaces local Docker Postgres. You do not need `npm run db:up`.
- Neon Object Storage is optional but recommended for Vercel admin uploads.
- Keep a Neon backup / point-in-time recovery enabled on the Neon dashboard.
