# 🏨 Staybook

### Hotel Booking & Payments Platform

Staybook is a full-stack hotel booking platform built with **Java, Spring Boot, React, MySQL, and Razorpay**.

The platform allows users to search hotels, check room availability, reserve rooms, add guest details, make online payments, manage bookings, and process cancellations. Hotel managers can manage hotels, rooms, inventory, pricing, bookings, and revenue reports.

The backend focuses on practical booking-system challenges such as **inventory reservation, concurrent booking protection, dynamic pricing, JWT authentication, payment verification, and webhook-based payment updates.**

---

## ✨ Key Features

### 👤 Guest

* User registration and login
* JWT-based authentication
* Access token and refresh token flow
* Hotel search by city, dates, and room count
* Hotel and room details
* Real-time room availability
* Multi-day room booking
* Dynamic room pricing
* Add multiple guests to a booking
* Razorpay payment integration
* Server-side payment verification
* Booking history and status tracking
* Booking cancellation
* Refund processing
* Downloadable booking receipt
* Profile management

### 🏨 Hotel Manager

* Create and manage hotels
* Update hotel information
* Activate/deactivate hotels
* Create and manage rooms
* Configure room capacity and pricing
* Initialize room inventory
* Manage date-wise inventory
* Configure surge pricing
* View hotel bookings
* View revenue reports
* Role-based access control

---

# 🏗 Architecture

```text
┌──────────────────────────┐
│      React Frontend      │
│        Vite + React      │
└────────────┬─────────────┘
             │
             │ REST APIs / JSON
             ▼
┌──────────────────────────┐
│     Spring Security      │
│       JWT Filter         │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│       Controllers        │
│        REST Layer        │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│         Services         │
│     Business Logic       │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│       Repositories       │
│     Spring Data JPA      │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│          MySQL           │
│     JPA / Hibernate      │
└──────────────────────────┘

              │
              │ Payment Integration
              ▼
       ┌───────────────┐
       │   Razorpay    │
       │ Orders / Pay  │
       │ Webhooks      │
       │ Refunds       │
       └───────────────┘
```

### Backend request flow

```text
Client
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
JPA / Hibernate
  ↓
MySQL
```

The application follows a layered architecture where controllers handle HTTP requests, services contain business logic, repositories manage persistence, and DTOs define API contracts.

---

# 🔄 Booking Flow

The booking system follows a state-based lifecycle:

```text
RESERVED
    ↓
GUESTS_ADDED
    ↓
PAYMENTS_PENDING
    ↓
CONFIRMED
```

Cancellation or failed/expired payment can transition the booking to:

```text
CANCELLED
```

### Complete booking flow

```text
User searches hotels
        ↓
Selects hotel and room
        ↓
Initializes booking
        ↓
Inventory availability checked
        ↓
Inventory rows locked
        ↓
Rooms temporarily reserved
        ↓
Booking created
        ↓
Guest details added
        ↓
Razorpay order created
        ↓
User completes payment
        ↓
Payment signature verified
        ↓
Payment details verified with Razorpay
        ↓
Booking confirmed
        ↓
Reserved inventory converted to booked inventory
```

---

# 🔒 Concurrency-Safe Inventory

Inventory is maintained **per room and per date**.

Each inventory record contains values such as:

```text
totalCount
bookedCount
reservedCount
closed
surgeFactor
price
date
```

Available rooms are calculated as:

```text
availableCount =
    totalCount - bookedCount - reservedCount
```

### Why reservation is required

Consider a room with only one available unit.

Without temporary reservation:

```text
User A → sees 1 room
User B → sees 1 room

User A → books
User B → books

❌ Overbooking
```

Staybook temporarily reserves inventory during the booking process:

```text
User A
   ↓
Lock inventory
   ↓
Check availability
   ↓
Reserve room
   ↓
Transaction commits
   ↓
Lock released

User B
   ↓
Reads updated inventory
   ↓
Booking succeeds or fails based on availability
```

