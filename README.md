# Khak — Smart Plant Disease Platform

TypeScript React app + Express API for plant-disease diagnosis, expert consults and a store.

## Run

```bash
cp .env.example .env
npm install
npm run dev
```

- App: http://localhost:5173
- Swagger: http://localhost:4000/api/docs
- Demo: `demo@khak.app` / `Demo123!`

UI only with mock API:

```bash
npm run dev:mock
```

## Scripts

`npm run type-check` · `npm test` · `npm run lint` · `npm run build`

## Architecture

[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

The UI uses a `KhakApi` contract. Live adapter talks to Express. Mock adapter uses localStorage (`VITE_USE_MOCK=true`).

## Deploy

Vercel for the Vite app. Render or Docker for the API. Public live demo needs your hosting account.

## License

MIT
