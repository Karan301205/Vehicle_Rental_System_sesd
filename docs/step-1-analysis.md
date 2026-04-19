# Step 1 - Analysis

## System Summary

WheelCheck is a full-stack vehicle rental platform with two user roles:

- `ADMIN`: manages vehicles, reviews bookings, and controls fleet availability
- `CUSTOMER`: browses vehicles, checks availability, creates bookings, and tracks booking history

The implementation will follow these architectural rules:

- Frontend: `React + Vite + Tailwind CSS + Framer Motion`
- Backend: `Node.js + Express`
- Architecture: `Controller -> Service -> Repository`
- Database: `PostgreSQL`
- Auth: `JWT`
- Vehicle modeling: abstract `Vehicle` base class with `Car` and `Bike` subclasses
- Pricing: `PricingStrategy` abstraction with `StandardPricingStrategy` and `SurgePricingStrategy`

## Design Decisions Derived From Templates

### 1. Domain Model

The class diagram establishes the core domain:

- `User`
- abstract `Vehicle`
- `Car extends Vehicle`
- `Bike extends Vehicle`
- `Booking`
- optional `Payment`, `Review`, and `MaintenanceLog`

For the first production build, the mandatory runtime entities are:

- `User`
- `Vehicle`
- `Booking`

The following will be scaffolded cleanly for later expansion:

- `Payment`
- `Review`
- `MaintenanceLog`

### 2. Vehicle Storage Strategy

The ER diagram requires a single `vehicles` table with:

- `type` discriminator: `CAR | BIKE`
- `specific_attributes` JSONB column for subtype fields

This means:

- PostgreSQL stores all vehicles in one table
- repository layer maps raw rows into domain subclasses
- service layer remains polymorphic and does not rely on raw JSON directly

### 3. Booking Lifecycle

The supported lifecycle will be:

- `PENDING`
- `CONFIRMED`
- `ACTIVE`
- `COMPLETED`
- `CANCELLED`

The class diagram includes `REJECTED`, but the mandatory feature list only requires the five states above. To stay aligned with the project brief, we will:

- keep the database and backend focused on the five required states
- treat admin rejection as a controlled transition to `CANCELLED` unless you later want a dedicated `REJECTED` state

### 4. Double-Booking Prevention

The booking engine must reject overlaps for the same vehicle when an existing booking is in one of these blocking states:

- `PENDING`
- `CONFIRMED`
- `ACTIVE`

Overlap rule:

- a new booking conflicts when `requested_start < existing_end` and `requested_end > existing_start`

### 5. Pricing Strategy

Pricing will be handled in the service layer through a strategy abstraction:

- `PricingStrategy`
- `StandardPricingStrategy`
- `SurgePricingStrategy`

The vehicle classes remain responsible for subtype-aware adjustments, while the selected pricing strategy applies rate policy rules.

Practical split:

- `Vehicle` subclass computes subtype-aware base rental amount
- `PricingStrategy` modifies final price based on business conditions

### 6. RBAC

Authorization rules:

- public: register, login, browse visible vehicles, availability search
- customer-only: create booking, cancel own booking, view own booking history
- admin-only: create/update/delete vehicles, view all bookings, approve bookings

## Proposed Production Folder Structure

```text
WheelCheck/
  backend/
    src/
      config/
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
      services/
      utils/
      app.js
      server.js
    prisma-or-sql/
    package.json
    .env.example
  frontend/
    src/
      api/
      components/
      features/
        auth/
        vehicles/
        bookings/
        admin/
      hooks/
      layouts/
      lib/
      pages/
      routes/
      store/
      styles/
      App.jsx
      main.jsx
    package.json
    .env.example
  docs/
    step-1-analysis.md
  README.md
```

## Backend Architectural Mapping

### Controllers

- accept request and validate input
- delegate to services
- translate domain/service errors into HTTP responses

### Services

- implement business rules
- enforce RBAC-aware logic when needed
- prevent booking conflicts
- compute rental pricing
- convert repository rows to domain entities

### Repositories

- isolate PostgreSQL access
- expose clean interfaces for services
- map `specific_attributes` JSONB data into domain-safe structures

## Initial API Surface

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Vehicles

- `GET /api/vehicles`
- `GET /api/vehicles/:id`
- `GET /api/vehicles/availability/search`
- `POST /api/vehicles`
- `PATCH /api/vehicles/:id`
- `DELETE /api/vehicles/:id`

### Bookings

- `POST /api/bookings`
- `GET /api/bookings/me`
- `PATCH /api/bookings/:id/cancel`
- `GET /api/admin/bookings`
- `PATCH /api/admin/bookings/:id/approve`

## UI Direction Based On Reference Screenshot

The UI will follow a premium minimal marketplace feel:

- soft neutral background
- compact filter sidebar
- vehicle cards with image-first layout
- restrained shadows and borders
- subtle motion only for page entrances, hover lift, and list transitions
- responsive dashboard shells for customer and admin views

## Assumptions Confirmed For Build

- deployment target: `Vercel`
- payment integration: none for initial release
- current design files act as templates, so we may refine details while preserving the main idea

## What Step 2 Will Produce

Step 2 will create:

- backend and frontend workspace structure
- environment templates
- database schema and SQL bootstrap
- package manifests
- base Express and React app entry points
