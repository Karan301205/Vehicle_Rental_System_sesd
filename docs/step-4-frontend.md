# Step 4 - Frontend

## What This Step Implements

This step converts the frontend scaffold into a real application shell for WheelCheck:

- auth context with persistent session storage
- API integration layer
- route-aware role gating
- premium landing page
- login and registration flows
- live vehicle listing and filtering
- booking request page
- customer booking dashboard
- admin operations dashboard

## Frontend Structure

```text
frontend/src
├── api
│   ├── auth.js
│   ├── bookings.js
│   ├── client.js
│   └── vehicles.js
├── components/common
│   ├── AuthGate.jsx
│   ├── Button.jsx
│   ├── EmptyState.jsx
│   ├── InputField.jsx
│   ├── LoadingState.jsx
│   ├── MessageBanner.jsx
│   ├── PageShell.jsx
│   ├── SectionCard.jsx
│   ├── SelectField.jsx
│   ├── StatusBadge.jsx
│   └── VehicleCard.jsx
├── hooks
│   └── useAuth.js
├── layouts
│   └── RootLayout.jsx
├── lib
│   ├── constants.js
│   └── formatters.js
├── pages
│   ├── AdminDashboardPage.jsx
│   ├── BookingPage.jsx
│   ├── CustomerDashboardPage.jsx
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   └── VehicleListingPage.jsx
├── routes
│   └── router.jsx
├── store
│   └── AuthContext.jsx
├── App.jsx
├── main.jsx
└── styles
    └── index.css
```

## UI Direction

- neutral premium palette
- soft shadows and rounded panels
- image-first listing cards
- restrained motion using Framer Motion only where helpful
- fully responsive dashboard and marketplace layouts

## Frontend Features Added

### Authentication

- login and registration forms connected to backend auth endpoints
- token and user persisted in local storage
- session hydration on refresh through `/api/auth/me`

### Route Protection

- `AuthGate` for authenticated routes
- role-aware gating for customer and admin dashboards

### Customer Experience

- browse available vehicles
- filter by type, brand, and price range
- open booking page from any vehicle card
- create booking requests
- view and cancel eligible bookings

### Admin Experience

- review all bookings
- approve pending bookings
- add vehicles to fleet with subtype-specific fields

## Verification

Frontend build is used as the main automated verification gate for this step.

## Next Step

Step 5 will connect the system end-to-end more tightly:

- stronger frontend-backend integration polish
- UX refinement and error handling
- optional local seed flow
- final project documentation updates
