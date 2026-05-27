# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # Build to dist/ for production
```

Deploy to Firebase Hosting after building:
```bash
firebase deploy --only hosting
```

There are no configured test or lint scripts.

## Architecture

This is a **single-page marketing website** for FAL, a Brazilian snack food distributor. It is built with React 18 + TypeScript + Vite + Tailwind CSS v4.

**Entry point flow:**
- `src/main.tsx` — mounts the app via `createBrowserRouter` (React Router v7). Currently only one route (`/`) is defined.
- `src/app/App.tsx` — composes all page sections in order: `Navigation → Hero → Novidades → PipocaGravata → Brands → About → ExploreProducts → Contact → Footer`.

**Navigation model:** The navbar uses anchor-based scroll links (e.g. `#produtos`). When the user is not on `/`, links become `/#anchor` to navigate home first. Sections each have an HTML `id` that matches their anchor.

**Component structure:**
- `src/app/components/` — one file per page section (Hero, Navigation, Brands, etc.)
- `src/app/components/ui/` — shadcn/ui primitives backed by Radix UI. Don't modify these unless adding a new primitive.
- `src/app/components/figma/` — helpers from the Figma Make toolchain.

**Product data** is hardcoded as static arrays inside the components that render them — `ExploreProducts.tsx` holds the full catalog (~100 products), `PipocaGravata.tsx` holds the four Pipoca Gravatá subcategories. There is no external API or data file.

**Asset loading:** Product images in `src/assets/products/` must be imported with the Vite pattern:
```ts
new URL('../../assets/products/Category/file.png', import.meta.url).href
```
A custom Vite plugin in `vite.config.ts` also resolves `figma:asset/<filename>` to `src/assets/<filename>`.

**Styling:** Tailwind CSS v4 (configured via `@tailwindcss/vite` plugin, not `tailwind.config`). All design tokens (colors, radius, etc.) are CSS variables defined in `src/styles/theme.css`. Brand palette: `--primary` (#019F43 green), `--secondary` (#FF6B35 orange), `--accent` (#FFB627 yellow). Import order for styles is in `src/styles/index.css`.

**Animations:** Use `motion/react` (the Motion library), not `framer-motion`.

**Deployment:** Firebase Hosting serves the `dist/` folder (project: `aptscashcontrol`). The `firebase.json` rewrite rule sends all paths to `index.html` for client-side routing.
