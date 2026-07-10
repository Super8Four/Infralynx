# Development and Docker workflow

## Requirements

- Node.js 24 LTS and npm 11 for host-based development
- Docker with Compose v2 for the canonical full-stack workflow

All committed text files use LF line endings. The same checkout is supported
on macOS, Windows, and Linux.

## Install and verify

```sh
npm install
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

Install Playwright browsers once before running browser tests:

```sh
npx playwright install
npm run test:e2e
```

## Host-based development

Start the shared package compiler, Express API, and Vite client together:

```sh
npm run dev
```

- Web UI: `http://localhost:5173`
- API: `http://localhost:3000/api/v1`
- OpenAPI JSON: `http://localhost:3000/api/v1/openapi.json`
- Swagger UI: `http://localhost:3000/api/docs/`

Host-based API development expects PostgreSQL at the `DATABASE_URL` in the
environment. The versioned health endpoint does not require a database, while
the readiness endpoint does.

## Docker Compose

Create `.env` from `.env.example` and replace all example secrets. Start the
stack with:

```sh
docker compose up --build
```

Compose starts PostgreSQL, runs the one-shot migration container, starts the
API after migrations succeed, and starts the web proxy after the API becomes
ready. The UI is published at `http://localhost:8080` by default.

Persistent named volumes hold PostgreSQL and local uploaded files. Removing a
container does not remove those volumes. Do not use `docker compose down -v`
unless destroying all local project data is intentional.

## Database migrations

Edit `apps/api/src/db/schema.ts`, then generate a reviewed SQL migration:

```sh
npm run db:generate --workspace=@infralynx/api
```

Migrations run as an explicit deployment step. Normal API startup never
changes the schema.
