# Project Name: WheelCheck - Vehicle Rental System

## Project Description
WheelCheck is a full-stack vehicle rental platform designed to streamline the process of renting cars and bikes. The system caters to two primary user roles: **Customers**, who can browse and book vehicles, and **Administrators**, who manage the fleet inventory and booking approvals. 

The core focus of this project is on robust backend architecture, implementing strict Object-Oriented Programming (OOP) principles to handle vehicle polymorphism, booking state management, and dynamic pricing strategies.

## Scope
The application will handle the end-to-end flow of a rental transaction:
1.  **Inventory Management:** Adding and tracking various types of vehicles with distinct attributes.
2.  **Booking Lifecycle:** Managing the reservation timeline from request to completion.
3.  **User Management:** Role-based access control for security.
4.  **Billing Engine:** Calculating costs based on vehicle type and rental duration.

## Key Features

### 1. User Roles (RBAC)
* **Admin:** * Add/Update/Remove vehicles from the fleet.
    * View all active bookings and history.
    * Approve or reject booking requests.
* **Customer:** * Browse available vehicles with filters (type, price, brand).
    * Check availability for specific dates.
    * Book a vehicle and view booking history.

### 2. Vehicle Management (OOP Implementation)
* Support for multiple vehicle types (e.g., Cars, Bikes, SUVs).
* Utilization of **Inheritance** to share common attributes (License Plate, Model) while maintaining specific attributes (Trunk Size vs. Helmet type).

### 3. Smart Booking System
* **Conflict Detection:** Prevents double-booking of the same vehicle for overlapping dates.
* **State Management:** Tracks booking status (Pending -> Confirmed -> Active -> Completed/Cancelled).

### 4. Pricing Engine
* Base price calculation per day/hour.
* Extensible design to support dynamic pricing (e.g., higher rates on weekends) using Strategy Pattern.
