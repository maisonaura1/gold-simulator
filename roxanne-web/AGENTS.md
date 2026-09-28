<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project: RoxanneAlexia Language Coach (Law & Business English)

Marketing site + private dashboard for Roxanne, an English coach for legal and business professionals.
Next.js 16.3 (App Router, Turbopack), React 19.3, Tailwind CSS v4 (CSS-first `@theme` in `src/app/globals.css`),
`motion` (import from `motion/react`), three.js via `@react-three/fiber` 9 + `@react-three/drei` 10, zod 4.

## Next 16 reminders
- `src/proxy.ts` (not middleware). `params`, `searchParams`, `cookies()`, `headers()` are async.
- `next/image`: use `preload` (not `priority`); qualities allowed: 75, 85.
- `revalidateTag(tag, profile)` needs 2 args; we use `revalidatePath('/', 'layout')` via `revalidateSite()`.
- No `next lint` — run `npm run lint` (ESLint flat config) and `npm run typecheck`.

## Architecture
- Content model: `src/content/types.ts`; defaults (client copy) in `src/content/defaults.ts`. Never hardcode copy in pages — read it from `getContent()`.
- Data access (server only): `src/lib/data.ts` — content, settings, testimonials, messages, media. Storage back-end in `src/lib/store.ts` (files in `./data` or Upstash Redis REST).
- Auth: `src/lib/auth.ts` (`isAdmin`, `requireAdmin`, `assertAdmin`, `checkPassword`, `startSession`, `endSession`, `rateLimit`). Signed cookie helpers in `src/lib/session.ts`. **Every admin page, Server Action and Route Handler must call `requireAdmin()`/`assertAdmin()` itself** — the proxy is only an optimistic gate.
- Public pages live in `src/app/(site)/`; they are statically prerendered and refreshed by `revalidateSite()` after dashboard edits. Don't call `cookies()`/`headers()` in public pages.
- Photos: `src/content/photos.ts` → `resolvePhoto(key, settings.photos)`, rendered with `<Photo>` (`src/components/ui/Photo.tsx`).
- Popups: `useSite()` from `src/components/site/site-context.tsx` → `openConsultation()`, `openPackages(slug)`.

## Design system (keep it consistent)
- Palette tokens (Tailwind classes): `ivory` (page bg), `cream`, `blush`, `sand`, `line` (borders), `clay` (accent/CTA), `clay-dark`, `clay-soft`, `ink` (text), `ink-soft` (secondary text), `navy` (dark sections), `sage`, `sage-dark`, `gold` (hairlines).
- Type: `font-display` (Cormorant Garamond) for headings, `font-sans` (Manrope) for UI/body. Helpers: `.display-xl/lg/md/sm`, `.lead`, `.eyebrow`, `.container-site`, `.arch`, `.grain`.
- Motion: `<Reveal>`, `<RevealGroup>/<RevealItem>` (`src/components/ui/Reveal.tsx`); always honor `prefers-reduced-motion`.
- Buttons: `Button`, `ButtonLink`, `TextLink` (`src/components/ui/Button.tsx`).
- Accessibility: visible focus, labelled controls, AA contrast (clay on ivory is 4.8:1 — don't use `sage`/`gold` for small text).

## Checks before committing
`npm run typecheck && npm run lint && npm run build`
