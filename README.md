# Frannys Tidy Solutions

Premium cleaning products and professional cleaning services website for a Ghanaian brand based in East Legon Hills, Accra.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- PostgreSQL + Drizzle ORM (planned / in progress by phase)
- WhatsApp checkout and booking confirmation

## Docs for builders and agents

**Start here:** [docs/BUILD_PLAN.md](docs/BUILD_PLAN.md)

That document is the source of truth for:

- Phased end-to-end delivery (UI -> database -> auth -> orders -> admin -> deploy)
- Coding standards (simple, human-readable code)
- Schema sketch and acceptance checks

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

Admin login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Default seeded admin (change in `.env.local` before seeding in production):

- Email: `admin@frannys.com`
- Password: `changeme123`

Postgres runs in Docker on **localhost:5433** (see `docker-compose.yml`).

### Database scripts

| Script | Purpose |
|--------|---------|
| `npm run db:up` | Start Postgres container |
| `npm run db:generate` | Create SQL migrations from schema |
| `npm run db:migrate` | Apply migrations |
| `npm run db:seed` | Seed admin, categories, products, settings |
| `npm run db:studio` | Open Drizzle Studio |

Build plan: [docs/BUILD_PLAN.md](docs/BUILD_PLAN.md) (Phases 0 to 2 done).

## Current routes

| Path | Description |
|------|-------------|
| `/` | Home |
| `/shop` | Product catalogue |
| `/shop/[id]` | Product detail |
| `/cart` | Cart |
| `/checkout` | WhatsApp checkout |
| `/services` | Cleaning services + booking |
| `/about` | Company story |
| `/contact` | Contact |
| `/track-order` | Order tracking |
| `/admin` | Admin dashboard (UI demo until Phase 7) |

## Project conventions

- Prefer small, clear modules over clever abstractions.
- Keep business logic in `lib/` (and later `lib/db/`), not deep inside JSX.
- Do not commit `.env.local` or secrets.
- Update `docs/BUILD_PLAN.md` when you finish a phase.
