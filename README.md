# WheelCheck 

> A robust, full-stack Vehicle Rental System designed with strict OOP principles and scalable system architecture.

## Project Overview
**WheelCheck** is a vehicle rental platform that streamlines the process of booking cars and bikes. The system is engineered to demonstrate core **Software Engineering** concepts, focusing heavily on backend architecture, **Polymorphism** (handling different vehicle types), and **State Management** (handling complex booking lifecycles).

## Design Documentation (Milestone 1)
This repository contains the core system design documents submitted for the **SESD Project Milestone-1**:

| Document | Description |
| :--- | :--- |
| **[Project Idea](./idea.md)** | Detailed scope, features, and RBAC breakdown. |
| **[Use Case Diagram](./useCaseDiagram.md)** | Actor interactions and system boundaries (Admin vs. Customer). |
| **[Class Diagram](./classDiagram.md)** | **(Core Scoring)** OOP structure, inheritance hierarchy, and design patterns. |
| **[Sequence Diagram](./sequenceDiagram.md)** | End-to-end flow of a booking transaction (Happy Path). |
| **[ER Diagram](./ErDiagram.md)** | Database schema, relationships, and polymorphic storage. |

## Tech Stack
- **Frontend**: React.js, TailwindCSS
- **Backend**: Node.js (Express) / Java (Spring Boot)
- **Database**: PostgreSQL
- **Architecture**: MVC with Repository Pattern

## Key Features
1. **Role-Based Access Control (RBAC)**: Secure separation between Admin (Fleet Mgmt) and Customer (Booking) dashboards.
2. **Polymorphic Inventory**: `Car` and `Bike` classes inherit from a base `Vehicle` class but implement unique pricing logic.
3. **Smart Booking Engine**: Prevents double-booking via transactional locking and status checks.
4. **Dynamic Pricing Strategy**: Extensible pricing logic (Standard vs. Surge pricing) using the Strategy Pattern.

---
