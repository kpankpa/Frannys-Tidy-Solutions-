# Frannys Tidy Solutions — Implementation Document

Living record of how the live site is built, hosted, and operated.  
Do not put passwords, API keys, or connection strings in this file.

---

## 1. Product

**Frannys Tidy Solutions** is a Ghanaian cleaning brand site for:

1. Shopping cleaning detergents (cart, WhatsApp checkout).
2. Booking home and office cleaning services.
3. Tracking product orders.
4. Admin management of products, orders, bookings, customers, complaints, promotions, and site content.

**Public site:** https://frannystidysolutions.com  
**GitHub:** https://github.com/kpankpa/Frannys-Tidy-Solutions-

**Business contact (shown on the site)**

| Item | Value |
|------|--------|
| Brand | Frannys Tidy Solutions |
| Address | East Legon Hills, Accra, Ghana |
| Phone / WhatsApp | 020 092 8400 (`+233 20 092 8400`) |
| Public email | frannystidysolutions@gmail.com |
| Hours | Monday to Sunday, 8:00 AM to 8:00 PM |
| Instagram | https://www.instagram.com/frannys_tidysolutions |
| TikTok | https://www.tiktok.com/@frannys.tidy.solu |

Checkout and booking confirmation stay on **WhatsApp** for v1. There is no card payment gateway yet.

---

## 2. Account map (who owns what)

Use these logins when you need to change DNS, hosting, database, or deploy.

| Service | What it is for | Account email |
|---------|----------------|---------------|
| **Namecheap** | Domain registrar. Domain `frannystidysolutions.com` was bought here. | `01242016d@st.atu.edu.gh` |
| **GoOnline (cPanel)** | Email hosting only (mailboxes, MX, SMTP). Not used to host the Next.js app. | `kaylonprince@gmail.com` |
| **Vercel** | Website hosting, SSL, deploys from GitHub. | `kaylonprince@gmail.com` |
| **Neon** | PostgreSQL database and Object Storage (admin image uploads). | `hextechnologies.gh@gmail.com` |
| **GitHub** | Source code. Repo `kpankpa/Frannys-Tidy-Solutions-`. | GitHub user `kpankpa` (linked to the project owner) |
| **Gmail (brand)** | Public customer inbox used on the site and contact form. | `frannystidysolutions@gmail.com` |

**Split of duties**

```text
Namecheap     -> owns the domain name
Vercel        -> serves the website (frannystidysolutions.com)
Neon          -> stores products, orders, bookings, settings, media files
GoOnline      -> email (hello@ / info@ style mailboxes via cPanel)
GitHub        -> code; Vercel deploys from master
```

Do not host the Next.js app on GoOnline cPanel. That host is for email.

---

## 3. Domain and DNS

**Domain:** `frannystidysolutions.com`  
**Registrar:** Namecheap  
**Registrar login:** `01242016d@st.atu.edu.gh`

### Web records (point to Vercel)

Remove old GitHub Pages A records if they are still present (`185.199.108.x`).

| Type | Host | Value |
|------|------|--------|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

Then add `frannystidysolutions.com` and `www.frannystidysolutions.com` in the Vercel project and wait for SSL.

### Mail records (keep on GoOnline)

MX, SPF, DKIM, and DMARC stay with **GoOnline cPanel** (`kaylonprince@gmail.com`).  
When changing web DNS, do not delete mail records or email will break.

---

## 4. Technology stack

| Layer | Technology | Version / notes |
|-------|------------|-----------------|
| Framework | Next.js App Router | 16.2.11 |
| Language | TypeScript | 5.x |
| UI | React | 19.2.4 |
| Styling | Tailwind CSS | 4.x |
| Animation | Framer Motion | 12.x |
| Icons | Lucide React | |
| Database | PostgreSQL | Neon (pooled connection for serverless) |
| ORM | Drizzle ORM + drizzle-kit | 0.45 / 0.31 |
| Auth | Auth.js (NextAuth v5) | Credentials provider, admin role |
| Passwords | bcryptjs | |
| File uploads | Neon Object Storage (S3-compatible) | `@aws-sdk/client-s3` |
| Email (contact form) | Nodemailer + SMTP | GoOnline SMTP when configured |
| Checkout | WhatsApp `wa.me` deep links | Order saved in DB first |
| Hosting | Vercel | `kaylonprince@gmail.com` |
| Source | GitHub | `master` branch |
| Local DB option | Docker Postgres | Port 5433 (optional; Neon is production) |

**Runtime rules**

- Database access stays on the server. `DATABASE_URL` is never sent to the browser.
- Secrets live in `.env.local` locally and in Vercel Environment Variables in production.
- `.env.local` is gitignored. Keys are documented in `.env.example`.

---

## 5. Architecture

```text
Visitor browser
  -> Vercel (Next.js)
       -> Server Actions / Route Handlers
            -> Drizzle ORM
                 -> Neon PostgreSQL
            -> Neon Object Storage (admin uploads)
            -> GoOnline SMTP (optional contact mail)
  -> WhatsApp (wa.me) for order / booking confirmation
```

### Public routes

| Path | Purpose |
|------|---------|
| `/` | Home |
| `/shop`, `/shop/[id]` | Catalogue and product detail |
| `/cart`, `/checkout` | Cart and WhatsApp checkout |
| `/services` | Cleaning services and booking form |
| `/about` | Brand story, team, values |
| `/contact` | Contact details and enquiry form |
| `/track-order` | Order status by order number |

### Admin routes (`/admin`)

Login at `/admin/login`. Admin-only after Auth.js session.