The booking operation uses **transactional database operations and pessimistic locking** to protect inventory during concurrent booking attempts.

---

# 💰 Dynamic Pricing Engine

Room pricing is calculated using a chain of pricing strategies.

```text
Base Price
     ↓
Surge Pricing
     ↓
Occupancy Pricing
     ↓
Urgency Pricing
     ↓
Holiday / Weekend Pricing
     ↓
Final Price
```

### Example

```text
Base Price                 ₹2,000
      ↓
Surge Pricing              ₹2,000
      ↓
High Occupancy × 1.20      ₹2,400
      ↓
Urgency × 1.15             ₹2,760
      ↓
Holiday × 1.25             ₹3,450
```

The pricing system uses a **Strategy / Decorator-style design** so individual pricing rules can be composed without putting all pricing logic into one large method.

This makes it easier to introduce additional pricing rules in the future.

---

# 💳 Payment Architecture

Staybook integrates **Razorpay** for online payments.

```text
User selects room
       ↓
Backend initializes booking
       ↓
Backend calculates booking amount
       ↓
Razorpay order created
       ↓
Razorpay Checkout
       ↓
Payment completed
       ↓
Backend verifies payment signature
       ↓
Backend validates order/payment details
       ↓
Booking confirmed
```

### Server-side payment verification

The backend does not rely solely on the frontend payment response.

Payment verification includes:

* Razorpay signature verification
* Order ID validation
* Payment ID validation
* Payment status validation
* Payment amount validation

### Razorpay webhook

The application also supports Razorpay webhook events.

```text
Razorpay
    ↓
Webhook
    ↓
Signature verification
    ↓
Payment event processing
    ↓
Booking / payment status update
```

This provides a server-to-server payment update path when the browser-side payment callback is unavailable.

---

# 🔐 Authentication & Authorization

Authentication is implemented using **Spring Security and JWT**.

### Login flow

```text
Email + Password
       ↓
AuthenticationManager
       ↓
User validation
       ↓
BCrypt password verification
       ↓
JWT Access Token
       +
Refresh Token
```

### Access token

* Short-lived
* Sent using the `Authorization: Bearer <token>` header
* Used for authenticated API requests

### Refresh token

* Long-lived
* Stored using an HttpOnly cookie
* Used to generate a new access token

### JWT request flow

```text
HTTP Request
     ↓
JWTAuthFilter
     ↓
Extract Bearer Token
     ↓
Validate JWT
     ↓
Extract User Identity
     ↓
Create Authentication
     ↓
SecurityContext
     ↓
Controller
```

---

# 👥 Role-Based Access Control

The application supports two primary roles:

```text
GUEST
HOTEL_MANAGER
```

Manager-specific APIs are protected using Spring Security role-based authorization.

Example:

```java
@PreAuthorize("hasRole('HOTEL_MANAGER')")
```

This prevents users without the required role from accessing protected management operations.

---

# 🗃 Data Model

```text
User
 ├── Hotels
 ├── Bookings
 └── Guests

Hotel
 ├── Rooms
 ├── Inventory
 └── Bookings

Room
 └── Inventory

Booking
 ├── Guests
 └── Payment
```

### Core entities

* `User`
* `Hotel`
* `Room`
* `Inventory`
* `Booking`
* `Guest`
* `Payment`
* `HotelContactInfo`
* `HotelMinPrice`

### Inventory model

Inventory is maintained for individual rooms and dates, allowing the system to support:

* Date-specific availability
* Date-specific pricing
* Weekend pricing
* Holiday pricing
* Occupancy-based pricing
* Temporary reservations
* Closed inventory dates

---

# 🧠 Key Design Decisions

### Pessimistic Locking

Booking inventory is a high-contention resource. Pessimistic database locking is used to prevent concurrent transactions from reserving the same inventory incorrectly.

### Strategy / Decorator Pricing

Pricing rules are separated into individual strategies so they can be composed and extended without creating a large conditional pricing method.

### DTO-Based API Design

