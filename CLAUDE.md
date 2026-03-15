# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

Static landing page for **Nyx** — a real-time subtitle overlay desktop app. See `~/Nyx/CLAUDE.md` for full app context (features, business model, pricing).

## Commands

```bash
pnpm dev        # Dev server at http://localhost:4321/
pnpm build      # Production build → dist/
pnpm preview    # Preview built site locally
pnpm check      # Astro type-check
```

## Stack

- **Astro v6** (static output) + **React** islands (only for interactive components)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (NOT `@astrojs/tailwind`)
- **Cloudflare Pages** deployment via `@astrojs/cloudflare`
- **i18n**: route-based, VI = `/` (default), EN = `/en/`

## Project Structure

```
src/
├── i18n/          vi.json + en.json — all user-facing strings
│                  utils.ts — t(locale, key), getAlternatePath()
├── layouts/       Layout.astro — HTML shell, meta, fonts
├── components/    Astro + React components (React only for LanguageSwitcher, MobileMenu)
├── styles/        global.css — Tailwind @theme vars + custom utilities
└── pages/
    ├── index.astro     # VI (default)
    └── en/index.astro  # EN
artifacts/         # Drop demo video, mascot image, screenshots here
public/images/     # Copy assets from artifacts/ here to serve them
```

## Design System

Custom Tailwind theme vars (in `src/styles/global.css`):
- `--color-bg-primary: #0a0614` — page background
- `--color-accent-purple/violet/pink` — `#7c3aed / #a855f7 / #d946ef`
- `--color-accent-green: #34d399` — CTAs and checkmarks
- Utilities: `.gradient-text`, `.card-glow`, `.glass`, `.btn-gradient`, `.float-anim`, `.orb`

## i18n Rules

- **Never hardcode user-facing strings** — always add to both `vi.json` and `en.json`
- Both locale pages use the same components; pass `locale="vi"` or `locale="en"` as prop
- Array data (feature items, pricing tiers) lives in the JSON files and is imported directly

## Assets

Drop assets into `artifacts/`, then copy to `public/images/`:
- `mascot.png` → displayed in Hero with fallback cat emoji
- `demo.mp4` → set `hasVideo = true` in `Demo.astro` once added
- `app-screenshot-1.png`, `app-screenshot-2.png` → shown below demo video

## Evaluation Checklist (run after every design change)

- [ ] Purple gradient theme consistent across all sections
- [ ] Responsive at 320px, 768px, 1024px, 1440px
- [ ] All strings present in both `vi.json` and `en.json`
- [ ] Clean/elegant/techy aesthetic maintained
- [ ] Fixed navbar + smooth-scroll anchors work
- [ ] `pnpm build` passes without errors