| Area | Purpose |
|------|---------|
| Dashboard | Live ops snapshot |
| Products / Categories | Catalogue, stock, images |
| Orders | Status, delivery fee, print receipt |
| Bookings | Cleaning job pipeline |
| Customers / Complaints | CRM and issues |
| Reports | Sales, products, bookings, customers |
| Media | Image library (Neon storage on Vercel) |
| Promotions | Home promo banner and framing |
| Cleaning services | Service cards and packages |
| Content | Page copy and hero / section images |
| Settings | Logo, home hero, phone, WhatsApp, hours, receipt |

### Database tables

| Table | Purpose |
|-------|---------|
| `users` | Admin accounts |
| `categories` | Product categories |
| `products` | Shop items, stock, badges |
| `product_images` | Gallery URLs per product |
| `customers` | People who ordered or booked |
| `orders` | Product orders |
| `order_items` | Line items |
| `order_events` | Tracking timeline |
| `bookings` | Cleaning service requests |
| `complaints` | Customer issues |
| `settings` | CMS and business config (key / value) |

**Order flow:** `pending` → `confirmed` → `awaiting_payment` → `packaging` → `out_for_delivery` → `delivered` (or `cancelled`).

**Booking flow:** `requested` → `confirmed` → `scheduled` → `completed` (or `cancelled`).

---

## 6. Environment variables

Set these in **Vercel → Project → Settings → Environment Variables** (Production).  
Never commit real values.

### Required

| Name | Purpose |
|------|---------|
| `DATABASE_URL` | Neon **pooled** Postgres URI (`sslmode=require`) |
| `AUTH_SECRET` | Auth.js secret, 32+ random characters (not the local dev value) |
| `AUTH_TRUST_HOST` | `true` |
| `NEXT_PUBLIC_SITE_URL` | `https://frannystidysolutions.com` |

### Strongly recommended (admin uploads on Vercel)

Vercel disk is read-only. Without object storage, admin file upload fails (paste https URLs instead).

| Name | Purpose |
|------|---------|
| `AWS_ACCESS_KEY_ID` / `STORAGE_S3_ACCESS_KEY_ID` | Neon storage key |
| `AWS_SECRET_ACCESS_KEY` / `STORAGE_S3_SECRET_ACCESS_KEY` | Neon storage secret |
| `AWS_ENDPOINT_URL_S3` / `STORAGE_S3_ENDPOINT` | Neon S3 endpoint |
| `AWS_REGION` / `STORAGE_S3_REGION` | e.g. `us-east-2` |
| `STORAGE_S3_BUCKET` | e.g. `frannys-tidy-solutions` (must be `public_read`) |
| `STORAGE_PUBLIC_BASE_URL` | Optional public base URL for uploaded files |

See `docs/NEON_SETUP.md`.

### Optional (contact form sends from the server)

Without SMTP, the contact form falls back to the visitor’s mail app.

| Name | Purpose |
|------|---------|
| `SMTP_HOST` | GoOnline cPanel SMTP host |
| `SMTP_PORT` | Usually `587` |
| `SMTP_SECURE` | `false` for 587, `true` for 465 |
| `SMTP_USER` | Mailbox user on GoOnline |
| `SMTP_PASS` | Mailbox password |
| `SMTP_FROM` | From header, e.g. Frannys Tidy Solutions &lt;hello@frannystidysolutions.com&gt; |
| `CONTACT_TO_EMAIL` | Inbox that receives enquiries (often `frannystidysolutions@gmail.com`) |

### Seed only (run locally against production Neon once)

| Name | Purpose |
|------|---------|
| `ADMIN_EMAIL` | First admin login email |
| `ADMIN_PASSWORD` | Strong password (seed refuses `changeme123` in production) |

---

## 7. Deploy checklist

1. Code is on GitHub `master` (`kpankpa/Frannys-Tidy-Solutions-`).
2. Import the repo in Vercel (`kaylonprince@gmail.com`).
3. Add the env vars above. Use a **new** `AUTH_SECRET` for production.
4. Deploy.
5. From a machine with the production `DATABASE_URL`:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
   Seed only if the production database is empty.
6. Point Namecheap DNS at Vercel. Keep GoOnline MX records.
7. Add the custom domain in Vercel and confirm HTTPS.
8. Smoke test:
   - Home, shop, services, about, contact
   - Add to cart → checkout → WhatsApp message
   - Admin login at `/admin/login`
   - Media upload (if Neon storage is set)
   - Contact form
   - `https://frannystidysolutions.com/sitemap.xml`

---

## 8. Local development

```bash
npm install
# Copy .env.example to .env.local and fill Neon + AUTH_SECRET
npm run db:migrate
npm run db:seed
npm run dev
```

- Site: http://localhost:3000  
- Admin: http://localhost:3000/admin/login  

Optional local Postgres: `npm run db:up` (Docker on port 5433). Production uses Neon instead.

---

## 9. Useful commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local Next.js |
| `npm run build` | Production build |
| `npm run db:generate` | Create a Drizzle migration |
| `npm run db:migrate` | Apply migrations |
| `npm run db:seed` | Seed admin, catalogue, settings |
| `npm run db:studio` | Drizzle Studio |

---

## 10. Security notes

- Rotate Neon database and storage keys if they were ever shared in chat or screenshots.
- Do not reuse the local `AUTH_SECRET` in production.
- Admin seed password must be strong in production.
- Keep `.env.local` off GitHub (already gitignored).
- GoOnline is email only. Do not put the Next.js app on cPanel.

---

## 11. Related docs

| File | Contents |
|------|----------|
| `docs/BUILD_PLAN.md` | Feature phases and coding rules |
| `docs/NEON_SETUP.md` | Neon Postgres and Object Storage |
| `.env.example` | Env var names (no secrets) |
