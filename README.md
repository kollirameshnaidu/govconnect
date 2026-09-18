# GovConnect

Government Appointment Management System. Public pages do not require login. A preferred date is a request, not a confirmed slot.

## Local run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo sign-in

OTP is `123456`.

| Portal | ID |
| --- | --- |
| Citizen | `9876543210` |
| Official | `REV-1101` |
| Front desk | `FD-1101` |
| Admin | `ADM-1101` (super), `ADM-2101` (department), `ADM-3101` (district) |

## API

Same-origin Next.js routes under `/api`. Leave `NEXT_PUBLIC_API_BASE_URL` empty on Vercel so the app calls its own API.
