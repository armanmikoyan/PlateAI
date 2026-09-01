# PlateAI — Monorepo (AGENTS.md)

## Mindset

1. **Think before acting.** Reason through the change before writing code.
2. **Research, then implement.** Check installed Next.js docs and existing patterns here before inventing a new one. Training data loses when it conflicts with `package.json` versions or `node_modules/next/dist/docs/`.
3. **Fix the root cause.** Do not stack workarounds on a broken foundation.
4. **No breadcrumbs.** If you delete or move code, remove it cleanly. Do not leave `// moved to X` comments.
5. **Leave the repo better.** Delete unused props, helpers, and imports. Prefer the simplest code that matches this file.
6. **Do not pivot** unless the user asks or evidence requires it.

## Skills

- **Next.js APIs** (routing, RSC, metadata, images, fonts, errors): `.agents/skills/next-best-practices/SKILL.md`
- **React / Next performance** (bundles, re-renders, hydration): `.agents/skills/vercel-react-best-practices/SKILL.md`
- **shadcn / Base UI** (add, compose, or style components): `.agents/skills/shadcn/SKILL.md`
- **UI / a11y / UX review**: `.agents/skills/web-design-guidelines/SKILL.md`
- **Looking for another skill**: `.agents/skills/find-skills/SKILL.md`

## Monorepo layout

npm **workspaces** at the root. All commands run from the root (`apps/*` and `packages/*` globs):

```
plateai/
├── apps/
│   ├── plateUI/        # Next.js app (@plate/plate-ui)
│   └── plateServer/    # Express + OAuth + MongoDB (@plate/plate-server)
├── packages/           # shared TS packages (types, utils, domain libs)
├── tsconfig.base.json  # shared TS options (apps extend via "extends")
├── vitest.config.mts   # vitest workspaces: plateUI + plateServer projects
├── .oxfmtrc.json       # oxfmt formatter config
```

**Package manager:** npm (do not hand-edit `package-lock.json`). `packageManager` + `engines` are pinned in the root `package.json`.

**Shared config at root:** `tsconfig.base.json` (common TS options; each app `extends` it and overrides), `vitest.config.mts` (per-app `projects` with `name` + `@` alias), `.oxfmtrc.json`, `.oxlintrc.json`. **`tsconfig.json` stays per-app** (Next needs DOM/JSX/bundler resolution + `next` plugin; the server needs `NodeNext` + ESM emit).

**Root scripts** (from `package.json`):
| Command | Action |
|---------|--------|
| `npm run dev` | Next.js dev (plateUI) |
| `npm run dev:server` | Server dev (tsx watch) |
| `npm run build` / `build:server` | Workspace builds |
| `npm run lint` / `lint:server` | Per-app oxlint (root `.oxlintrc.json`) |
| `npm run test` | All vitest projects |
| `npm run test:ui` / `test:server` | Single vitest project |
| `npm run typecheck` / `typecheck:server` | Per-app tsc |
| `npm run format` / `format:check` | oxfmt over everything |

**Env files** live per-app: `apps/plateUI/.env.local` (from `apps/plateUI/.env.example`), `apps/plateServer/.env` (from `apps/plateServer/.env.example`). `JWT_SECRET` must match across both.

## TypeScript

Do not inline structural types in props or signatures (no `{ children: ReactNode }` or `Readonly<{ … }>` on the function). Declare a named `type` (or `interface`) and use that name.

Put types **immediately after imports** when they only reference imported types. If a type needs `typeof` some value in the same file (for example `VariantProps<typeof buttonVariants>`), declare that type **right above** the component/function that uses it, after the value exists.

**No types or static constants in component files.** Feature `*.tsx` subcomponents (e.g. `pricing-comparison-table.tsx`) must not declare `type`/`interface` or exportable `const` maps, arrays, or copy — put types in **`types.ts`** and static data in **`constants.ts`**. Component files import those siblings; they contain JSX and component logic only. **`app/ui/`** follows the same split when a control needs feature-level copy or props types colocated nearby.

## Naming

- **Folders:** use **kebab-case** (`meal-plan`, `shopping-list`). Single-word segments are lowercase (`test`, `auth`). Apply under `app/components/`, the server's `src/routes/`, and future `packages/*` entries.
- **Constants** (copy and other static values in `constants.ts`, plus root `siteMetadata` in `layout.tsx`): use **UPPERCASE** — `export const FEATURE = { TITLE: '…', BODY: '…' } as const` with **SCREAMING_SNAKE_CASE** keys, or top-level `export const PAGE_TITLE = '…' as const`. Do not use camelCase keys for exported copy objects.

oxlint enforces **kebab-case** folders under `app/components/` (`check-file/folder-naming-convention`) via the root `.oxlintrc.json`. Per-app `lint` scripts run `oxlint -c ../../.oxlintrc.json`.

## plateUI (Next.js app)

Entry `apps/plateUI/app/layout.tsx`; routes under `apps/plateUI/app/<route>/page.tsx` render feature components (`return <Feature />`).

### Feature folders (`apps/plateUI/app/components/<kebab-case-name>/`)

Standard files (use only what the feature needs):

