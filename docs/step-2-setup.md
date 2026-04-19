# Step 2 - Setup

## What This Step Creates

This step establishes the production foundation for WheelCheck:

- monorepo workspace structure
- backend Express bootstrap
- frontend React + Vite bootstrap
- Tailwind styling foundation
- PostgreSQL schema bootstrap
- environment variable templates

## Folder Structure

```text
WheelCheck/
  backend/
    package.json
    .env.example
    sql/
      schema.sql
    src/
      app.js
      server.js
      config/
        database.js
        env.js
      controllers/
      domain/
        entities/
        enums/
        strategies/
      dto/
      middleware/
      repositories/
        interfaces/
        postgres/
      routes/
        index.js
      services/
      utils/
  frontend/
    package.json
    .env.example
    index.html
    vite.config.js
    postcss.config.js
    tailwind.config.js
    src/
      App.jsx
      main.jsx
      api/
      assets/
      components/
        common/
          PageShell.jsx
      features/
        admin/
        auth/
        bookings/
        vehicles/
      hooks/
      layouts/
        RootLayout.jsx
      lib/
      pages/
        AdminDashboardPage.jsx
        BookingPage.jsx
        CustomerDashboardPage.jsx
        HomePage.jsx
        LoginPage.jsx
        RegisterPage.jsx
        VehicleListingPage.jsx
      routes/
        router.jsx
      store/
      styles/
        index.css
  docs/
    step-1-analysis.md
    step-2-setup.md
  package.json
  .gitignore
```

## Setup Decisions

### Root Workspace

- uses npm workspaces for `backend` and `frontend`
- supports running both apps together with one command

### Backend

- Express app bootstrapped with `helmet`, `cors`, `morgan`
- environment validation handled with `zod`
- PostgreSQL accessed through `pg`
- route bootstrap added at `/api`

### Database

- single-table vehicle inheritance implemented with `type` and `specific_attributes JSONB`
- booking lifecycle constrained using PostgreSQL enums
- indexes added for auth lookup, search, and conflict detection

### Frontend

- Vite + React setup with route scaffolding for all required pages
- Tailwind theme tuned for a premium neutral aesthetic inspired by the reference screenshot
- Framer Motion used only for subtle page transition motion

## Code Added

Key setup files added in this step:

- root workspace config: `package.json`, `.gitignore`
- backend bootstrap: `backend/src/app.js`, `backend/src/server.js`
- backend config: `backend/src/config/env.js`, `backend/src/config/database.js`
- backend schema: `backend/sql/schema.sql`
- frontend bootstrap: `frontend/index.html`, `frontend/src/main.jsx`, `frontend/src/App.jsx`
- frontend routing/layout: `frontend/src/routes/router.jsx`, `frontend/src/layouts/RootLayout.jsx`
- frontend UI scaffolds: `frontend/src/pages/*.jsx`
- frontend styling: `frontend/tailwind.config.js`, `frontend/src/styles/index.css`

## Next Step

Step 3 will implement the backend domain layer in depth:

- enums
- abstract vehicle model and subclasses
- pricing strategy classes
- repository interfaces
- PostgreSQL repositories
- services
- controllers
- auth middleware
- API routes