DTOs are used between the API and persistence layers to control the data exposed to clients and keep API contracts separate from database entities.

### `BigDecimal` for Monetary Values

`BigDecimal` is used for monetary calculations to avoid floating-point precision problems associated with `double` and `float`.

### Separate User and Guest Models

The authenticated user making a booking is not necessarily the only person staying at the hotel. A booking can therefore contain multiple guest records.

### Booking Reservation

Inventory is temporarily reserved before payment so rooms are not simultaneously offered to multiple users during checkout.

---

# 🧪 Testing

The project includes Spring Boot test infrastructure and context-level testing.

Testing priorities include:

* Booking lifecycle
* Inventory availability
* Concurrent booking scenarios
* Dynamic pricing
* JWT authentication
* Payment verification
* Refund processing
* Webhook handling

---

# 📡 API Overview

## Authentication

| Method | Endpoint        | Description          |
| ------ | --------------- | -------------------- |
| `POST` | `/auth/signup`  | Register a user      |
| `POST` | `/auth/login`   | Authenticate user    |
| `POST` | `/auth/refresh` | Refresh access token |

## Hotel Search

| Method | Endpoint                 | Description                                     |
| ------ | ------------------------ | ----------------------------------------------- |
| `POST` | `/hotels/search`         | Search hotels by location, dates and room count |
| `POST` | `/hotels/{hotelId}/info` | Get hotel and room information                  |

## Booking

| Method | Endpoint                 | Description          |
| ------ | ------------------------ | -------------------- |
| `POST` | `/bookings/init`         | Initialize a booking |
| `POST` | `/bookings/{id}/guest`   | Add guest details    |
| `GET`  | `/bookings/{id}/status`  | Get booking status   |
| `POST` | `/bookings/{id}/cancel`  | Cancel a booking     |
| `GET`  | `/bookings/{id}/invoice` | Get booking receipt  |

## Payments

| Method | Endpoint                         | Description                     |
| ------ | -------------------------------- | ------------------------------- |
| `POST` | `/bookings/{id}/payments`        | Create payment order            |
| `POST` | `/bookings/{id}/payments/verify` | Verify payment                  |
| `POST` | `/bookings/{id}/payments/failed` | Handle failed payment           |
| `POST` | `/webhooks/razorpay`             | Process Razorpay webhook events |

## Hotel Manager

| Method   | Endpoint                                           | Description               |
| -------- | -------------------------------------------------- | ------------------------- |
| `POST`   | `/admin/hotels`                                    | Create hotel              |
| `GET`    | `/admin/hotels/{id}`                               | Get hotel                 |
| `PUT`    | `/admin/hotels/{id}`                               | Update hotel              |
| `PATCH`  | `/admin/hotels/{id}`                               | Activate/deactivate hotel |
| `DELETE` | `/admin/hotels/{id}`                               | Delete hotel              |
| `GET`    | `/admin/hotels/{id}/bookings`                      | View hotel bookings       |
| `GET`    | `/admin/hotels/{id}/reports`                       | View revenue reports      |
| `POST`   | `/admin/hotels/{hotelId}/rooms`                    | Create room               |
| `PATCH`  | `/admin/hotels/{hotelId}/rooms/{roomId}/inventory` | Update room inventory     |

---

# 📂 Project Structure

```text
Staybook/
│
├── src/
│   ├── main/
│   │   ├── java/com/logic/
│   │   │   ├── controller/
│   │   │   ├── Service/
│   │   │   ├── Repository/
│   │   │   ├── entity/
│   │   │   │   └── enums/
│   │   │   ├── DTO/
│   │   │   ├── security/
│   │   │   ├── strategy/
│   │   │   ├── advice/
│   │   │   ├── config/
│   │   │   ├── exception/
│   │   │   └── utils/
│   │   │
│   │   └── resources/
│   │
│   └── test/
│
├── airhouse-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── context/
│   │   └── api.js
│   ├── public/
│   └── package.json
│
├── .mvn/
├── pom.xml
├── mvnw
├── mvnw.cmd
├── payment.html
├── .gitignore
└── README.md
```

