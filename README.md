# Frannys Tidy Solutions

Premium cleaning products and professional cleaning services website for a Ghanaian brand based in East Legon Hills, Accra.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- PostgreSQL + Drizzle ORM
- Auth.js (admin)
- WhatsApp checkout and booking confirmation
- Contact form email (SMTP, with mailto fallback)

## Docs

**Build plan:** [docs/BUILD_PLAN.md](docs/BUILD_PLAN.md)

## Local development

```bash
npm install
cp .env.example .env.local
npm run db:up
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin (not linked on the public site): [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Default seeded admin (change before production seed):

- Email: `admin@frannys.com`
- Password: `changeme123`

Postgres runs in Docker on **localhost:5433** (`docker-compose.yml`).

### Database scripts

| Script | Purpose |
|--------|---------|
| `npm run db:up` | Start Postgres container |
| `npm run db:generate` | Create SQL migrations from schema |
| `npm run db:migrate` | Apply migrations |
| `npm run db:seed` | Seed admin, categories, products, settings |
| `npm run db:studio` | Open Drizzle Studio |

## Security notes

- Admin mutations require an authenticated admin session (role-checked).
- Public write actions (checkout, booking, track order, login) are rate-limited per IP (and phone/email where relevant).
- Uploads require admin auth, verify image magic bytes, and cap at 5 MB.
- Product image URLs must be `/uploads/...` or `images.unsplash.com`.
- Social links must be `https:` URLs.
- Order numbers are random (`FTS-` + hex), not sequential.
- Track-order responses omit address/notes and mask phone numbers.
- Set a strong `ADMIN_PASSWORD` and `AUTH_SECRET` before production seed/deploy.

## Environment checklist

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | Postgres connection string |
| `AUTH_SECRET` | Yes | Session encryption (`openssl rand -base64 32`) |
| `AUTH_TRUST_HOST` | Yes in prod | Set `true` behind hosts/proxies |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed only | First admin user |
| `NEXT_PUBLIC_SITE_URL` | Yes in prod | Absolute URL for SEO / sitemap / OG |
| `AUTH_URL` | Optional | Override Auth.js base URL |
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` | Optional | Server-sent contact emails |
| `SMTP_PORT` / `SMTP_SECURE` / `SMTP_FROM` | Optional | SMTP details (default port 587) |
| `CONTACT_TO_EMAIL` | Optional | Inbox for contact form (defaults to business email) |

Never commit `.env.local` or real passwords.

## Image uploads

Admin product forms can upload images to `public/uploads/` (JPEG/PNG/WebP/GIF, max 5 MB).

- Works on local, Docker, and VPS hosts with a writable disk.
- On serverless hosts (typical Vercel), the filesystem is ephemeral. Prefer pasting image URLs (Unsplash, Cloudinary, etc.) or attach a persistent volume.

Uploaded files are gitignored; keep backups of `public/uploads` if you rely on local files.

## Deploy guide

### 1. Database (Neon / Supabase / Railway)

1. Create a Postgres database.
2. Copy the connection string into `DATABASE_URL` (use the pooled URL if the host recommends it for serverless).
3. From your machine (or CI):

```bash
npm run db:migrate
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='strong-password' npm run db:seed
```

### 2. App (Vercel)

1. Import the GitHub repo into Vercel.
2. Set env vars: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_TRUST_HOST=true`, `NEXT_PUBLIC_SITE_URL=https://your-domain.com`.
3. Deploy. Confirm `/admin/login`, place a test order, and check Neon for the new row.

### 3. App alternative (Node / Docker / Railway)

Run `npm run build` then `npm run start` with the same env vars. Mount a volume at `public/uploads` if you want uploaded images to persist.

## Backups

- **Database:** Use your host’s automated backups (Neon / Supabase / Railway). Take a manual dump before schema changes:

```bash
pg_dump "$DATABASE_URL" > frannys-backup-$(date +%Y%m%d).sql
```

- **Uploads:** Copy `public/uploads` regularly if you store images on disk.
- **Settings / content:** Stored in the `settings` table; included in DB backups.

## Routes

| Path | Description |
|------|-------------|
| `/` | Home |
| `/shop` | Product catalogue |
| `/shop/[slug]` | Product detail |
| `/cart` / `/checkout` | Cart and WhatsApp checkout |
| `/services` | Cleaning services + booking |
| `/about` / `/contact` | Company + contact |
| `/track-order` | Order tracking |
| `/admin` | Business hub (auth required) |

## Project conventions

- Prefer small, clear modules over clever abstractions.
- Keep business logic in `lib/` / `server/`, not deep inside JSX.
- Do not commit secrets.
- Update `docs/BUILD_PLAN.md` when you finish a phase.
