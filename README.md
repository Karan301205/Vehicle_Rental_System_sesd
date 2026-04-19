# WheelCheck

WheelCheck is a production-oriented full-stack vehicle rental system built with:

- Frontend: `React + Vite + Tailwind CSS + Framer Motion`
- Backend: `Node.js + Express`
- Database: `PostgreSQL`
- Auth: `JWT`
- Architecture: `Controller -> Service -> Repository`

## Live hosted link: https://vehicle-rental-system-sesd-frontend.vercel.app/

## Core Capabilities

- RBAC for `ADMIN` and `CUSTOMER`
- Abstract `Vehicle` model with `Car` and `Bike` inheritance
- Booking lifecycle: `PENDING -> CONFIRMED -> ACTIVE -> COMPLETED / CANCELLED`
- Dynamic pricing via strategy pattern
- Admin fleet management and booking approval
- Customer browsing, booking, and booking history

## Project Docs

- [Project Idea](./idea.md)
- [Use Case Diagram](./useCaseDiagram.md)
- [Class Diagram](./classDiagram.md)
- [Sequence Diagram](./sequenceDiagram.md)
- [ER Diagram](./ErDiagram.md)
- [Step 1 - Analysis](./docs/step-1-analysis.md)
- [Step 2 - Setup](./docs/step-2-setup.md)
- [Step 3 - Backend](./docs/step-3-backend.md)
- [Step 4 - Frontend](./docs/step-4-frontend.md)
- [Step 5 - Integration](./docs/step-5-integration.md)

## Local Development

Run the app locally with seeded in-memory development data:

```bash
npm install
npm run dev:local
```

Local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

## Demo Credentials

- Admin: `admin@wheelcheck.dev` / `secret123`
- Customer: `customer@wheelcheck.dev` / `secret123`

## Verification

Run backend automated tests:

```bash
npm run test --workspace backend
```

Run frontend production build:

```bash
npm run build --workspace frontend
```

## Notes

- Production deployments should use a real PostgreSQL database.
- Local in-memory mode exists to make development and demo verification easy in environments where PostgreSQL is not installed.

