# Event Attendance Management System

Modern full-stack attendance platform generated from `Event Attendance Management System.docx`.

## Stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS, React Router, React Hook Form, Zod, TanStack Query, Zustand, Recharts, Axios, QR tooling
- Backend: Node.js, Express, TypeScript, JWT authentication, REST APIs, RBAC middleware
- Database: PostgreSQL schema with indexes, audit fields, soft delete support, and seed data

## Project Structure

```text
frontend/      React application
backend/       Express REST API
database/      PostgreSQL schema and seed data
```

## Quick Start

```bash
pnpm install
pnpm dev
```

Frontend defaults to `http://localhost:5175`.
Backend defaults to `http://localhost:4000/api`.

## Demo Accounts

- Admin: `admin@eventflow.test` / `password123`
- Organizer: `organizer@eventflow.test` / `password123`
- Attendee: `attendee@eventflow.test` / `password123`

## Environment

Copy the sample files and adjust for your deployment:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

## Mobile installation

The production build is an installable Progressive Web App (PWA). After opening
the HTTPS deployment on a phone, use **Install app** on Android or **Add to Home
Screen** in Safari on iOS. The QR scanner requires camera permission and HTTPS.

## Deployment

- Recommended: deploy the repository with the root `render.yaml`. The Express
  service hosts both the API and the built frontend from one public HTTPS URL.
- Alternative: deploy `frontend/` to Vercel and `backend/` to Railway or Render.
  Set `VITE_API_URL` to the public API URL before building the frontend and set
  `CORS_ORIGIN` to the public frontend origin on the backend.
- PostgreSQL reference schema and seed data are in `database/`.

The current API uses an in-memory demo store. Data changes persist while the
service is running but reset when the backend restarts. Connect the route layer
to PostgreSQL before using the system for live operational records.
