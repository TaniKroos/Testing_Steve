# Travel Basket

Travel Basket is a full-stack travel-package showcase with a secured Express API, SQLite persistence, and an admin interface.

## Run locally

```bash
npm install
npm --prefix frontend install
npm --prefix backend install
cp backend/.env.example backend/.env
npm --prefix backend run db:migrate -- --name init
npm --prefix backend run db:seed
npm run dev
```

The frontend normally runs at `http://localhost:5173`; the API runs at `http://localhost:3001`. The seed command creates the administrator from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env`. Change both the JWT secret and password before deployment.

## Backend capabilities

- Prisma + SQLite persistence, migration history, idempotent seed data, and `npm --prefix backend run db:backup` for file backups.
- JWT-protected admin package and booking management, bcrypt password hashes, and a login endpoint.
- Zod validation, plain-text sanitization, structured error responses, request IDs, Pino request logs, and graceful shutdown.
- Helmet, explicit CORS origins, 1 MB JSON limits, and general/booking-specific rate limits.
- Paginated, filtered, searchable, sortable public package listings; PATCH endpoints for packages and booking status.
- Swagger UI at `/api/docs`, health report at `/api/health`, and Vitest/Supertest coverage.

## API overview

Public:

- `GET /api/health`
- `GET /api/docs`
- `GET /api/packages?page=1&limit=20&sort=-rating&category=Adventure&country=Canada&search=lakes`
- `GET /api/packages/:id`
- `POST /api/booking-requests`
- `POST /api/auth/login`

Admin routes require `Authorization: Bearer <token>`:

- `GET`, `POST /api/admin/packages`
- `PUT`, `PATCH`, `DELETE /api/admin/packages/:id`
- `GET /api/admin/booking-requests`
- `PATCH /api/admin/booking-requests/:id`

All successful API responses use `{ success: true, data }`; list endpoints additionally return `pagination`. Errors use `{ success: false, error: { code, message } }`.

## Quality checks

```bash
npm --prefix backend test
npm --prefix frontend run build
```
