# Frannys Tidy Solutions — End-to-End Build Plan

> **Living document.** Read this before starting any feature work.
> Update the **Phase Status** table when a phase is finished.
> Keep code **simple, human-readable, and good**. Prefer clarity over cleverness.

---

## Product goal

Build a premium Ghanaian cleaning brand website that is end to end:

1. Customers browse products, add to cart, checkout via WhatsApp.
2. Customers book professional cleaning services.
3. Customers track orders.
4. Admin manages products, orders, customers, complaints, and settings.
5. All real data lives in **PostgreSQL** via **Drizzle ORM**.

WhatsApp remains the checkout / booking confirmation channel for v1 (no online card payments yet unless added in a later phase).

---

## Current baseline (already built)

| Area | Status | Notes |
|------|--------|--------|
| Next.js App Router + TypeScript + Tailwind | Done | Next 16 |
| Marketing + shop UI | Done | Products from Postgres (Phase 3) |
| Cart (localStorage) | Done | `lib/cart.tsx` (resolves via `/api/products`) |
| WhatsApp deep links | Done | Driven by admin Settings via `getSiteConfig` |
| Admin business hub | Done | Live ops, CMS settings/content, reports |
| Auth | Done | Admin credentials login |
| PostgreSQL + Drizzle | Done | Docker on port 5433, migrated + seeded |
| Real orders / bookings | Done | Checkout, bookings, and track-order use Postgres |

---

## Phase status

| Phase | Name | Status |
|-------|------|--------|
| 0 | Stabilize UI foundation | Done |
| 1 | Database + Drizzle foundation | Done |
| 2 | Auth (admin first) | Done |
| 3 | Products from database | Done |
| 4 | Orders + WhatsApp checkout persistence | Done |
| 5 | Service bookings | Done |
| 6 | Track order (real data) | Done |
| 7 | Admin dashboard (live data) | Done |
| 8 | Customers, complaints, reports | Done |
| 9 | Media, polish, deploy | Done |

Update status to: `Not started` | `In progress` | `Done`.

---

## Non-negotiable coding rules

These rules apply to every phase and every agent:

1. **Simple over clever.** A junior developer should understand the file in one pass.
2. **Small files.** One clear job per module. Avoid 500-line “god” files.
3. **Names that explain.** Prefer `getProductById` over `gp`, `createOrder` over `handleStuff`.
4. **No magic.** Put business rules in named functions or constants.
5. **Typed end to end.** Use TypeScript types from Drizzle schema. Avoid `any`.
6. **Server owns secrets.** DB access and auth checks live in server code / route handlers / server actions. Never expose `DATABASE_URL` to the client.
7. **Thin UI, thick data layer.** Pages call small functions in `lib/` or `server/`. Keep JSX for rendering.
8. **Match existing brand.** Colors, spacing, and layout already exist. Extend them; do not redesign unless asked.
9. **No long dashes in copy.** Use normal punctuation (commas, periods, colons, “to”).
10. **Update this document** when you finish a phase or change architecture.

### Preferred folder shape (target)

```text
app/                    # routes only (pages, layouts, route handlers)
components/             # UI components
lib/
  db/                   # drizzle client + schema + queries
  auth/                 # auth helpers
  constants.ts          # site contact, brand helpers
  money.ts              # price formatting (optional split)
server/                 # server actions (optional, keep thin)
drizzle/                # migrations
docs/                   # plans and notes (this file)
public/                 # static assets
```

### Code style examples

Good:

```ts
export async function getProductById(id: string) {
  return db.query.products.findFirst({
    where: eq(products.id, id),
  });
}
```

Avoid:

```ts
export const x = async (a: any) => await db.execute(`select * from products where id='${a}'`);
```

---

## Architecture overview

```text
Browser
  -> Next.js App Router (UI)
  -> Server Actions / Route Handlers
  -> Drizzle ORM
  -> PostgreSQL

WhatsApp
  <- wa.me links with prefilled order/booking text
  (human confirms; order already saved in DB as pending)
```

### Core entities

| Table | Purpose |
|-------|---------|
| `users` | Admin (and later customer accounts if needed) |
| `products` | Shop catalogue |
| `product_images` | Multiple images per product |
| `categories` | Product categories |
| `customers` | People who ordered or booked (by phone/email) |
| `orders` | Product orders |
| `order_items` | Line items |
| `bookings` | Cleaning service requests |
| `order_events` | Status timeline for tracking |
| `complaints` | Customer issues |
| `settings` | Delivery fee, hours, WhatsApp number, etc. |

