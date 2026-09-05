# PlateAI

AI-powered food companion: snap a photo of a meal, get a full analysis of nutrients, macros, and calories. Monorepo with a Next.js frontend and an Express auth/AI server.

## Stack

- **Frontend:** Next.js (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4, Base UI / shadcn-style components, Jotai state, Motion animations
- **Backend:** Express 4, TypeScript (ESM, NodeNext), MongoDB + Mongoose, Passport (Google OAuth), JWT sessions, OpenAI / Gemini providers (multi-provider AI abstraction)
- **Billing:** `@plate/plate-billing` — a provider-agnostic billing package (currently Lemon Squeezy) that owns all payment/plan/webhook logic; the server only handles HTTP + DB persistence
- **Tooling:** npm workspaces, Vitest (shared test runner), oxfmt (formatter), the oxlint linter (single root config), Docker, GitHub Actions (lint / test / build / deploy)

## Monorepo layout

```
plateai/
├── apps/
│   ├── plateUI/        # Next.js app (@plate/plate-ui)
│   └── plateServer/    # Express + OAuth + MongoDB (@plate/plate-server)
├── packages/
│   └── plate-billing/  # provider-agnostic billing logic (@plate/plate-billing)
├── tsconfig.base.json  # shared TS options
├── vitest.config.mts   # vitest projects: plateUI + plateServer + plate-billing
├── .oxfmtrc.json       # oxfmt formatter config
└── .oxlintrc.json      # oxlint config (single, with per-app overrides)
```

npm workspaces at the root; all commands run from the root.

## Billing package

`packages/plate-billing` (`@plate/plate-billing`) is the single source of truth for plans, prices, and payments. It exposes a generic, provider-agnostic `BillingProvider` interface (`createCheckout`, `verifyWebhookSignature`, `parseWebhook`) so switching payment providers (e.g. Lemon Squeezy today, Stripe later) never touches the server or UI. The server's `checkout` route only handles HTTP and DB writes; all Lemon Squeezy logic lives in the package. Both apps depend on `@plate/plate-billing` (the UI for plan/status contracts, the server for the provider). The package exposes **subpath entries only** (no root barrel): `@plate/plate-billing/constants`, `@plate/plate-billing/types`, `@plate/plate-billing/utils`, and `@plate/plate-billing/provider`.

## Auth & sessions

Auth uses Google OAuth for identity, then issues its own tokens backed by a DB session so sessions can be **revoked** and **rotated**:

- **Access token** (`plateai.access`) — short-lived HS256 JWT (15 min) with `sub` (userId) and `sid` (sessionId) claims. Sent with every request; the server validates it against the live DB session.
- **Refresh token** (`plateai.refresh`) — opaque 32-byte value (30 days). Only its SHA-256 hash is stored in the `Session` model, so it can be revoked. Rotated on every refresh (the old hash is invalidated and replaced).
- Both are **httpOnly** cookies with `sameSite=lax`, `secure` in production.

Sessions live in MongoDB (`Session` model: `userId`, `refreshTokenHash`, `expiresAt`, `lastUsedAt`, `userAgent`, `ipAddress`, `revokedAt`) and can be revoked server-side (logout, compromise, admin).

The frontend never decodes JWTs client-side — every auth check calls the server through the UI `/api/auth/*` proxy:

- `/api/auth/me` — validates the access token against the DB session and returns the fresh user (subscription data is always loaded from the DB, never from stale JWT claims).
- `/api/auth/refresh` — rotates the refresh token and mints a new access token (used for silent refresh).
- `/api/auth/logout` — revokes the session and clears both cookies.

## Getting started

**Prerequisites:** Node 24 (pinned via `engines`), npm (pinned via `packageManager`), MongoDB for the auth server.

**1. Install**

```bash
npm install
```

**2. Configure env files** (each from its `.env.example`):

- `apps/plateUI/.env.local` — site URL, auth server URL
- `apps/plateServer/.env` — port, MongoDB, Google OAuth, JWT secret, AI provider, Lemon Squeezy

**3. Run**

```bash
npm run dev          # Next.js app on http://localhost:3000
npm run dev:server   # Express server on http://localhost:4000
```

Or both via Docker:

```bash
docker compose up
```

## Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Next.js dev (plateUI) |
| `npm run dev:server` | Server dev (tsx watch) |
| `npm run build` / `build:server` | Workspace builds |
| `npm run lint` / `lint:server` | Per-app oxlint (root `.oxlintrc.json`) |
| `npm run test` | All vitest projects |
| `npm run test:ui` / `test:server` / `test:billing` | Single vitest project |
| `npm run typecheck` / `typecheck:server` | Per-app tsc |
| `npm run format` / `format:check` | oxfmt over everything |

## CI/CD

GitHub Actions workflows in `.github/workflows/`:

- **ci.yml** — on push/PR to `main`: matrix `check` job (plateUI + plateServer lint + test), then `build` job (push plateUI and plateServer images to Docker Hub) on main only.
- **deploy.yml** — after a successful CI on `main`, pull the images on EC2 via `compose.prod.yaml`.

## Conventions

See `AGENTS.md` for project stack, folder structure, naming, and per-app file conventions (feature folders with `index.tsx`, `constants.ts`, `types.ts`, `utils.ts`, `hooks.ts`, `state.ts`).