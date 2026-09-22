# GovConnect

Government Appointment Management System. Public pages do not require login. A preferred date is a request, not a confirmed slot.

## Local run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local` and set `MONGODB_URI`, `MONGODB_DB`, and `SMTP_PASSWORD`. Do not commit `.env.local`.

## Demo sign-in

Password for seeded accounts is `GovConnect@2026`.

| Portal | Email |
| --- | --- |
| Citizen | `priya.sharma@example.in` |
| Official | `rev-1101@govconnect.gov.in` |
| Front desk | `fd-1101@govconnect.gov.in` |
| Admin | `adm-1101@govconnect.gov.in` (super), `adm-2101@govconnect.gov.in`, `adm-3101@govconnect.gov.in` |

## API

Same-origin Next.js routes under `/api`. Leave `NEXT_PUBLIC_API_BASE_URL` empty on Vercel so the app calls its own API.

Auth routes: `POST /api/auth/login`, `POST /api/auth/register`, `POST /api/auth/logout`, `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`, `POST /api/auth/confirm-email`, `POST /api/auth/profile`.

New citizen registrations receive a confirmation email. Sign-in works after the email link is opened.

## Database

Appointments, admin config, accounts, and grievances persist in MongoDB Atlas (`MONGODB_DB`, default `govconnect`).

| Collection | Create | Read | Update | Delete |
| --- | --- | --- | --- | --- |
| `appointments` | `POST /api/appointments` | `GET /api/appointments`, `GET /api/appointments/:id`, `POST /api/appointments/track` | `POST /api/appointments/:id/actions` (also `PUT`/`PATCH` on `:id`) | Not hard-deleted. Status changes keep the same ID. |
| `accounts` | `POST /api/auth/register` | Login via `POST /api/auth/login` | Profile and password reset | Not hard-deleted |
| `grievances` | `POST /api/grievances` | `GET /api/grievances` (admin) | — | Not hard-deleted |
| `admin` | Seeded as `_id: config` | `GET /api/admin` | `POST /api/admin` | Config document is replaced, not dropped |

On Vercel, add `MONGODB_URI`, `MONGODB_DB`, `APP_URL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and `SMTP_FROM` in project settings. Use the production URL for `APP_URL`, for example `https://govconnect-black.vercel.app`.