### Order status flow

```text
pending -> confirmed -> awaiting_payment -> packaging -> out_for_delivery -> delivered
```

(Also allow `cancelled`.)

### Booking status flow

```text
requested -> confirmed -> scheduled -> completed
```

(Also allow `cancelled`.)

---

## Phase 0 — Stabilize UI foundation (Done)

**Goal:** Keep the current multi-page UI as the shell.

**Do not redo** unless a later phase requires small UI hooks (loading/empty states).

Key routes already present:

- `/`, `/shop`, `/shop/[id]`, `/cart`, `/checkout`
- `/services`, `/about`, `/contact`, `/track-order`
- `/admin/*` (demo only)

---

## Phase 1 — Database + Drizzle foundation

**Goal:** Postgres + Drizzle ready, schema migrated, seed data for 8 products.

### Tasks

1. Add dependencies: `drizzle-orm`, `drizzle-kit`, `postgres` (or `@neondatabase/serverless` if using Neon), `dotenv`.
2. Create `.env.local` with:
   - `DATABASE_URL=`
3. Add `.env.example` (no secrets).
4. Create:
   - `lib/db/schema.ts` — all tables
   - `lib/db/index.ts` — drizzle client
   - `drizzle.config.ts`
5. Generate and run first migration.
6. Create `lib/db/seed.ts` to insert categories + current 8 products.
7. Add npm scripts:
   - `db:generate`
   - `db:migrate`
   - `db:seed`
   - `db:studio` (optional)

### Acceptance

- [x] App still runs with UI mock data if needed.
- [x] `npm run db:migrate` works against a real Postgres.
- [x] Seed creates products visible via a quick server query / Drizzle Studio.
- [x] Schema is documented in this file (entity list above).

### Phase 1 notes (completed)

- Local Postgres via Docker Compose on **host port 5433** (5432 was already in use).
- Money stored as **integer pesewas**.
- Seed creates admin user, 4 categories, 8 products + images, and default settings.
- Commands: `npm run db:up`, `db:generate`, `db:migrate`, `db:seed`, `db:studio`.

### Notes for agents

- Keep schema readable: one table block at a time, comments only where helpful.
- Use UUID or text ids consistently. Prefer `uuid` primary keys for new tables.
- Money: store prices in **pesewas** (integer) or **decimal** with clear naming. Pick one and stick to it. Recommendation: **integer pesewas** (`4500` = GH₵ 45.00) to avoid float bugs.

---

## Phase 2 — Auth (admin first)

**Goal:** Only logged-in admins can open `/admin`.

### Recommended approach (simple)

Use **Auth.js (NextAuth) v5** with credentials **or** email magic link for a single admin, **or** a simple email/password with hashed password in `users`.

Keep v1 minimal:

- One role: `admin`
- Protect `/admin/**` with middleware
- Login page at `/admin/login`

### Tasks

1. Add auth library and session helpers in `lib/auth/`.
2. Create `users` table seed for first admin (password from env).
3. Middleware: redirect unauthenticated users away from `/admin`.
4. Logout control in admin layout.

### Acceptance

- [x] `/admin` redirects to login when logged out.
- [x] Admin can log in and see dashboard.
- [x] Public shop pages stay public.

### Phase 2 notes (completed)

