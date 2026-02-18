# ER Diagram — WheelCheck

## Overview

This Entity-Relationship diagram represents the relational database schema for **WheelCheck**. 
It is designed to handle **Single-Table Inheritance** for vehicles (storing Cars and Bikes in one fleet table with discriminators), rigorous **Booking State Management**, and **Financial auditing**.

---

```mermaid
erDiagram

    USERS {
        uuid id PK
        varchar email UK
        varchar password_hash
        varchar full_name
        enum role "ADMIN | CUSTOMER"
        varchar license_number
        boolean is_active
        timestamp created_at
    }

    VEHICLES {
        uuid id PK
        varchar brand
        varchar model
        int year
        varchar plate_number UK
        enum type "CAR | BIKE"
        enum status "AVAILABLE | RENTED | MAINTENANCE"
        decimal base_rate_per_hour
        jsonb specific_attributes "stores trunk_size, helmet_type, etc."
        timestamp created_at
    }

    BOOKINGS {
        uuid id PK
        uuid user_id FK
        uuid vehicle_id FK
        timestamp start_time
        timestamp end_time
        decimal total_amount
        enum status "PENDING | CONFIRMED | ACTIVE | COMPLETED | CANCELLED"
        timestamp created_at
        timestamp updated_at
    }

    PAYMENTS {
        uuid id PK
        uuid booking_id FK
        decimal amount
        enum method "CREDIT_CARD | UPI | WALLET"
        enum status "SUCCESS | FAILED | REFUNDED"
        varchar transaction_ref
        timestamp payment_date
    }

    MAINTENANCE_LOGS {
        uuid id PK
        uuid vehicle_id FK
        text description
        decimal cost
        timestamp maintenance_date
        varchar serviced_by
    }

    REVIEWS {
        uuid id PK
        uuid booking_id FK
        uuid user_id FK
        int rating
        text comment
        timestamp created_at
    }

    %% ===== RELATIONSHIPS =====

    USERS ||--o{ BOOKINGS : "places"
    USERS ||--o{ REVIEWS : "writes"

    VEHICLES ||--o{ BOOKINGS : "is_rented_in"
    VEHICLES ||--o{ MAINTENANCE_LOGS : "undergoes"

    BOOKINGS ||--|| PAYMENTS : "generates"
    BOOKINGS ||--o| REVIEWS : "receives"
```
## Table Summary

| Table | Description | Key Relationships |
|-------|------------|------------------|
| USERS | Stores all system actors. The `role` column distinguishes Admins from Customers. | → Bookings, Reviews |
| VEHICLES | **Polymorphic Table.** Stores both Cars and Bikes. Uses `type` as a discriminator and `specific_attributes` (JSONB) for subclass data like `trunk_size` or `helmet_type`. | → Bookings, Maintenance Logs |
| BOOKINGS | The core transactional table linking Users and Vehicles. Tracks the lifecycle state (Pending → Confirmed). | ← User, Vehicle <br> → Payment |
| PAYMENTS | Financial records linked 1:1 with Bookings. | ← Booking |
| MAINTENANCE_LOGS | Tracks vehicle service history. Essential for the Admin's fleet management dashboard. | ← Vehicle |

## Key Indexes

| Table | Index | Purpose |
|-------|-------|---------|
| USERS | (`email`) | Fast lookup during Login/Auth. |
| VEHICLES | (`status`, `type`) | Optimizes the "Search Available Cars/Bikes" query. |
| BOOKINGS | (`vehicle_id`, `start_time`, `end_time`) | **Critical Index:** Used to detect overlap and prevent double-booking. |
| BOOKINGS | (`user_id`, `status`) | Quickly fetch "My Active Bookings" for customers. |
| PAYMENTS | (`booking_id`) | Fast retrieval of payment status for a specific rental. |
