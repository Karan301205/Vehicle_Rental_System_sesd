# Class Diagram — WheelCheck

## Overview

This class diagram represents the core domain models and architectural layers of the **WheelCheck** Vehicle Rental System.
The design adheres to **Clean Architecture**, utilizing **Abstract Base Classes** for the vehicle hierarchy to demonstrate strict **OOP Inheritance** and **Design Patterns** for scalable pricing logic.

---

```mermaid
classDiagram
    direction TB

    %% ===== DOMAIN MODELS (ENTITIES) =====

    class User {
        -id: string
        -email: string
        -passwordHash: string
        -fullName: string
        -role: UserRole
        -licenseNumber: string
        -isActive: boolean
        -createdAt: Date
        +register(): void
        +login(): string
        +updateProfile(): void
    }

    class UserRole {
        <<enumeration>>
        ADMIN
        CUSTOMER
    }

    %% --- INHERITANCE HIERARCHY ---

    class Vehicle {
        <<abstract>>
        -id: string
        -brand: string
        -model: string
        -year: int
        -plateNumber: string
        -isAvailable: boolean
        -baseRatePerHour: double
        -status: VehicleStatus
        +markAsRented(): void
        +markAsAvailable(): void
        +calculateRentalCost(hours: int)* double
    }

    class Car {
        -trunkSize: double
        -doors: int
        -hasAC: boolean
        +calculateRentalCost(hours: int) double
    }

    class Bike {
        -helmetType: string
        -engineCapacity: int
        +calculateRentalCost(hours: int) double
    }

    class VehicleStatus {
        <<enumeration>>
        AVAILABLE
        RENTED
        MAINTENANCE
    }

    class Booking {
        -id: string
        -userId: string
        -vehicleId: string
        -startTime: Date
        -endTime: Date
        -totalAmount: double
        -status: BookingStatus
        -createdAt: Date
        +confirm(): void
        +cancel(): void
        +complete(): void
    }

    class BookingStatus {
        <<enumeration>>
        PENDING
        CONFIRMED
        ACTIVE
        COMPLETED
        CANCELLED
        REJECTED
    }

    class Payment {
        -id: string
        -bookingId: string
        -amount: double
        -method: PaymentMethod
        -status: PaymentStatus
        -timestamp: Date
        +processPayment(): void
    }

    class PaymentMethod {
        <<enumeration>>
        CREDIT_CARD
        UPI
        WALLET
    }

    %% ===== SERVICE LAYER (BUSINESS LOGIC) =====

    class UserService {
        -userRepo: IUserRepository
        +authenticate(email, password): string
        +createUser(userDto): User
    }

    class VehicleService {
        -vehicleRepo: IVehicleRepository
        +addVehicle(vehicle): void
        +getAvailableVehicles(dateRange): List~Vehicle~
        +maintainVehicle(id): void
    }

    class BookingService {
        -bookingRepo: IBookingRepository
        -pricingStrategy: IPricingStrategy
        +createBooking(req): Booking
        +approveBooking(id): void
    }

    %% ===== STRATEGY PATTERN (POLYMORPHISM) =====

    class IPricingStrategy {
        <<interface>>
        +calculatePrice(baseRate, duration): double
    }

    class StandardPricing {
        +calculatePrice(baseRate, duration): double
    }

    class SurgePricing {
        -multiplier: double
        +calculatePrice(baseRate, duration): double
    }

    %% ===== REPOSITORY LAYER (DATA ACCESS) =====

    class IUserRepository {
        <<interface>>
        +findByEmail(email): User
        +save(user): User
    }

    class IVehicleRepository {
        <<interface>>
        +findAllAvailable(): List~Vehicle~
        +save(vehicle): Vehicle
        +delete(id): void
    }

    class IBookingRepository {
        <<interface>>
        +findById(id): Booking
        +save(booking): Booking
        +updateStatus(id, status): void
    }

    %% ===== RELATIONSHIPS =====

    %% General Associations
    User --> UserRole
    Booking --> BookingStatus
    Payment --> PaymentMethod
    Vehicle --> VehicleStatus

    %% Direct Relationships
    User "1" --> "*" Booking : makes
    Vehicle "1" --> "*" Booking : is_rented_in
    Booking "1" --> "1" Payment : triggers

    %% Inheritance (The Core OOP Requirement)
    Vehicle <|-- Car : extends
    Vehicle <|-- Bike : extends

    %% Strategy Pattern Implementation
    BookingService --> IPricingStrategy : uses
    IPricingStrategy <|.. StandardPricing : implements
    IPricingStrategy <|.. SurgePricing : implements

    %% Layer Dependencies
    UserService --> IUserRepository
    VehicleService --> IVehicleRepository
    BookingService --> IBookingRepository
```
## Design Patterns Applied

| Pattern    | Where Applied                                             | Purpose                                                                 |
|------------|----------------------------------------------------------|-------------------------------------------------------------------------|
| Strategy   | IPricingStrategy, StandardPricing, SurgePricing         | Allows switching between pricing logic (e.g., Weekend rates vs Normal rates) without changing code. |
| Factory    | VehicleService (Internal logic)                         | Used to instantiate the correct class (Car vs Bike) based on input data. |
| Repository | IVehicleRepository, IBookingRepository                  | Decouples the business logic from the database implementation.         |
| State      | BookingStatus                                           | Manages the complex lifecycle of a rental (Pending → Confirmed → Active → Completed). |

---

## OOP Principles Applied

| Principle      | Application |
|---------------|------------|
| Inheritance   | Car and Bike inherit common attributes (brand, model, rate) from the abstract Vehicle class to avoid code duplication. |
| Polymorphism  | calculateRentalCost() is defined in Vehicle but overridden in Car (adds AC charges) and Bike (adds helmet fees). |
| Abstraction   | IVehicleRepository hides the complex SQL/Database queries from the Service layer. |
| Encapsulation | All fields (e.g., -passwordHash) are private and accessed only through public methods to protect data integrity. |
