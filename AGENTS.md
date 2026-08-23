<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

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

## TypeScript

Do not inline structural types in props or signatures (no `{ children: ReactNode }` or `Readonly<{ … }>` on the function). Declare a named `type` (or `interface`) and use that name.

Put types **immediately after imports** when they only reference imported types. If a type needs `typeof` some value in the same file (for example `VariantProps<typeof buttonVariants>`), declare that type **right above** the component/function that uses it, after the value exists.

**No types or static constants in component files.** Feature `*.tsx` subcomponents (e.g. `pricing-comparison-table.tsx`) must not declare `type`/`interface` or exportable `const` maps, arrays, or copy — put types in **`types.ts`** and static data in **`constants.ts`**. Component files import those siblings; they contain JSX and component logic only. **`app/ui/`** follows the same split when a control needs feature-level copy or props types colocated nearby.

## Naming

- **Folders:** use **kebab-case** (`meal-plan`, `shopping-list`). Single-word segments are lowercase (`test`, `auth`). Apply under **`app/components/`** (and new route segments under **`app/`** when you add them).
- **Constants** (copy and other static values in `constants.ts`, plus root `siteMetadata` in `layout.tsx`): use **UPPERCASE** — `export const FEATURE = { TITLE: '…', BODY: '…' } as const` with **SCREAMING_SNAKE_CASE** keys, or top-level `export const PAGE_TITLE = '…' as const`. Do not use camelCase keys for exported copy objects.

ESLint enforces **kebab-case** folders under `app/components/` (`check-file/folder-naming-convention`) and **UPPER_CASE** names in `app/components/**/constants.ts` (`@typescript-eslint/naming-convention`).

## App structure (features)

Feature folders live under **`app/components/<kebab-case-name>/`**. Standard files (use only what the feature needs):

| File | Role |
|------|------|
| **`index.tsx`** | **Entry point** — default export is the main feature UI. `app/<route>/page.tsx` renders it (`return <Feature />`), not a re-export. |
| **`constants.ts`** | User-visible copy and static arrays/objects you `.map()` over. **UPPERCASE** export names, **SCREAMING_SNAKE_CASE** keys (`as const`). `.ts` only — no JSX. |
| **`types.ts`** | Feature types: props, hook results, discriminated state unions. |
| **`utils.ts`** | Pure helpers — no Jotai, no `fetch`, no browser-only APIs unless clearly gated. |
| **`hooks.ts`** | Client hooks (`'use client'`). Compose **`state.ts`** atoms; keep side effects here, not in `utils.ts`. |
| **`state.ts`** | **Jotai atoms only** (single file). Types for atom values live in **`types.ts`**. |
| **`<kebab-name>.tsx`** | Subcomponents (e.g. `snap-upload-panel.tsx`). **Import the file directly** — `@/app/components/snap/snap-upload-panel` or `./snap-upload-panel`. **No `type`/`interface` or static `const` data** — use **`types.ts`** and **`constants.ts`**. |

**Do not** add barrel files (`index.ts` that re-exports siblings, or re-export subcomponents through `index.tsx`). **`app/ui/`** has no barrel either — import the concrete file (e.g. `@/app/ui/button`).

**`app/ui/`** is for **design-system** controls built on Base UI / shadcn-style patterns (e.g. `button.tsx`). **App chrome**, marketing sections, and **reusable composition components** (e.g. `scroll/`, `icon-text-card/`) live under **`app/components/<kebab-name>/`**, not in `app/ui/`.

Shared server/domain logic that is not feature UI (e.g. AI providers) belongs under **`lib/<kebab-name>/`**, not inside `app/components/`.

## Express server (`server/`)

OAuth + JWT + MongoDB under **`server/src/routes/<kebab-name>/`** — same file pattern as app features (`index.ts`, `constants.ts`, `types.ts`, `utils.ts`, plus **`auth-controller.ts`** / **`auth-service.ts`** when routes need it). **`index.ts` is the router only**; import siblings via **`@/`** (e.g. `@/routes/auth/google-oauth.js`), no re-exports, no `../` across folders. ESM imports use **`.js`** extensions.

App config: **`server/src/config.ts`**, **`server/src/types.ts`**, **`server/src/models/`**. Env: **`server/.env`** from **`server/.env.example`**; **`JWT_SECRET`** must match Next **`.env.local`**. Dev: **`npm run dev:server`**.

**`AUTH.COOKIE_NAME`** in `server/src/routes/auth/constants.ts` must match **`lib/auth/constants.ts`**.

## Copy / UI strings

Do not hardcode user-visible text inside feature components. Import from **`app/components/<feature>/constants.ts`** using the UPPERCASE export(s) defined there. Root layout metadata copy is colocated in **`app/layout.tsx`** next to `export const metadata` (e.g. `SITE_METADATA` with **SCREAMING_SNAKE_CASE** keys — same convention as feature `constants.ts`).

## Documentatio