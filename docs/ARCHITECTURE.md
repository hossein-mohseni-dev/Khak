# Khak architecture

```text
[React UI]
   components/ui   design system
   pages           route screens (lazy loaded)
   state           Auth, Cart, Theme, Toast
   hooks           debounce, page title
   services        KhakApi contract
        ├── live.ts   HTTP → Express / Prisma / Hugging Face
        └── mock.ts   localStorage adapter (VITE_USE_MOCK=true)
                 │
                 ▼
[Express API]  Helmet, CORS, rate limit, Zod, Swagger
                 │
                 ▼
[Prisma]  SQLite local · PostgreSQL production
```

## Why a contract + two adapters

The UI never talks to `fetch` directly except through `services/`.
Swap live/mock with one env flag. That is the trade-off: a little extra code
for a demo that still runs when the API is down.

## Why SQLite by default

A portfolio ZIP must boot with `npm run dev`. Postgres is documented and
ready (`schema.postgres.prisma`, Docker Compose) but not required locally.

## State

Auth and cart are React context, not Redux. The tree is small enough that
global stores would add noise. Cart persists to `localStorage` so refresh
keeps items.
