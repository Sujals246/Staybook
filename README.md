# 🏨 StayBook

### Full-Stack Hotel Booking & Reservation Platform

StayBook is a full-stack hotel booking platform built with **Java 17, Spring Boot, React, and MySQL**.

The application implements a complete hotel reservation workflow including **hotel discovery, date-based room availability, temporary inventory reservation, dynamic pricing, JWT authentication, role-based hotel management, Razorpay payments, payment verification, webhooks, refunds, booking cancellation, guest management, and revenue reporting**.

The backend is containerized with **Docker** and deployed on **Render**, the React frontend is deployed on **Vercel**, and the production MySQL database is hosted on **Aiven**.

---

## 🌐 Live Application

**Live Website:**
https://staybook-ivm8tmd1t-sujal-4e62.vercel.app/

**GitHub Repository:**
https://github.com/Sujals246/Staybook

---

# 📌 Project Overview

StayBook is designed around the core engineering challenges involved in a real-world reservation system rather than treating hotel booking as a simple CRUD application.

The system handles:

* Date-based inventory
* Concurrent booking requests
* Temporary room reservations
* Transactional inventory updates
* Dynamic pricing
* Secure authentication
* Role-based authorization
* Payment processing
* Payment verification
* Webhook handling
* Refunds
* Booking cancellation
* Hotel management
* Revenue reporting

The overall booking lifecycle is:

```text
Search
  ↓
Select Hotel & Room
  ↓
Check Availability
  ↓
Initialize Reservation
  ↓
Reserve Inventory
  ↓
Add Guest Details
  ↓
Create Payment Order
  ↓
Complete Payment
  ↓
Verify Payment
  ↓
Confirm Booking
```

---

# ✨ Features

## 👤 Guest Features

### Authentication & Security

* User registration and login
* JWT-based authentication
* Access and refresh token architecture
* HttpOnly refresh-token cookie
* BCrypt password hashing
* Automatic access-token refresh
* Protected REST APIs
* Role-based authorization
* Method-level authorization

### Hotel Discovery

* Search hotels by city
* Date-based availability search
* Room-count based search
* Paginated search results
* Hotel details
* Room information
* Date-specific pricing
* Real-time inventory availability

### Booking

* Multi-day room bookings
* Multiple-room reservations
* Temporary inventory reservation
* Guest information collection
* Booking status tracking
* Booking history
* Booking expiration
* Booking cancellation

### Guest Management

Users can maintain reusable guest information:

* Add guests
* Update guests
* Delete guests
* View saved guests
* Select saved guests during checkout

---

# 💳 Payment System

StayBook integrates **Razorpay** for online payments.

The payment workflow includes:

* Razorpay order creation
* Razorpay Checkout
* Server-side payment verification
* Payment signature verification
* Order validation
* Payment ID validation
* Payment amount validation
* Payment status validation
* Failed-payment handling
* Razorpay webhook processing
* Refund processing

### Payment Flow

```text
Booking
   ↓
Calculate Amount
   ↓
Create Razorpay Order
   ↓
Razorpay Checkout
   ↓
Payment
   ↓
Backend Verification
   ↓
Validate Order / Payment / Amount
   ↓
Confirm Payment
   ↓
Confirm Booking
```

The frontend payment callback is **not treated as sufficient proof of payment**. Payment information is validated on the backend before the booking is confirmed.

---

# 🔔 Razorpay Webhooks

StayBook supports Razorpay webhook processing for payment lifecycle events.

```text
Razorpay
    ↓
Webhook Endpoint
    ↓
Signature Verification
    ↓
Event Processing
    ↓
Update Payment / Booking State
```

Webhook signatures are verified using HMAC-based validation before processing events.

Supported payment-related events include payment success, payment failure, and refund-related events.

---

# 💸 Refund & Cancellation

The booking cancellation flow handles payment state and refund processing.

```text
Confirmed Booking
       ↓
Cancellation Request
       ↓
Validate Booking
       ↓
Check Payment
       ↓
Create Refund
       ↓
Update Payment State
       ↓
Release Inventory
       ↓
Cancel Booking
```

This keeps the booking, payment, refund, and inventory states synchronized through backend business logic.

---

# 🔒 Concurrent Inventory Management

One of the key engineering aspects of StayBook is **concurrency-safe room inventory management**.

Inventory is maintained at the:

> **Room + Date level**

Each inventory record maintains information such as:

```text
Total Inventory
Booked Inventory
Reserved Inventory
Price
Surge Factor
Closed Status
Date
```

Available inventory is calculated as:

```text
Available =
Total Count
- Booked Count
- Reserved Count
```

## Pessimistic Locking

The booking workflow uses transactional database operations with **pessimistic write locking** when modifying critical inventory records.

Conceptually:

```text
User A ───────┐
              │
User B ───────┼──→ Same Room / Same Date
              │
              ▼
        Database Lock
              │
              ▼
      Check Availability
              │
              ▼
       Reserve Inventory
              │
              ▼
        Create Booking
              │
              ▼
       Commit Transaction
```

This prevents concurrent transactions from incorrectly treating the same inventory as available.

---

# ⏳ Temporary Reservation

StayBook does not immediately mark inventory as permanently booked when a user starts the booking process.

Instead:

```text
Available
   ↓
Reserved
   ↓
Payment Pending
   ↓
Confirmed
```

If the booking is not completed within the configured reservation window, the reservation can expire and the inventory can become available again.

This separates **temporary reservation state** from **confirmed booking state**.

---

# 💰 Dynamic Pricing Engine

StayBook implements a composable dynamic pricing system rather than hard-coding every pricing rule into one service method.

The pricing pipeline is conceptually:

```text
Base Price
    ↓
Surge Pricing
    ↓
Occupancy Pricing
    ↓
Urgency Pricing
    ↓
Holiday Pricing
    ↓
Final Price
```

The implementation uses a **Strategy + Decorator-style design**, allowing individual pricing rules to remain independent and composable.

### Pricing Factors

The current implementation considers factors such as:

* Base room price
* Inventory surge factor
* Occupancy
* Booking urgency
* Holiday periods

This architecture makes it easier to introduce additional pricing rules without rewriting the entire pricing engine.

---

# 🏨 Hotel Manager Dashboard

StayBook provides protected hotel-management functionality for users with the manager role.

## Hotel Management

Managers can:

* Create hotels
* View owned hotels
* Update hotel information
* Activate/deactivate hotels
* Delete hotels

## Room Management

Managers can:

* Create rooms
* View rooms
* Delete rooms
* Configure room capacity
* Configure base pricing

## Inventory Management

Managers can:

* Initialize room inventory
* View inventory
* Update inventory
* Configure date ranges
* Close selected dates
* Configure surge factors
* Recalculate pricing

## Booking Management

Managers can:

* View bookings associated with their hotels
* Monitor booking activity
* Access hotel-specific booking information

Ownership validation ensures that managers cannot access management operations for hotels they do not own.

---

# 📊 Revenue Reporting

The manager dashboard provides hotel-level reporting capabilities.

Reports can include:

* Confirmed booking count
* Confirmed revenue
* Average revenue per confirmed booking
* Date-range based reporting

Example:

```text
Hotel
  ↓
Date Range
  ↓
Confirmed Bookings
  ↓
Revenue Calculation
  ↓
Management Report
```

---

# 🔐 Authentication Architecture

StayBook uses **Spring Security + JWT**.

### Authentication Flow

```text
Email + Password
       ↓
AuthenticationManager
       ↓
Validate Credentials
       ↓
Generate Tokens
       ↓
Access Token
       +
Refresh Token
```

The refresh token is stored in an **HttpOnly cookie**, while access tokens are used for authenticated API requests.

Protected requests use:

```http
Authorization: Bearer <access-token>
```

When an access token expires, the frontend can request a new access token through the refresh-token flow.

---

# 👥 Role-Based Authorization

The application supports role-based access control.

Current application roles include:

```text
GUEST
HOTEL_MANAGER
```

Manager-only operations are protected using Spring Security authorization rules and method-level security.

Example:

```java
@PreAuthorize("hasRole('HOTEL_MANAGER')")
```

This prevents normal users from accessing hotel-management operations.

---

# 🏗️ Backend Architecture

StayBook follows a layered Spring Boot architecture.

```text
                    REST Request
                         ↓
                ┌────────────────┐
                │   Controller   │
                └───────┬────────┘
                        ↓
                ┌────────────────┐
                │    Service     │
                └───────┬────────┘
                        ↓
                ┌────────────────┐
                │   Repository   │
                └───────┬────────┘
                        ↓
                ┌────────────────┐
                │ JPA / Hibernate│
                └───────┬────────┘
                        ↓
                ┌────────────────┐
                │     MySQL      │
                └────────────────┘
```