| File | Role |
|------|------|
| **`index.tsx`** | **Entry point** — default export is the main feature UI. `app/<route>/page.tsx` renders it, not a re-export. |
| **`constants.ts`** | User-visible copy and static arrays/objects you `.map()` over. **UPPERCASE** export names, **SCREAMING_SNAKE_CASE** keys (`as const`). `.ts` only — no JSX. |
| **`types.ts`** | Feature types: props, hook results, discriminated state unions. |
| **`utils.ts`** | Pure helpers — no Jotai, no `fetch`, no browser-only APIs unless clearly gated. |
| **`hooks.ts`** | Client hooks (`'use client'`). Compose **`state.ts`** atoms; keep side effects here, not in `utils.ts`. |
| **`state.ts`** | **Jotai atoms only** (single file). Types for atom values live in **`types.ts`**. |
| **`<kebab-name>.tsx`** | Subcomponents (e.g. `snap-upload-panel.tsx`). **Import the file directly** — `@/app/components/snap/snap-upload-panel` or `./snap-upload-panel`. **No `type`/`interface` or static `const` data** — use **`types.ts`** and **`constants.ts`**. |

**Do not** add barrel files (`index.ts` that re-exports siblings, or re-export subcomponents through `index.tsx`). **`app/ui/`** has no barrel either — import the concrete file (e.g. `@/app/ui/button`).

**`app/ui/`** is for **design-system** controls built on Base UI / shadcn-style patterns (e.g. `button.tsx`). **App chrome**, marketing sections, and **reusable composition components** (e.g. `scroll/`, `icon-text-card/`) live under **`app/components/<kebab-name>/`**, not in `app/ui/`.

Non-component app logic lives under `app/`:
- **`app/api/<route>/`** — Next route handlers (auth, meal-analyses, snap, health).
- **`app/utils/<kebab-name>/`** — shared pure/domain helpers (e.g. `device-detection/`, `meal-analyses/`), not feature UI.
- `app/utils/cn.ts` — `cn()` class-merge helper; `customers` for CVA variants and composition.

## plateServer (Express app)

Entry `apps/plateServer/src/index.ts`. Source layout:

| Path | Role |
|------|------|
| **`src/app/index.ts`** | Express app assembly (middleware, routers, error handling) |
| **`src/config/`** | `index.ts` (merged env config + auth helpers) + `types.ts` (config types) |
| **`src/database/index.ts`** | Mongoose connection |
| **`src/middleware/require-user.ts`** | Auth guard for protected routes |
| **`src/models/`** | Mongoose schemas (`user.ts`, `meal-analysis.ts`) |
| **`src/routes/<kebab-name>/`** | Per-feature routers |

Route features follow the same file pattern as app features — `index.ts` (router only), `constants.ts` (copy/static, **UPPERCASE**), `types.ts` (route/config/response types), `utils.ts` (pure helpers, co-located unit tests `utils.test.ts`), plus feature `controller.ts` / `service.ts` / `repository.ts` when it needs them (e.g. `auth/`):

- **`index.ts` is the router only** — import siblings via **`@/`** (e.g. `@/routes/auth/google-oauth.js`), no re-exports, no `../` across folders.
- **`controller.ts` / `service.ts` / `repository.ts` each hold only their own layer.** Controllers contain route-handler wiring only — validate/forward, delegate to `service.ts`, respond. No helpers (crypto, parsing, mapping) — those go in `utils.ts`. Services hold business logic that calls `repository.ts`; repositories hold Mongoose/data access only. No cross-layer logic (e.g. no DB queries in controllers, no HTTP in repositories).
- **Types live only in `types.ts`** — never `type`/`interface` in `constants.ts` (consts stay **UPPERCASE** copy/static only). Pure helpers live in `utils.ts` with co-located `utils.test.ts`.
- ESM imports use **`.js`** extensions.
- `ai/` lives under `routes/meal-analyses/ai/` and holds the provider abstraction (`create-provider.ts`, `errors.ts`, `parse-analysis.ts`, `providers/gemini.ts`, `providers/openai.ts`).

Dev: `npm run dev:server` (tsx watch).

**`AUTH.COOKIE_NAME`** in `apps/plateServer/src/routes/auth/constants.ts` must match **`apps/plateUI/app/api/auth/constants.ts`**.

## packages/ (shared code)

Shared, non-app-specific TS packages that both apps can consume. Keep them framework-agnostic (no Next or Express imports). Each gets `package.json` + `tsconfig.json` extending `../../tsconfig.base.json`. Add to the root `workspaces` glob via the `packages/*` pattern (already configured) — no other wiring needed. Empty for now; do not create `packages/index.ts` barrels.

## Copy / UI strings

Do not hardcode user-visible text inside feature components. Import from **`app/components/<feature>/constants.ts`** using the UPPERCASE export(s) defined there. Root layout metadata copy is colocated in **`apps/plateUI/app/layout.tsx`** next to `export const metadata` (e.g. `SITE_METADATA` with **SCREAMING_SNAKE_CASE** keys — same convention as feature `constants.ts`).

## Documentation

Skills provide specialized instructions and workflows for specific tasks. Use the skill tool to load a skill when a task matches its description.