---

# 🛠 Tech Stack

| Category          | Technology                  |
| ----------------- | --------------------------- |
| Language          | Java 17                     |
| Backend           | Spring Boot                 |
| Web               | Spring MVC                  |
| Security          | Spring Security + JWT       |
| ORM               | Hibernate / JPA             |
| Database          | MySQL 8                     |
| Frontend          | React 19                    |
| Build Tool        | Maven                       |
| Frontend Tooling  | Vite                        |
| Payment Gateway   | Razorpay                    |
| API Documentation | SpringDoc OpenAPI / Swagger |
| Version Control   | Git / GitHub                |

---

# 🚀 Getting Started

## Prerequisites

Make sure the following are installed:

* Java 17+
* Maven
* Node.js 18+
* MySQL 8+
* Razorpay test account for payment testing

---

## 1. Clone the repository

```bash
git clone https://github.com/Sujals246/Staybook.git
cd Staybook
```

---

## 2. Configure MySQL

Create a database:

```sql
CREATE DATABASE staybook;
```

Configure the datasource in your local Spring Boot configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/staybook
spring.datasource.username=your_username
spring.datasource.password=your_password
```

---

## 3. Configure application credentials

Configure the required JWT and Razorpay credentials in your local configuration.

Example:

```properties
jwt.secretKey=your_secret_key

razorpay.key.id=your_razorpay_key
razorpay.key.secret=your_razorpay_secret
razorpay.webhook.secret=your_webhook_secret
```

Do not commit real credentials to the repository.

---

## 4. Run the backend

### macOS / Linux

```bash
./mvnw clean install
./mvnw spring-boot:run
```

### Windows

```bash
mvnw.cmd clean install
mvnw.cmd spring-boot:run
```

---

## 5. Run the frontend

```bash
cd airhouse-frontend
npm install
npm run dev
```

---

# 📸 Screenshots

Place screenshots inside:

```text
docs/
└── screenshots/
```

Recommended screenshots:

* Hotel search
* Hotel listing
* Hotel details
* Checkout
* Razorpay payment
* Booking confirmation
* My bookings
* Manager dashboard

Example:

```markdown
## Hotel Search

![Hotel Search](docs/screenshots/home.png)

## Hotel Details

![Hotel Details](docs/screenshots/hotel-details.png)

## Checkout

![Checkout](docs/screenshots/checkout.png)

## Booking Confirmation

![Booking Confirmation](docs/screenshots/booking-confirmation.png)

## Manager Dashboard

![Manager Dashboard](docs/screenshots/manager-dashboard.png)
```

---

# 🚀 Future Enhancements

* Email notifications for booking confirmation
* Google OAuth authentication
* Reviews and ratings
* Wishlist functionality
* Dockerized deployment
* CI/CD pipeline
* AWS deployment
* Redis-based caching
* Improved automated test coverage

---

# 🎯 What This Project Demonstrates

Staybook demonstrates practical experience with:

* Java and Object-Oriented Programming
* Collections and Generics
* Streams and Lambda expressions
* Spring Boot
* REST API development
* Dependency Injection
* Spring Security
* JWT authentication
* Role-based authorization
* JPA / Hibernate
* MySQL
* Transactions
* Pessimistic locking
* Concurrency handling
* Inventory management
* Dynamic pricing
* Design patterns
* Razorpay integration
* Payment verification
* Webhooks
* Refund processing
* DTO-based API design
* Exception handling
* React frontend integration

---

# 👨‍💻 Author

### Sujal Saini

**Java Backend Developer | Spring Boot | MySQL**

GitHub: [@Sujals246](https://github.com/Sujals246)

---

## ⭐ Staybook

A full-stack hotel booking platform designed around real-world backend challenges such as **inventory concurrency, secure payments, dynamic pricing, authentication, and booking lifecycle management**.
