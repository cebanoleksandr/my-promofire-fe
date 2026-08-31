# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — type-check (`tsc -b`) then Vite production build
- `npm run lint` — ESLint over the repo
- `npm run preview` — serve the built `dist/`

There is no test runner configured.

Dev server talks to the API at `VITE_API_URL` (falls back to `http://localhost:3000`).

## Stack

React 19 + TypeScript + Vite. MUI v9 (`@mui/material`, Emotion) for components, Tailwind v4 (via `@tailwindcss/vite`) also available. TanStack Query for server state, Redux Toolkit for a small slice of local UI state. React Router v7 (`createBrowserRouter`). Recharts for dashboard charts, react-hook-form + yup for forms, framer-motion for animation.

Note: comments throughout the codebase are written in Russian.

## Architecture

### Data layer (three stacked modules)

1. **`src/lib/api-client.ts`** — the single Axios instance. A request interceptor attaches `Authorization: Bearer <token>` from `auth-storage`. A response interceptor: on `401` clears auth and hard-redirects to `/login`; wraps any error body into an `ApiError` (`src/types/api-error.ts`) with normalized `message`/`statusCode`. A `403` with a "select a workspace" message is expected when the token isn't yet workspace-scoped and is handled at the UI level.
2. **`src/services/*.service.ts`** — plain objects (`campaignsService`, `authService`, …) that call `apiClient` and return typed domain data. No React. Re-exported from `src/services/index.ts`.
3. **`src/network/hooks/use*.ts`** — TanStack Query wrappers around the services. This is what components consume.

### Query keys and cache invalidation

All query keys live centrally in `src/network/_types/index.ts` (`EQueries` enum + `queryKeys` factory). Always use `queryKeys.*` for both `useQuery` and `invalidateQueries` — do not inline key arrays. Mutation hooks are responsible for invalidating/patching affected keys in `onSuccess` (e.g. campaign mutations invalidate `[EQueries.CAMPAIGNS]` and `queryKeys.statsOverview()`, and `setQueryData` the single-entity key).

`src/network/queryClient.ts` sets defaults: no refetch on window focus, 30s `staleTime`, no retry on 4xx (incl. 401), otherwise up to 2 retries; mutations never retry.

### Auth flow

- Token + account + workspace are persisted in `localStorage` via `src/lib/auth-storage.ts` (keys prefixed `promofire_`). There is no `/auth/me` call — `useCurrentAccount` / `useCurrentWorkspace` just read localStorage through the service, with `staleTime: Infinity`.
- Login can return one of two shapes. Single-workspace accounts get a `WorkspaceAuthResponse` (fully ready). Multi-workspace accounts get an intermediate account-scoped token + a workspace list; the user must then call `selectWorkspace` (also used by the in-app workspace switcher). Discriminate with `isWorkspaceAuthResponse()` from `src/types/auth.ts`.
- After any full-context auth response, `syncWorkspaceAuth` seeds the account/workspace query cache and calls `queryClient.invalidateQueries()` to refetch everything. Logout calls `queryClient.clear()`.

### Routing

`src/router/index.tsx` defines all routes. Two guard components wrap route subtrees: `RequireAuth` (redirects to `/login`, stashing the origin path in `location.state.from`) and `GuestOnly` (bounces logged-in users away from `/login`/`/register`). Authenticated pages render inside `MainLayout` (Sidebar + Header + `<Outlet/>` + global `CustomAlert`); auth pages inside `AuthLayout`. `select-workspace` sits under `RequireAuth` but outside `MainLayout`.

Note: `src/App.tsx` is not wired into the router (`main.tsx` uses `RouterProvider` directly).

### UI conventions

- Reusable primitives in `src/components/ui/` (barrel export in `index.ts`), dashboard widgets in `src/components/dashboard/`.
- `src/theme.ts` holds MUI theme + a `colors` object of design tokens imported straight from Figma (`Promofire-App`). Import `colors` from there rather than hardcoding hex values.
- Global toast/alert: dispatch `setAlertAC({ text, mode })` from `src/store/alertSlice.ts`; `CustomAlert` in `MainLayout` renders it.
- Custom font Fixel Display is self-hosted from `public/fonts/`.

## Notes

- `tsconfig.app.json` does not enable `strict`, but does enable `noUnusedLocals`/`noUnusedParameters` and `verbatimModuleSyntax` (use `import type` for type-only imports).
- `react-i18next` is a dependency and used in `CustomAlert`, but no i18n instance is initialized yet.
