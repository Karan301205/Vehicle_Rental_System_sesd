# Step 3 - Backend

## What This Step Implements

This step turns the backend scaffold into a working Clean Architecture backend for WheelCheck:

- domain entities and enums
- abstract vehicle hierarchy with inheritance
- pricing strategy abstraction and implementations
- PostgreSQL repositories
- services for auth, vehicles, and bookings
- controllers and route modules
- JWT authentication middleware
- request validation
- automated service-level tests

## Architecture Mapping

### Domain Layer

- `User`
- abstract `Vehicle`
- `Car extends Vehicle`
- `Bike extends Vehicle`
- `Booking`
- `VehicleFactory`

### Strategy Pattern

- `PricingStrategy`
- `StandardPricingStrategy`
- `SurgePricingStrategy`

### Repository Layer

- `IUserRepository`
- `IVehicleRepository`
- `IBookingRepository`
- `PostgresUserRepository`
- `PostgresVehicleRepository`
- `PostgresBookingRepository`

### Service Layer

- `AuthService`
- `VehicleService`
- `BookingService`

### Delivery Layer

- `AuthController`
- `VehicleController`
- `BookingController`
- auth, vehicle, booking, and admin routes
- auth and role middleware

## Backend Folder Structure

```text
backend/src
├── app.js
├── server.js
├── config
│   ├── database.js
│   └── env.js
├── controllers
│   ├── AuthController.js
│   ├── BookingController.js
│   └── VehicleController.js
├── domain
│   ├── entities
│   │   ├── Bike.js
│   │   ├── Booking.js
│   │   ├── Car.js
│   │   ├── User.js
│   │   ├── Vehicle.js
│   │   └── VehicleFactory.js
│   ├── enums
│   │   ├── booking-status.js
│   │   ├── user-role.js
│   │   ├── vehicle-status.js
│   │   └── vehicle-type.js
│   └── strategies
│       ├── PricingStrategy.js
│       ├── StandardPricingStrategy.js
│       └── SurgePricingStrategy.js
├── dto
│   ├── auth-schemas.js
│   ├── booking-schemas.js
│   └── vehicle-schemas.js
├── middleware
│   ├── authenticate.js
│   ├── require-role.js
│   └── validate-request.js
├── repositories
│   ├── interfaces
│   │   ├── IBookingRepository.js
│   │   ├── IUserRepository.js
│   │   └── IVehicleRepository.js
│   └── postgres
│       ├── PostgresBookingRepository.js
│       ├── PostgresUserRepository.js
│       ├── PostgresVehicleRepository.js
│       └── mappers.js
├── routes
│   ├── admin-routes.js
│   ├── auth-routes.js
│   ├── booking-routes.js
│   ├── index.js
│   └── vehicle-routes.js
├── services
│   ├── AuthService.js
│   ├── BookingService.js
│   ├── VehicleService.js
│   └── __tests__
│       ├── auth-service.test.js
│       ├── booking-service.test.js
│       └── vehicle-factory.test.js
└── utils
    ├── app-error.js
    ├── async-handler.js
    └── jwt.js
```

## Implemented API Surface

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Vehicles

- `GET /api/vehicles`
- `GET /api/vehicles/search`
- `GET /api/vehicles/:id`
- `POST /api/vehicles`
- `PATCH /api/vehicles/:id`
- `DELETE /api/vehicles/:id`

### Customer Bookings

- `POST /api/bookings`
- `GET /api/bookings/me`
- `PATCH /api/bookings/:id/cancel`

### Admin

- `GET /api/admin/bookings`
- `PATCH /api/admin/bookings/:id/approve`

## Core Business Rules Added

### RBAC

- admin-only vehicle management
- admin-only booking approval
- customer-only booking creation and self-service cancellation

### Vehicle Inheritance

- all vehicles are created through `VehicleFactory`
- `Car` and `Bike` each override `calculateRentalCost()`

### Booking Conflict Detection

- bookings are blocked when the same vehicle overlaps in:
  - `PENDING`
  - `CONFIRMED`
  - `ACTIVE`

### Pricing

- standard pricing for normal bookings
- surge pricing applied automatically for weekend start times

## Verification

Commands run successfully:

- `npm run test --workspace backend`
- backend route composition import check

Automated tests currently cover:

- auth registration flow
- booking total calculation
- overlap rejection
- admin approval transition
- vehicle factory polymorphism

## Next Step

Step 4 will build the real frontend application layer:

- reusable UI components
- auth flows
- vehicle listing experience
- booking form flow
- customer dashboard
- admin dashboard
- API integration and state handling
