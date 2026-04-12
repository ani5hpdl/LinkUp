# LinkUp (client + API)

Full-stack social network with a React + Vite frontend and an Express + PostgreSQL backend secured with JWTs and httpOnly cookies.  
**Last updated:** 2026-04-12 (Asia/Kathmandu, UTC+05:45).

## Features at a glance
- Auth: register, login, refresh, logout, me, update profile; rate limits on sensitive routes.
- Social graph: follow/unfollow, follower/following lists (routes exist, see note below).
- Posts: create/edit/delete, per-post likes and comments, personal feed and global explore.
- Post detail view: `/post/:id` page shows the post, live like count, comment thread, and a modal listing users who liked it.
- UX: landing page plus login/signup screens styled with Tailwind CSS v4 and shadcn-inspired components.
- Observability and safety: Helmet, CORS allowlist via `CLIENT_URL`, rate limiting, request IDs, compression, access/error logs via morgan -> Winston.

## Tech stack
- **Frontend:** React 19, Vite, TypeScript, React Router v7, React Query, Tailwind CSS v4, shadcn UI primitives, Lucide icons.
- **Backend:** Node.js (TypeScript), Express 5, PostgreSQL with Prisma 7 (`@prisma/adapter-pg`), JWT auth stored in cookies.

## Prerequisites
- Node.js 20+ and npm.
- PostgreSQL database you can reach locally (default URL below).

## Quick start (local dev)
1) Install dependencies  
   - `cd server && npm install`  
   - `cd ../client && npm install`
2) Configure environment files (do not commit secrets)  
   - `server/.env`
     ```env
     NODE_ENV=development
     PORT=3000
     DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/linkup?schema=public
     CLIENT_URL=http://localhost:5173
     JWT_SECRET=replace_with_long_random_hex
     JWT_REFRESH_SECRET=replace_with_long_random_hex
     LOG_LEVEL=info
     ```
   - `client/.env`
     ```env
     VITE_API_BASE_URL=http://localhost:3000
     ```
3) Prepare the database (from `server/`)  
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
4) Run the stacks (two terminals)  
   - API: `cd server && npm run dev` (http://localhost:3000, base path `/api/v1`)  
   - Web: `cd client && npm run dev` (Vite on http://localhost:5173)

## API surface (current)
Base URL: `/api/v1`

**Auth**
- `POST /auth/register` - create account (rate limited).
- `POST /auth/login` - issue access/refresh cookies (rate limited).
- `POST /auth/refresh` - rotate access token via refresh cookie.
- `POST /auth/logout` - clear cookies (auth required).
- `GET /auth/me` - current user profile (auth required).
- `PUT /auth/me` - update display name, bio, avatar URL (auth + Zod validation).

**Posts**
- `POST /post` - create post (content + optional `imageUrl`).
- `PUT /post/:postId` - edit owned post.
- `DELETE /post/:postId` - delete owned post.
- `GET /post/:postId` - get post with author, likes, comments.
- `POST /post/:postId/react` - like/unlike (creates notifications).
- `POST /post/:postId/comments` / `DELETE /post/:postId/comments/:commentId` - add/remove comment.
- `GET /post/feed` - paginated feed of followed users (auth).
- `GET /post/explore` - paginated global timeline.

**Users**  
Routes are implemented in `src/modules/users` but **not yet mounted** in `src/routes/index.ts`. Add `router.use("/users", usersRoutes);` to expose:
- `GET /users/:username`
- `GET /users/:username/followers` and `/following`
- `POST /users/:username/follow`
- `GET /users/searchUser?keywords=`

**Health**
- `GET /health` - status, env, uptime.

## Project layout
- `server/` - Express API (`server.ts`, `src/app.ts`, `src/routes`, `src/modules`, `prisma/schema.prisma`, `generated/prisma` output).
- `client/` - React app (`src/pages/Login.tsx`, `src/pages/Signup.tsx`, `src/App.tsx`, `src/api/auth.ts`, `src/components/ui/*`).

## Useful scripts
- Server: `npm run dev` (tsx watch), `npm start` (nodemon + tsx), `npm run lint`.
- Client: `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`.

## Notes / gaps
- User routes exist but are not mounted; wire them in before shipping follow features.
- No endpoint yet to mark notifications read; notifications are created on likes/comments only.
- Tests are not present (`npm test` is a stub); add coverage before production.
- Rotate real secrets in `.env` and commit only sample values.

## Troubleshooting
- CORS blocked: ensure `CLIENT_URL` matches your Vite dev URL (default http://localhost:5173).
- Database errors: confirm `DATABASE_URL`, that Postgres is running, and re-run `prisma migrate dev`.
- Cookies not set in browser: use the same site/port you set in `CLIENT_URL` and send requests via the browser (not plain fetch without credentials).