### Controller Layer

Responsible for:

* HTTP request handling
* Request/response mapping
* Validation
* Authorization boundaries

### Service Layer

Contains business logic such as:

* Booking
* Inventory
* Pricing
* Payments
* Refunds
* Hotel management
* Reporting

### Repository Layer

Handles persistence using:

* Spring Data JPA
* Hibernate
* Custom queries
* Transactional locking

---

# 🧩 Design Patterns & Engineering Practices

The project demonstrates several practical software engineering concepts.

### Strategy Pattern

Used for composing individual pricing strategies.

```text
PricingStrategy
      ↓
 ┌────┴─────┬──────────┬──────────┐
 ↓          ↓          ↓          ↓
Surge    Occupancy   Urgency    Holiday
```

### Decorator-Style Composition

Pricing strategies can be wrapped/composed into a pipeline so that additional rules can be added independently.

### DTO Pattern

DTOs are used to separate API contracts from persistence entities.

### Repository Pattern

Spring Data repositories abstract database operations from business logic.

### Transaction Management

Critical booking and inventory operations are performed transactionally.

### Pessimistic Locking

Used to protect high-contention inventory operations.

### BigDecimal

Monetary calculations use `BigDecimal` to avoid floating-point precision problems.

---

# 🗃️ Data Model

The main domain entities include:

```text
User
 │
 ├── Bookings
 ├── Guests
 └── Hotels

Hotel
 │
 ├── Rooms
 ├── Inventory
 └── Bookings

Room
 │
 └── Inventory

Booking
 │
 ├── Guests
 └── Payment
```

Core entities include:

* `User`
* `Hotel`
* `Room`
* `Inventory`
* `Booking`
* `Guest`
* `Payment`
* `HotelContactInfo`
* `HotelMinPrice`

---

# 🖥️ Frontend

The frontend is a **React 19 + Vite** application located in:

```text
staybook-frontend/
```

### Main User Flows

```text
Hotel Search
     ↓
Hotel Details
     ↓
Room Selection
     ↓
Checkout
     ↓
Payment
     ↓
Booking Confirmation
```

### Frontend Areas

* Hotel search
* Hotel details
* Checkout
* Payment
* Booking history
* Profile
* Guest management
* Manager dashboard
* Authentication
* Dark mode

The frontend communicates with the Spring Boot backend through REST APIs.

---

# 📁 Project Structure

```text
Staybook/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── logic/
│   │   │           ├── controller/
│   │   │           ├── Service/
│   │   │           ├── Repository/
│   │   │           ├── entity/
│   │   │           ├── DTO/
│   │   │           ├── security/
│   │   │           ├── strategy/
│   │   │           ├── config/
│   │   │           ├── advice/
│   │   │           ├── exception/
│   │   │           └── utils/
│   │   │
│   │   └── resources/
│   │
│   └── test/
│
├── staybook-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── context/
│   │   ├── assets/
│   │   ├── api.js
│   │   └── App.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── Dockerfile
├── pom.xml
├── mvnw
├── mvnw.cmd
├── payment.html
├── .gitignore
└── README.md
```

---

# 🐳 Dockerization

The Spring Boot backend is containerized using a **multi-stage Docker build**.

### Build Stage

```text
Java 17 JDK
    ↓
Maven Build
    ↓
Spring Boot JAR
```

### Runtime Stage

```text
Java 17 Runtime
    ↓
Application JAR
    ↓
Docker Container
```

This keeps the build environment separate from the runtime image and produces a cleaner deployment artifact.

### Build

```bash
docker build -t staybook-backend .
```

### Run

```bash
docker run -p 10000:10000 staybook-backend
```

---

# ☁️ Cloud Deployment

StayBook is deployed using a multi-service cloud architecture.

```text
                         GitHub
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
           Vercel                    Render
              │                         │
              ▼                         ▼
      React Frontend          Dockerized Spring Boot
                                        │
                                        ▼
                                   Aiven MySQL
                                        │
                          ┌─────────────┴─────────────┐
                          │                           │
                          ▼                           ▼
                       Razorpay                Application Data
```

### Frontend

**Vercel**

Hosts the production React/Vite application.

### Backend

**Render**

Hosts the Dockerized Spring Boot REST API.

### Database

**Aiven**

Provides managed MySQL infrastructure for persistent application data.

### Payments

**Razorpay**

Handles payment processing, verification, webhooks, and refunds.

---

# ⚙️ Configuration