- Auth.js (NextAuth v5) credentials provider.
- Edge-safe `lib/auth/config.ts` for middleware; DB only loaded inside `authorize`.
- Login at `/admin/login`. Sign out in admin layout.
- Default seeded admin from env: `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

### Out of scope for Phase 2

- Customer accounts / social login (later if needed).

---

## Phase 3 — Products from database

**Goal:** Shop reads products from Postgres. Admin can create/edit/delete products.

### Tasks

1. Replace `lib/products.ts` static array usage with query helpers:
   - `listProducts(filters)`
   - `getProductById(id)`
   - `getRelatedProducts(id)`
2. Update `/shop` and `/shop/[id]` to use DB data.
3. Admin products page:
   - list from DB
   - create / edit form
   - toggle stock
   - manage category
4. Keep image URLs as text for now (file upload in Phase 9).

### Acceptance

- [x] Shop shows seeded products from DB.
- [x] Editing a product in admin changes the shop page.
- [x] Filters (category, price, availability) still work.

### Code rule

Leave a thin compatibility layer if needed:

```ts
// lib/products.ts becomes re-exports / formatters only
export { formatPrice } from "./money";
```

Do not keep two sources of truth.

---

## Phase 4 — Orders + WhatsApp checkout persistence

**Goal:** Checkout creates a real order, then opens WhatsApp with order details.

### Flow

1. Customer fills checkout form.
2. Server action `createOrderFromCart`:
   - upserts `customers` by phone
   - creates `orders` + `order_items`
   - sets status `pending`
   - writes first `order_events` row
   - returns `orderNumber` (example: `FTS-1042`)
3. Client opens WhatsApp with message including order number.
4. Clear cart after successful create.

### Tasks

1. Order number generator (readable, unique).
2. Server action for create order.
3. Wire `/checkout` to server action (stop “fake clear only”).
4. Show success state with order number + link to `/track-order`.

### Acceptance

- [x] Submitting checkout inserts rows in Postgres.
- [x] WhatsApp message includes order number and line items.
- [x] Cart clears only after successful save.

---

## Phase 5 — Service bookings

**Goal:** Booking forms create `bookings` rows, then open WhatsApp.

### Tasks

1. Server action `createBooking`.
2. Wire `/services` and `/contact` forms.
3. Admin list of bookings (basic table) under orders or a bookings page.

### Acceptance

- [x] Booking appears in DB with status `requested`.
- [x] WhatsApp still opens with the same details.

---

## Phase 6 — Track order (real data)

**Goal:** `/track-order` looks up real orders by order number + phone.

### Tasks

1. Server action or route: `findOrder({ orderNumber, phone })`.
2. Render timeline from `order_events` / current status.
3. Remove demo hard-coded orders from `lib/services.ts`.

### Acceptance

- [x] Real order from Phase 4 can be tracked.
- [x] Wrong phone/number shows a clear error.
- [x] No demo credentials required.

---

## Phase 7 — Admin dashboard (live data)

**Goal:** Replace admin placeholders with real queries.

### Tasks

1. Overview cards: sales total, order count, customer count, product count.
2. Recent orders table from DB.
3. Orders page: filter by status, update status (writes `order_events`).
4. Products page fully CRUD (if not finished in Phase 3).
5. Settings page reads/writes `settings` table (delivery fee, WhatsApp number, hours).

### Acceptance

- [x] Admin numbers match database.
- [x] Changing order status updates track-order timeline.
- [x] Delivery fee used at checkout comes from settings.

### Also delivered in Phase 7 (business hub)

- Action-oriented overview with attention queue (pending orders, bookings, complaints, stock).
- Live bookings status updates.
- Customers CRM list + detail with order history.
- Complaints create / resolve.
- Reports: revenue, 7-day orders, top products, bookings by status.
- Site content editor (hero, tagline, about blurb).
- Business settings editor (contact, hours, social, delivery fee).

---

## Phase 8 — Customers, complaints, reports

**Goal:** Complete admin modules.

### Tasks

1. Customers page from `customers` + order counts.
2. Complaints CRUD linked to customer/order when possible.
3. Reports page: simple aggregates (orders per day, top products). Keep charts simple (CSS bars first).

### Acceptance

- [x] Admin can open a customer and see their orders.
- [x] Complaint can be marked open/resolved.
- [x] Reports show real aggregates, not placeholders.

> Note: Phase 8 acceptance was completed as part of the Phase 7 business hub expansion.

---

## Phase 9 — Media, polish, deploy

**Goal:** Production ready.

### Tasks

1. Image uploads (local disk for simple hosting, or S3/Cloudinary). Prefer one clear approach.
2. Empty/loading/error states everywhere.
3. Basic SEO pass (titles, OG images).
4. Deploy:
   - App: Vercel (or similar)
   - DB: Neon / Supabase / Railway Postgres
5. Backup note + env checklist in README.
6. Mark all phases Done in this document.

### Acceptance

- [x] Admin can upload product images to `public/uploads` (or paste URLs).
- [x] Loading / error / not-found states exist for site and admin.
- [x] SEO: `metadataBase`, page titles, product OG, `robots.ts`, `sitemap.ts`.
- [x] README covers env checklist, deploy steps, and backups.
- [ ] Production URL works with real DB. *(Owner must deploy with Neon/Vercel credentials.)*
- [ ] Admin login works in production.
- [ ] Checkout creates orders in production DB.

### Notes

Local disk uploads persist on VPS/Docker. On serverless (Vercel), paste external image URLs or add object storage later.

---

## Suggested schema sketch (Phase 1 detail)

Agents should refine types, but keep this shape unless there is a strong reason to change it.

### products

- `id` uuid pk
- `slug` text unique
- `name` text
- `description` text
- `long_description` text
- `price_pesewas` integer
- `category_id` uuid fk
- `rating` numeric (optional cached)
- `reviews_count` integer default 0
- `in_stock` boolean
- `badge` text nullable
- `created_at` / `updated_at`

### orders

- `id` uuid pk
- `order_number` text unique
- `customer_id` uuid fk
- `status` text
- `subtotal_pesewas` integer
- `delivery_pesewas` integer
- `total_pesewas` integer
- `delivery_address` text
- `notes` text
- `created_at` / `updated_at`

### order_items

- `id` uuid pk
- `order_id` uuid fk
- `product_id` uuid fk
- `product_name` text (snapshot)
- `unit_price_pesewas` integer (snapshot)
- `quantity` integer

Snapshots matter so historical orders stay correct if product prices change later.

---

## Environment checklist

| Variable | Phase | Purpose |
|----------|-------|---------|
| `DATABASE_URL` | 1 | Postgres connection |
| `AUTH_SECRET` | 2 | Session encryption |
| `ADMIN_EMAIL` | 2 | Seed / login |
| `ADMIN_PASSWORD` | 2 | Seed only (never commit) |
| `NEXT_PUBLIC_SITE_URL` | 9 | Absolute links / SEO |
| `UPLOAD_...` | 9 | If using cloud storage |

---

## How agents should work each session

1. Read this file (`docs/BUILD_PLAN.md`).
2. Pick the **lowest numbered phase that is not Done**.
3. Mark it `In progress`.
4. Implement only that phase’s tasks (or a clear sub-slice).
5. Run lint/build and manual checks listed in Acceptance.
6. Mark phase `Done` (or leave notes if blocked).
7. Do not skip ahead into payments, mobile apps, or redesigns unless asked.

### If blocked

Write a short note under the phase:

```md
### Blockers
- Need Neon project credentials from owner
```

---

## Out of scope for now

- Card / MoMo payment gateway (can be Phase 10 later)
- Customer self-serve accounts
- Native mobile apps
- Multi-vendor marketplace
- Full inventory warehouse system

---

## Quick reference: important existing files

| File | Role today |
|------|------------|
| `lib/constants.ts` | Site contact + WhatsApp helpers |
| `lib/products.ts` | Product types + `formatPrice` (data from DB) |
| `lib/db/products.ts` | Product queries + admin mutations |
| `lib/db/seed-catalog.ts` | Seed-only static catalogue |
| `server/products.ts` | Admin product server actions |
| `lib/services.ts` | Static services/testimonials/demo orders |
| `lib/cart.tsx` | Client cart (keep; persist orders in Phase 4) |
| `app/(site)/*` | Public pages |
| `app/admin/*` | Admin UI (products CRUD live) |

---

## Change log

| Date | Change |
|------|--------|
| 2026-07-24 | Initial end-to-end phased plan created (Postgres + Drizzle). |
| 2026-07-24 | Phase 1 Done: Drizzle schema, Docker Postgres (5433), migrate, seed. |
| 2026-07-24 | Phase 2 Done: Auth.js admin login, middleware protection, logout. |
| 2026-07-24 | Phase 3 Done: shop/home/admin products read-write Postgres; static catalogue only for seed. |
| 2026-07-24 | Phase 4 Done: checkout creates orders/customers/events, WhatsApp includes order number, cart clears after save. |
| 2026-07-24 | Phase 5 Done: services/contact bookings persist as `requested`; admin bookings list; WhatsApp still opens. |
| 2026-07-24 | Phase 6 Done: track-order looks up real orders by number + phone; demo FTS-1042 removed. |
| 2026-07-24 | Phase 7+8 Done: business ops admin hub, live stats, order/booking status, settings + site content CMS, customers/complaints/reports. |
| 2026-07-24 | Wired public site to admin Settings/Content: WhatsApp, contact, about, hero, metadata, login brand name. |
| 2026-07-24 | Phase 9 Done: local image uploads, loading/error/empty polish, SEO sitemap/robots, deploy + backup docs. Production host still needs owner credentials. |
| 2026-07-24 | Hardening pass: rate limits, role-aware admin auth, phone normalize, safer track payload, upload magic bytes, URL allowlists, security headers, seed prod guards. |
