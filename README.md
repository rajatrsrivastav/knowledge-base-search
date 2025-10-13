# Knowledge Base Search

Minimal full-stack document search app (Next.js frontend + Express TypeScript backend). Use this repo to run locally, develop admin pages, and index/search documents in PostgreSQL.

Key folders:
- `frontend/` — Next.js app (React + Ant Design)
- `server/` — Express + TypeScript API

Quick start (dev):

1. Backend

```bash
cd server
npm install
cp .env.example .env   # create .env or edit server/.env with DB settings
npm run init-db        # create schema + sample data
npm run dev
```

2. Frontend

```bash
cd frontend
npm install
# set frontend/.env.local with NEXT_PUBLIC_DAPI_URL (e.g. http://localhost:4000/api)
npm run dev
```

Notes:
- On production, set `NEXT_PUBLIC_DAPI_URL` in your host and rebuild the frontend (Next.js inlines NEXT_PUBLIC_ vars at build time).
- Do not commit `.env`/`.env.local` with secrets.

---

## Admin UI routes (frontend)

Open the frontend in your browser and navigate to these admin paths:

- Admin home / dashboard: `/admin`
- PDFs manager: `/admin/pdfs`
- FAQs manager: `/admin/faqs`
- Links manager: `/admin/links`
- Settings: `/admin/settings`

These pages call backend API endpoints (prefixed with the `NEXT_PUBLIC_DAPI_URL` value). The admin UI supports adding PDFs (upload), FAQs and Links.

---

## Backend API endpoints (examples)

Base URL (dev): `http://localhost:4000/api` (this value is what `NEXT_PUBLIC_DAPI_URL` should point to)

- GET /api/search?q=term — full-text search across content
- GET /api/faqs — list FAQs
- POST /api/faqs — add FAQ (JSON: { question, answer })
- GET /api/pdfs — list PDFs
- POST /api/pdfs — upload PDF (multipart/form-data: title + file)
- GET /api/links — list links
- POST /api/links — add link (JSON: { title, content })

Use `curl` to test quickly (example):

```bash
curl "${DAPI:-http://localhost:4000/api}/search?q=pdf"
```

---


## Project layout (high level)

- `frontend/` — Next.js app (React + Ant Design)
- `server/` — Express TypeScript backend
- `server/schema.sql` — DB schema

---

If you want, I can also:

- Add a `frontend/.env.example` and `server/.env.example` file
- Centralize the API base usage into a small helper `frontend/src/lib/api.ts`
- Add a handy `Makefile` with common commands (install, build, dev, init-db)

Tell me which of those you'd like and I'll add them.