Sensitive credentials are supplied through environment-specific configuration rather than committed to Git.

Typical backend configuration includes:

```properties
spring.datasource.url=
spring.datasource.username=
spring.datasource.password=

jwt.secretKey=

razorpay.key.id=
razorpay.key.secret=
razorpay.webhook.secret=
```

Frontend API configuration:

```text
VITE_API_BASE_URL
```

Production secrets should never be committed to source control.

---

# 🚀 Run Locally

## Prerequisites

* Java 17+
* Maven
* Node.js
* npm
* MySQL
* Docker
* Razorpay test credentials

## Clone

```bash
git clone https://github.com/Sujals246/Staybook.git

cd Staybook
```

## Backend

### Windows

```bash
mvnw.cmd clean install
mvnw.cmd spring-boot:run
```

### macOS / Linux

```bash
./mvnw clean install
./mvnw spring-boot:run
```

## Frontend

```bash
cd staybook-frontend

npm install

npm run dev
```

Configure the frontend with:

```text
VITE_API_BASE_URL
```

pointing to the running Spring Boot backend.

---

# 📚 API Documentation

The backend includes **SpringDoc OpenAPI / Swagger UI** support.

Once the application is running, the generated API documentation can be used to:

* Explore REST endpoints
* Inspect request/response models
* Test APIs
* Review API contracts

---

# 🧪 Testing

The project includes Spring Boot testing infrastructure.

The architecture provides clear boundaries for testing:

* Authentication
* Booking lifecycle
* Inventory locking
* Dynamic pricing
* Payment verification
* Refund processing
* Webhooks
* Manager authorization
* Repository operations

---

# 🛠️ Technology Stack

| Category            | Technology        |
| ------------------- | ----------------- |
| Backend Language    | Java 17           |
| Backend Framework   | Spring Boot 4.0.5 |
| Web                 | Spring MVC        |
| Security            | Spring Security   |
| Authentication      | JWT               |
| Password Hashing    | BCrypt            |
| ORM                 | JPA / Hibernate   |
| Database            | MySQL             |
| Frontend            | React 19.2.6      |
| Build Tool          | Maven             |
| Frontend Build Tool | Vite 8            |
| Payments            | Razorpay          |
| API Documentation   | SpringDoc OpenAPI |
| Containerization    | Docker            |
| Frontend Hosting    | Vercel            |
| Backend Hosting     | Render            |
| Database Hosting    | Aiven             |
| Version Control     | Git / GitHub      |

---

# 🎯 Key Engineering Highlights

StayBook demonstrates practical implementation of:

**Backend**

* Spring Boot REST APIs
* Layered architecture
* Dependency injection
* DTO-based API design
* JPA / Hibernate
* MySQL
* Transaction management
* Exception handling

**Security**

* Spring Security
* JWT
* Access/refresh tokens
* HttpOnly cookies
* BCrypt
* Role-based authorization
* Method-level security

**Booking Systems**

* Date-based inventory
* Temporary reservations
* Booking expiration
* Pessimistic locking
* Concurrent inventory protection
* Booking state management

**Pricing**

* Strategy pattern
* Decorator-style composition
* Surge pricing
* Occupancy pricing
* Urgency pricing
* Holiday pricing
* BigDecimal-based monetary calculations

**Payments**

* Razorpay
* Order creation
* Payment verification
* Signature validation
* Webhooks
* Failed payments
* Refunds

**Full Stack**

* React
* Vite
* REST API integration
* Authentication state
* Checkout workflow
* Manager dashboard

**Deployment**

* Docker
* Multi-stage builds
* Vercel
* Render
* Aiven

---

# 🔮 Future Improvements

Potential extensions to the platform include:

* Comprehensive unit and integration testing
* Automated CI/CD
* Redis caching
* Asynchronous event processing
* Email booking notifications
* OAuth authentication
* Reviews and ratings
* Wishlist functionality
* Centralized logging
* Application monitoring
* Production observability

These are **future improvements and are not part of the current implementation**.

---

# 👨‍💻 Author

## Sujal Saini

**B.Tech Computer Science & Engineering — 2026**

**Focus:** Java • Spring Boot • Backend Development • REST APIs • MySQL

GitHub:
https://github.com/Sujals246/Sujals246

---

## ⭐ StayBook

A full-stack hotel booking platform focused on the engineering challenges behind **inventory consistency, concurrent reservations, dynamic pricing, secure payments, authentication, and cloud deployment**.
