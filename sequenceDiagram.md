# Sequence Diagram — WheelCheck

## Main Flow: End-to-End Vehicle Rental (Admin Adds Vehicle → Customer Books → Admin Approves)

This sequence diagram illustrates the complete lifecycle of a rental transaction on the WheelCheck platform — from fleet management to booking confirmation.

---

```mermaid
sequenceDiagram
    actor A as Admin
    actor C as Customer
    participant FE as Frontend (React)
    participant API as API Gateway
    participant Auth as Auth Service
    participant VS as Vehicle Service
    participant BS as Booking Service
    participant PS as Pricing Strategy
    participant NS as Notification Service
    participant DB as PostgreSQL

    Note over A, DB: Phase 1 — Admin Adds Vehicle to Fleet

    A ->> FE: Add New Vehicle (Car/Bike)
    FE ->> API: POST /api/vehicles
    API ->> Auth: Validate JWT
    Auth -->> API: Token valid (role: ADMIN)
    API ->> VS: addVehicle(vehicleDto)
    VS ->> DB: INSERT INTO vehicles (status=AVAILABLE)
    DB -->> VS: Vehicle Created (ID: 101)
    VS -->> API: Success
    API -->> FE: 201 Created
    FE -->> A: "Vehicle Added Successfully"

    Note over C, DB: Phase 2 — Customer Searches & Books

    C ->> FE: Search for vehicles (Date Range)
    FE ->> API: GET /api/vehicles/search
    API ->> VS: findAvailableVehicles(startDate, endDate)
    VS ->> DB: SELECT * FROM vehicles WHERE status='AVAILABLE'
    DB -->> VS: List of Vehicles
    VS -->> API: Returns Vehicle List
    API -->> FE: Display Cars/Bikes

    C ->> FE: Select Vehicle & Click "Book Now"
    FE ->> API: POST /api/bookings
    API ->> Auth: Validate JWT
    Auth -->> API: Token valid (role: CUSTOMER)
    API ->> BS: createBooking(bookingDto)
    
    BS ->> PS: calculateTotalCost(baseRate, hours)
    PS -->> BS: Returns Total Price (Strategy Pattern)
    
    BS ->> DB: INSERT INTO bookings (status=PENDING)
    DB -->> BS: Booking Created (ID: 500)
    BS -->> API: Booking Request Sent
    API -->> FE: 201 Created
    FE -->> C: "Booking Pending Approval"

    Note over A, DB: Phase 3 — Admin Approves Booking

    A ->> FE: View Pending Bookings
    FE ->> API: GET /api/bookings?status=PENDING
    API ->> BS: getPendingBookings()
    BS ->> DB: SELECT * FROM bookings WHERE status='PENDING'
    DB -->> BS: List of Requests
    BS -->> API: Returns Requests
    FE -->> A: Displays Request #500

    A ->> FE: Click "Approve"
    FE ->> API: PATCH /api/bookings/500/approve
    API ->> Auth: Validate JWT (role: ADMIN)
    API ->> BS: approveBooking(500)
    BS ->> DB: UPDATE bookings SET status='CONFIRMED'
    BS ->> DB: UPDATE vehicles SET status='RENTED'
    DB -->> BS: Success

    Note over BS, DB: Phase 4 — System Notification

    BS ->> NS: sendConfirmation(userId, bookingId)
    NS ->> DB: Log Notification
    NS -->> API: Notification Sent
    API -->> FE: 200 OK
    FE -->> A: "Booking Approved"
    
    NS -->> C: Email/SMS: "Your rental is confirmed!"
```
## Flow Summary

| Phase | Description | Key Patterns Used |
|-------|------------|-------------------|
| 1. Fleet Management | Admin adds a new vehicle (Car or Bike) after authentication. The system stores specific attributes based on the vehicle type. | Factory Pattern (to create Car vs Bike objects) |
| 2. Search & Pricing | Customer browses inventory. When booking, the system calculates price dynamically based on rules (e.g., weekend rates). | Strategy Pattern (for pricing logic) |
| 3. Booking Request | The booking is created with a "PENDING" state. It does not block the schedule until confirmed to avoid conflicts. | State Pattern (Managing Booking Status) |
| 4. Approval & Notify | Admin reviews and confirms the request. The system updates the vehicle status to "RENTED" and triggers a notification. | Observer Pattern (Notification trigger) |
