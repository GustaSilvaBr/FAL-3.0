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

**Product data** lives in Firestore. The public components (`ExploreProducts`, `Novidades`, `PipocaGravata`, `Brands`) read from Firestore at runtime. If a section has no Firestore data yet it renders nothing (graceful empty state). The admin panel at `/admin` manages all product and section data.

**Asset loading:** Static assets (logos, hero images) in `src/assets/` must be imported with the Vite pattern:
```ts
new URL('../../assets/products/Category/file.png', import.meta.url).href
```
A custom Vite plugin in `vite.config.ts` also resolves `figma:asset/<filename>` to `src/assets/<filename>`.

**Styling:** Tailwind CSS v4 (configured via `@tailwindcss/vite` plugin, not `tailwind.config`). All design tokens (colors, radius, etc.) are CSS variables defined in `src/styles/theme.css`. Brand palette: `--primary` (#019F43 green), `--secondary` (#FF6B35 orange), `--accent` (#FFB627 yellow). Import order for styles is in `src/styles/index.css`.

**Animations:** Use `motion/react` (the Motion library), not `framer-motion`.

**Deployment:** Firebase Hosting serves the `dist/` folder (project: `aptscashcontrol`). The `firebase.json` rewrite rule sends all paths to `index.html` for client-side routing.

## Admin panel (`/admin`)

**Access:** Google login required. The user's email must exist as a document in the Firestore `admins` collection (document ID = email). Add admins manually via the Firebase Console.

**Auth flow:** `src/lib/useAuth.tsx` provides `AuthProvider` + `useAuth` hook. `AdminGuard` checks auth state and renders either the login page or `AdminLayout` with the nested route outlet.

**Routes (nested under `/admin`):**
- `/admin/products` — product list grouped by folder
- `/admin/products/new` — create product (accepts `?folder=<id>` param)
- `/admin/products/:id/edit` — edit product
- `/admin/sections` — configure which products appear in Novidades, Pipoca Gravatá, and Brands sections

**Firestore collections:**
- `admins/{email}` — admin allow-list
- `folders/{id}` — product categories (`name`, `order`)
- `products/{id}` — product records (`name`, `weight`, `folderId`, `imageUrl`, `imagePath`, `nutrition`)
- `sections/novidades` — `{ items: [{ productId, tag?, description }] }`
- `sections/pipoca-gravata` — `{ categories: [{ id, label, subtitle, productIds[] }] }`
- `sections/brands` — `{ productIds: string[] }`

**Firebase Storage:** Product images are stored at `products/{productId}/image.<ext>`. The `imagePath` field on each product record points to the Storage path (used for deletion). Storage rules must allow public reads and admin writes — see `storage.rules` (create if absent).

**Shared types:** `src/lib/types.ts` exports `Product`, `Folder`, `NutritionTable`, `NUTRITION_FIELDS`, and section types used by both admin and public components.

**Environment variables:** Copy `.env.example` → `.env.local` and fill in Firebase project values from the Firebase Console → Project Settings → Your Web App.

**Firestore rules:** `firestore.rules` is ready to deploy (`firebase deploy --only firestore:rules`). Products, folders, and sections are publicly readable; writes require admin auth.
