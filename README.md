# Promofire — Frontend

Admin panel for Promofire: managing promo campaigns, codes, distributors and end
users (customers), with per-workspace analytics dashboards.

**Live demo:** `https://cebanoleksandr.github.io/my-promofire-fe/`

## Stack

- React 19 + TypeScript + Vite
- MUI v9 (`@mui/material`, Emotion) for components, Tailwind v4 (`@tailwindcss/vite`) also available
- TanStack Query for server state, Redux Toolkit for a small slice of local UI state
- React Router v7 (hash-based routing via `createHashRouter`)
- Recharts for dashboard charts, react-hook-form + yup for forms, framer-motion for animation
- react-i18next for localization

## Getting started

```bash
npm install
npm run dev
```

The dev server talks to the API at `VITE_API_URL` (falls back to `http://localhost:3000`).
Create a `.env` file to point it elsewhere, e.g.:

```
VITE_API_URL=https://my-promofire-be.onrender.com/
```

## Scripts

| Command           | Description                                   |
| ------------------ | ---------------------------------------------- |
| `npm run dev`       | Start the Vite dev server                      |
| `npm run build`     | Type-check (`tsc -b`) then build for production |
| `npm run lint`      | Run ESLint over the repo                       |
| `npm run preview`   | Serve the built `dist/` locally                |
| `npm run deploy`    | Build and publish `dist/` to GitHub Pages       |

There is no test runner configured.

## Project structure

```
src/
  components/
    ui/          Reusable primitives (Button, Table, TextField, DatePicker, ...)
    dashboard/    Dashboard widgets (charts, stat tiles, donut cards)
    layouts/      MainLayout, AuthLayout, Sidebar, Header
    popups/       Modal dialogs (invite, generate code, confirm, ...)
    routing/      Route guards (RequireAuth, RequireRole, GuestOnly)
    discovery/    Onboarding tooltip/discovery gate
  pages/          One file per route (Campaigns, Codes, Users, Distributors, ...)
  network/
    hooks/        TanStack Query hooks — what components consume
    _types/       Centralized query keys (`EQueries` enum + `queryKeys` factory)
    queryClient.ts
  services/       Plain objects calling `apiClient`, returning typed domain data
  lib/            api-client (axios instance), auth-storage, i18n, theme-mode
  store/          Redux slices (alert toasts, onboarding/discovery state)
  router/         All route definitions (`createHashRouter`)
  types/          Shared domain/API types
  theme.ts        MUI theme + Figma design tokens (`colors`, `fontStyles`, `customShadows`)
```

## Architecture

### Data layer (three stacked modules)

1. **`src/lib/api-client.ts`** — the single Axios instance. A request interceptor
   attaches `Authorization: Bearer <token>` from `auth-storage`. A response
   interceptor: on `401` clears auth and redirects to `/login`; wraps any error
   body into an `ApiError` (`src/types/api-error.ts`) with a normalized
   `message`/`statusCode`.
2. **`src/services/*.service.ts`** — plain objects (`campaignsService`,
   `authService`, `customersService`, ...) that call `apiClient` and return
   typed domain data. No React. Re-exported from `src/services/index.ts`.
3. **`src/network/hooks/use*.ts`** — TanStack Query wrappers around the
   services. This is what components consume.

### Query keys and cache invalidation

All query keys live centrally in `src/network/_types/index.ts` (`EQueries` enum
+ `queryKeys` factory). Always use `queryKeys.*` for both `useQuery` and
`invalidateQueries` instead of inlining key arrays. Mutation hooks invalidate
or patch affected keys in `onSuccess`.

`src/network/queryClient.ts` sets the defaults: no refetch on window focus, 30s
`staleTime`, no retry on 4xx (incl. 401), otherwise up to 2 retries; mutations
never retry.

### Auth flow

- Token + account + workspace are persisted in `localStorage` via
  `src/lib/auth-storage.ts` (keys prefixed `promofire_`). There is no
  `/auth/me` call — `useCurrentAccount` / `useCurrentWorkspace` read
  `localStorage` through the service, with `staleTime: Infinity`.
- Login can return one of two shapes. Single-workspace accounts get a fully
  ready `WorkspaceAuthResponse`. Multi-workspace accounts get an intermediate
  account-scoped token + a workspace list, then call `selectWorkspace` (also
  used by the in-app workspace switcher). Discriminate with
  `isWorkspaceAuthResponse()` from `src/types/auth.ts`.
- After a full-context auth response, `syncWorkspaceAuth` seeds the
  account/workspace query cache and invalidates the rest. Logout clears the
  query cache.

### Routing

`src/router/index.tsx` defines all routes with `createHashRouter`. Two guard
components wrap route subtrees: `RequireAuth` (redirects to `/login`) and
`GuestOnly` (bounces logged-in users away from `/login`/`/register`).
Authenticated pages render inside `MainLayout` (Sidebar + Header + `<Outlet/>`
+ global `CustomAlert`); auth pages render inside `AuthLayout`.
`select-workspace` sits under `RequireAuth` but outside `MainLayout`.

### UI conventions

- Reusable primitives live in `src/components/ui/` (barrel export in
  `index.ts`); dashboard widgets live in `src/components/dashboard/`.
- `src/theme.ts` holds the MUI theme plus a `colors` object of design tokens
  imported from Figma (`Promofire-App`). Import `colors` from there rather
  than hardcoding hex values.
- Global toast/alert: dispatch `setAlertAC({ text, mode })` from
  `src/store/alertSlice.ts`; `CustomAlert` in `MainLayout` renders it.
- Custom font Fixel Display is self-hosted from `public/fonts/`.
- Comments throughout the codebase are written in Russian.

## Deployment

The app is deployed to GitHub Pages under a `/my-promofire-fe/` base path
(see `vite.config.ts`). `npm run deploy` builds and publishes `dist/` via
`gh-pages`.
