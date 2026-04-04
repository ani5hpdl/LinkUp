# LinkUp API (server)

Social backend for the LinkUp app: Express 5 + TypeScript + Prisma 7 on PostgreSQL with JWT auth, cookie-based sessions, and feed-style social features.  
**Last updated:** 2026-04-04 (Asia/Kathmandu, UTC+05:45).

## Overview
- REST API with `/api/v1` prefix plus `/health` probe.
- Auth flows: register, login, refresh, logout, fetch/update current user.
- Social graph: follow/unfollow, follower/following lists (see “Routing note” below).
- Posts with images, likes, comments, personal feed, and global explore.
- Security middleware: Helmet, CORS (whitelist via `CLIENT_URL`), rate limiting, signed JWTs stored in httpOnly cookies, request IDs, and compression.
- Observability: morgan HTTP access logs (skips `/health`) streamed to Winston, written to `logs/error.log` and `logs/combined.log`.

## Tech Stack
- Runtime: Node.js (TypeScript), Express 5.
- Database: PostgreSQL accessed via Prisma 7 (`@prisma/adapter-pg` using a shared PG pool).
- Auth: `jsonwebtoken`, httpOnly cookies (`accessToken`, `refreshToken`).
- Validation: Zod-based middleware.
- Tooling: tsx for dev, nodemon for hot reload, ESLint.

## Quick Start
1) **Install deps**
```bash
cd server
npm install
```
2) **Environment** – create `server/.env` (do not commit secrets):
```bash
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/linkup?schema=public
CLIENT_URL=http://localhost:3000
JWT_SECRET=replace_with_long_random_hex
JWT_REFRESH_SECRET=replace_with_long_random_hex
LOG_LEVEL=info
```
3) **Database**
```bash
npx prisma generate           # outputs to generated/prisma
npx prisma migrate dev --name init   # apply schema locally
```
4) **Run**
```bash
npm run dev    # tsx watch server.ts
# or
npm start      # nodemon --exec "tsx" server.ts
```

## API Surface (current)
Base URL: `/api/v1`

**Auth**
- `POST /auth/register` – create account (rate-limited).
- `POST /auth/login` – issue access/refresh cookies (rate-limited).
- `POST /auth/refresh` – rotate access token via refresh cookie.
- `POST /auth/logout` – clear cookies (auth required).
- `GET /auth/me` – current user profile (auth required).
- `PUT /auth/me` – update display name, bio, avatar URL (auth + Zod validation).

**Posts**
- `POST /post` – create post (content + optional `imageUrl`).
- `PUT /post/:postId` – edit owned post.
- `DELETE /post/:postId` – delete owned post.
- `GET /post/:postId` – get post with author, likes, comments.
- `POST /post/:postId/react` – like/unlike (creates notifications).
- `POST /post/:postId/comments` / `DELETE /post/:postId/comments/:commentId` – add/remove comment.
- `GET /post/feed` – paginated feed of followed users (auth).
- `GET /post/explore` – paginated global timeline.

**Users**  
Routes exist in `src/modules/users`, but are **not yet mounted** in `src/routes/index.ts`. Add `router.use("/users", usersRoutes);` to expose:
- `GET /users/:username` – public profile + posts.
- `GET /users/:username/followers` & `/following` – paginated lists.
- `POST /users/:username/follow` – follow/unfollow (auth).
- `GET /users/searchUser?keywords=` – search by username/displayName.

**Health**
- `GET /health` – status, env, uptime.

## Data Model (Prisma)
- `User` – basic profile, optional bio/avatar, counts via relations.
- `Post` – 280-char content, optional image, like/comment counters.
- `Follow` – composite PK prevents duplicate follows.
- `Like` – composite PK; toggles adjust `likeCount`.
- `Comment` – per-post threaded list.
- `Notification` – types: like, comment, follow; created on like/comment, cascade deletes on post/user removal.

## Security & Limits
- Global limiter: 200 requests / 15 minutes on `/api`.
- Auth limiters: max 5 register or login attempts / 15 minutes per IP.
- Cookies: httpOnly, `sameSite=strict`; refresh cookie scoped to `/api/v1/auth/refresh`.
- JWT expirations: access 7d, refresh 30d (configurable via env).

## Logging & Observability
- Request ID middleware echoes/sets `x-request-id`.
- Morgan combined format → Winston transports (`logs/combined.log`, `logs/error.log`).
- Console logs are colorized in non-production.

## Project Layout (server/)
- `server.ts` – boots Express, connects DB, graceful shutdown.
- `src/app.ts` – middleware stack, routing, health, rate limit.
- `src/routes` – API mountpoints (auth, post; users pending mount).
- `src/modules/*` – feature modules (auth, post, users).
- `src/middleware` – auth, validation, rate limiting, request IDs, cookie helper.
- `src/config/db.ts` – Prisma + PG pool lifecycle.
- `src/utils` – JWT helpers, logger, pagination.
- `prisma/schema.prisma` – database schema; client output under `generated/prisma`.

## Scripts
- `npm run dev` – tsx watcher for local development.
- `npm start` – nodemon + tsx (reload).
- `npm run lint` – ESLint for .ts/.js.

## Notes / Gaps (as of 2026-04-04)
- Users module routes exist but are not wired into `src/routes/index.ts`.
- No endpoint yet to mark notifications read; notifications are created on likes/comments only.
- Tests are not present (`npm test` is stubbed).
- Consider rotating the secrets in `.env`; use placeholder values in version control.

## Contributing
1) Open an issue/PR with a short description of the change.
2) Keep TypeScript strictness and run `npm run lint`.
3) Add docs for any new environment flags or endpoints.

