# Masar — Schools Directory Frontend

A production React (Vite) frontend for the Egyptian Applied Technology Schools
backend. This project is **frontend + API integration only** — the backend
was analyzed and used as-is; no backend files, routes, or database structure
were modified.

## Stack

React 18 (Vite) · Tailwind CSS · React Router v6 · Axios · React Hook Form · React Icons

## Getting started

```bash
npm install
cp .env.example .env   # then edit VITE_API_BASE_URL to point at your backend
npm run dev
```

The app runs at `http://localhost:5173`. Make sure the backend is running
(default expected at `http://localhost:5000/api/v1` — update `.env` if yours
differs) and that its `CORS_ORIGIN` allows the Vite dev origin (the backend
defaults to `*` if `CORS_ORIGIN` is unset, so this works out of the box).

## Environment variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API, **including** `/api/v1` |
| `VITE_ADMIN_PASSWORD` | Password for the admin UI gate (see note below) |

## Project structure

```
src/
  components/   common/ (Modal, Pagination, ScoreGauge, ...) · public/ (Navbar, SchoolCard, ...) · admin/ (Sidebar, DataTable, ...)
  context/      LanguageContext (AR/RTL ↔ EN/LTR), ToastContext, AdminAuthContext
  hooks/        useDebounce, useFetch, useCompareList
  layouts/      PublicLayout, AdminLayout
  pages/        public/ (Home, Schools, SchoolDetails, Compare, About, Contact, NotFound)
                admin/  (Login, Dashboard, SchoolsList, SchoolForm, Governorates, Partners, Specializations, MediaManager)
  router/       index.jsx (lazy-loaded routes), ProtectedRoute
  services/     api.js (Axios instance) + one module per backend resource
  utils/        constants.js (enums mirrored from the backend), format.js, translations.js
```

Every API call goes through `src/services/*`, which wraps the backend's
`{ success, message, data, meta }` envelope. Nothing is hardcoded — all
schools, governorates, partners, and specializations come from the live API.

## Known gaps vs. a "full" spec (decided with you up front)

The backend was analyzed first, and it doesn't include a few things a
production directory site would normally have on the backend side. Per your
instructions not to modify or extend the backend, these were implemented as
frontend-only approximations instead of being silently skipped:

1. **Admin auth** — the backend has *no* authentication endpoints at all.
   `/admin` is protected by a **client-side-only** password gate
   (`VITE_ADMIN_PASSWORD` in `.env`, default `admin123`), stored in
   `sessionStorage`. This is a UI convenience, **not real security** — anyone
   with direct API access bypasses it entirely. Don't rely on it to protect
   real data.
2. **Media manager** — the backend stores images as plain URL strings nested
   under a school (`mainImage`, `images[].url`), with no file upload
   endpoint. `/admin/media` lets you pick a school and manage its image URLs,
   saved via the normal `PUT /schools/:id` endpoint — no new API was added.
3. **Home page statistics** — there's no `/stats` endpoint, so the numbers
   shown (total schools, governorates, partners, specializations) are
   computed client-side from each list endpoint's `meta.total`.
4. **Contact page** — there's no `/contact` endpoint either, so the form
   validates and shows a success toast locally rather than posting anywhere.

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```
