<<<<<<< HEAD
# 🏨 StayBook - Full stack Hotel booking & payment platform

<p align="center">

![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.x-6DB33F?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql)
![JWT](https://img.shields.io/badge/JWT-Authentication-red?style=for-the-badge)
![Spring Security](https://img.shields.io/badge/Spring-Security-brightgreen?style=for-the-badge)
![Razorpay](https://img.shields.io/badge/Razorpay-Payment-0C47C9?style=for-the-badge)
![REST API](https://img.shields.io/badge/REST-API-success?style=for-the-badge)

</p>

---

## 📖 About The Project

StayBook is a **production-style full-stack web application** inspired by Airbnb that enables users to discover hotels, browse rooms, securely book accommodations, and complete online payments using **Razorpay**.

The application follows a scalable layered architecture with secure authentication, RESTful APIs, role-based authorization, inventory management, booking workflows, and integrated payment processing.

It demonstrates real-world backend engineering concepts using **Spring Boot**, **Spring Security**, **JWT**, **Hibernate**, **React**, and **MySQL**.

---

# ✨ Features

## 👤 User

- User Registration & Login
- JWT Authentication
- Secure Password Encryption
- Browse Hotels
- Search Available Hotels
- View Hotel Details
- View Available Rooms
- Check Room Availability
- Book Rooms
- Razorpay Payment Integration
- Booking Confirmation
- Booking History
- Responsive Interface

---

## 🏨 Hotel Management

- Add Hotels
- Update Hotel Details
- Delete Hotels
- Manage Rooms
- Upload Hotel Images
- Inventory Management
- Dynamic Pricing Support

---

## 📅 Booking Management

- Room Availability Checking
- Booking Validation
- Reservation Management
- Booking History
- Checkout Process
- Payment Verification

---

## 💳 Payment Gateway

Integrated with **Razorpay Payment Gateway**

Features include:

- Create Payment Orders
- Secure Checkout
- Payment Verification
- Webhook Integration
- Booking Confirmation after Successful Payment

---

## 🔐 Security

- Spring Security
- JWT Authentication
- Role Based Authorization
- Protected REST APIs
- Secure Password Hashing
- Authentication Filters

---

# 🏗 System Architecture

```
                    React Frontend
                           │
                           │ REST API
                           ▼
                Spring Boot Backend
                           │
        ┌──────────────────┼─────────────────┐
        │                  │                 │
 Authentication      Booking Module     Hotel Module
        │                  │                 │
        ├──────────────────┼─────────────────┤
                           │
                    Payment Module
                     (Razorpay)
                           │
                           ▼
                     MySQL Database
```

---

# ⚙ Tech Stack

## Frontend

- React 19
- JavaScript
- HTML5
- CSS3
- Vite
- Axios

---

## Backend

- Java 17
- Spring Boot
- Spring MVC
- Spring Security
- JWT
- Spring Data JPA
- Hibernate
- REST APIs

---

## Database

- MySQL

---

## Payment Gateway

- Razorpay

---

## Build Tools

- Maven
- npm
- Vite

---

## Development Tools

- IntelliJ IDEA
- VS Code
- Postman
- Git
- GitHub

---

# 📂 Project Structure

```
Airbnb-Booking-System

backend
│
├── controller
├── service
├── repository
├── entity
├── dto
├── config
├── security
├── exception
├── util
└── resources

frontend
│
├── src
│   ├── components
│   ├── pages
│   ├── services
│   ├── context
│   ├── hooks
│   ├── assets
│   └── utils
│
└── public
```

---

# 📦 Backend Modules

```
Authentication

User Management

Hotel Management

Room Management

Inventory Management

Booking Management

Checkout Module

Pricing Module

Payment Module

Guest Management
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/Sujals246/Airbnb-Booking-System-.git
```

---

## Backend

```bash
cd backend

mvn clean install

mvn spring-boot:run
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 🔐 Authentication Flow

```
User Login

↓

Spring Security

↓

JWT Generated

↓

Token Sent to Client

↓

Client stores JWT

↓

JWT Attached to Every Request

↓

Protected APIs Accessed
```

---

# 💳 Razorpay Payment Workflow

```
User Selects Room

↓

Booking Created

↓

Razorpay Order Generated

↓

Payment Checkout

↓

Payment Verification

↓

Webhook Received

↓

Booking Confirmed

↓

Database Updated
```

---

# 🏨 Booking Workflow

```
Browse Hotels

↓

Select Hotel

↓

View Rooms

↓

Check Availability

↓

Choose Dates

↓

Checkout

↓

Online Payment

↓

Booking Confirmed
```

---

# 🗄 Database

Major Entities

- User
- Hotel
- Room
- Booking
- Guest
- Inventory
- Payment

---

# 📡 REST APIs

## Authentication

```
POST /register

POST /login
```

---

## Hotels

```
GET /hotels

GET /hotels/{id}

POST /hotels

PUT /hotels/{id}

DELETE /hotels/{id}
```

---

## Rooms

```
GET /rooms

POST /rooms

PUT /rooms

DELETE /rooms
```

---

## Booking

```
POST /booking

GET /booking

DELETE /booking
```

---

## Payments

```
POST /checkout

POST /payment

POST /webhook
```

---

# 📸 Application Screenshots

Add screenshots here:

- Home Page
- Login Page
- Registration
- Hotel Listing
- Hotel Details
- Room Selection
- Checkout Page
- Razorpay Payment
- Booking Success
- Dashboard

---

# 🎯 Key Highlights

- Full Stack Application
- Production Style Architecture
- JWT Authentication
- Spring Security
- Razorpay Payment Integration
- Inventory Management
- Booking Management
- Layered Architecture
- RESTful APIs
- Responsive React Frontend
- MySQL Database
- Clean Project Structure

---

# 🚀 Future Enhancements

- Email Notifications
- Google OAuth Login
- Reviews & Ratings
- Wishlist
- Docker Support
- AWS Deployment
- CI/CD Pipeline
- Redis Caching
- Elasticsearch
- Microservices Architecture

---

# 👨‍💻 Author

**Sujal Saini**

Final Year B.Tech Computer Science Engineering

Java Backend Developer | Spring Boot | React | MySQL

GitHub:
https://github.com/Sujals246

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

It motivates further development and improvements.
=======
<div align="center">

# 🏨 Staybook

### A hotel booking & payments platform built with Spring Boot and React

Real inventory locking. Real payment verification. Real dynamic pricing.
Not another CRUD-with-JWT clone.

<br/>

![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-Payments-0C47C9?style=for-the-badge&logo=razorpay&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen?style=flat-square)
![PRs](https://img.shields.io/badge/PRs-Welcome-orange?style=flat-square)

[Overview](#-overview) •
[Features](#-features) •
[Architecture](#-architecture) •
[Data Model](#-data-model) •
[Tech Stack](#-tech-stack) •
[Design Decisions](#-design-decisions-worth-knowing-about) •
[Getting Started](#-getting-started) •
[API Reference](#-api-reference) •
[Project Structure](#-project-structure) •
[Known Limitations](#-known-limitations) •
[Roadmap](#-roadmap)

</div>

<br/>

## 📖 Overview

**Staybook** is a full-stack, Airbnb-style booking system that goes past the surface-level "list hotels, take a booking" demo and actually handles the hard parts of the domain:

- **Concurrency-safe inventory** — pessimistic row locking so two guests can't book the last room at the same time.
- **Trustless payment verification** — every payment is re-verified against Razorpay's API (order, status, amount) instead of trusting whatever the client reports.
- **Composable dynamic pricing** — surge, occupancy, urgency, and holiday pricing stack on top of a base rate using the Decorator pattern.
- **A real booking lifecycle** — `RESERVED → GUESTS_ADDED → PAYMENTS_PENDING → CONFIRMED / CANCELLED`, with automatic expiry on abandoned bookings.

It's built to reason about the domain properly — concurrency, payment trust boundaries, and pricing rules — rather than stopping at the happy path.

<br/>

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 👤 Guest Experience
- Secure signup & login (JWT + refresh token)
- Browse & search hotels by city, dates, room count
- Real-time room availability
- Multi-day booking with per-day dynamic pricing
- Razorpay checkout with signature-verified confirmation
- Booking history & live status tracking
- Downloadable payment receipts
- Cancel & auto-refund confirmed bookings

</td>
<td width="50%" valign="top">

### 🏢 Hotel Manager Experience
- Create, update, activate, and deactivate hotels
- Manage rooms and yearlong inventory in one call
- Fine-grained inventory control — surge factor & date-range closures
- Revenue reports scoped to date ranges
- View all bookings for owned properties
- Role-based access (`HOTEL_MANAGER` vs `GUEST`)

</td>
</tr>
</table>

### 💳 Payments, Done Properly

| Capability | How it's handled |
|---|---|
| **Order creation** | Server creates the Razorpay order — amount is never trusted from the client |
| **Signature verification** | HMAC-SHA256, constant-time comparison (no timing attacks) |
| **Payment verification** | Re-fetched from Razorpay's API and cross-checked on `order_id`, `status`, **and amount** |
| **Webhooks** | `payment.captured`, `payment.authorized`, `payment.failed`, `refund.processed` — all signature-verified |
| **Failure tracking** | Dual-path: client-reported failures *and* a webhook backstop if the client never calls back |
| **Refunds** | Full Razorpay refund flow with capture-then-refund fallback for authorized-but-uncaptured payments |

### 💰 How dynamic pricing actually stacks

Each night's price starts at the room's base rate and passes through four independent multipliers, applied in order:

```
Base Price (₹2,000)
   │
   ▼  Surge Factor (manager-set, e.g. 1.0×)
₹2,000
   │
   ▼  Occupancy > 80% booked for that night → ×1.2
₹2,400
   │
   ▼  Check-in within next 7 days → ×1.15
₹2,760
   │
   ▼  Weekend or public holiday → ×1.25
₹3,450  ← final price for that night
```

Because each step is a self-contained `PricingStrategy` decorator, this recalculates fresh every time inventory state changes (a booking, a cancellation, a manager override) — not once at room-creation time. The price you see when searching is the price you'll actually be charged.

<br/>

## 🏗 Architecture

```
                        ┌─────────────────────┐
                        │   React Frontend     │
                        │   (Vite + React 19)  │
                        └──────────┬───────────┘
                                   │ REST / JSON
                                   ▼
                        ┌─────────────────────┐
                        │  JWT Auth Filter      │
                        │  (Spring Security)    │
                        └──────────┬───────────┘
                                   │
        ┌──────────────┬──────────┴──────────┬──────────────┐
        ▼              ▼                     ▼              ▼
   Auth Module    Hotel/Room Module    Booking Module   Payment Module
        │              │                     │              │
        │              │                     ▼              │
        │              │            Pricing Engine           │
        │              │         (Decorator Pattern)          │
        │              │           Base → Surge →              │
        │              │        Occupancy → Urgency →           │
        │              │              Holiday                    │
        │              │                     │              │
        └──────────────┴──────────┬──────────┴──────────────┘
                                   ▼
                        ┌─────────────────────┐
                        │   MySQL (Hibernate)   │
                        │  Pessimistic Locking   │
                        │   on Inventory rows    │
                        └──────────┬───────────┘
                                   │
                                   ▼
                        ┌─────────────────────┐
                        │   Razorpay Gateway    │
                        │  Orders · Webhooks ·   │
                        │      Refunds            │
                        └─────────────────────┘
```

### The booking lifecycle

```
  init booking            add guests           pay & verify           confirmed
┌──────────────┐       ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   RESERVED    │──────▶│ GUESTS_ADDED  │─────▶│PAYMENTS_PENDING│─────▶│  CONFIRMED    │
│ inventory     │       │               │      │ Razorpay order │      │ inventory     │
│ locked +      │       │               │      │ created        │      │ booked,       │
│ reserved      │       │               │      │                 │      │ reservation   │
│ (10 min TTL)  │       │               │      │                 │      │ released      │
└──────────────┘       └──────────────┘      └──────────────┘      └──────────────┘
        │                                                                    │
        └─────────────────── expires / cancelled ──────────────────────────▶│
                                                                              ▼
                                                                      ┌──────────────┐
                                                                      │  CANCELLED    │
                                                                      │ (refunded if  │
                                                                      │  confirmed)   │
                                                                      └──────────────┘
```

<br/>

## 🗃 Data Model

```
User ──┬──< Hotel (owner)
       ├──< Booking >── Hotel
       ├──< Guest
       └──< Payment  (via Booking)

Hotel ──< Room ──< Inventory (one row per room, per night)
Hotel ──< HotelContactInfo
Hotel ──< Booking

Booking ──< Guest (many-to-many: guests attached to a booking)
Booking ── Payment  (one active payment record per booking)

Inventory: { date, totalCount, bookedCount, reservedCount, closed, surgeFactor, price }
```

**Why inventory is modeled per room *per night*, not per room:** availability and price both vary by date (weekends, holidays, how full that specific night already is). A single `Room` row can't represent that — so `Inventory` denormalizes into one row per room per calendar day, which is also what makes the pessimistic-lock query on a date range possible in a single `SELECT ... FOR UPDATE`.

**Core entities:** `User`, `Hotel`, `Room`, `Inventory`, `Booking`, `Guest`, `Payment` — plus enums for `Role` (`GUEST` / `HOTEL_MANAGER`), `BookingStatus`, and `PaymentStatus`.

<br/>

## ⚙ Tech Stack

<table>
<tr>
<th>Layer</th>
<th>Technology</th>
</tr>
<tr>
<td><strong>Backend</strong></td>
<td>Java 17 · Spring Boot 4 · Spring Security · Spring Data JPA (Hibernate) · JJWT</td>
</tr>
<tr>
<td><strong>Frontend</strong></td>
<td>React 19 · Vite · Axios-style fetch client · lucide-react</td>
</tr>
<tr>
<td><strong>Database</strong></td>
<td>MySQL 8 with pessimistic write locks for concurrency safety</td>
</tr>
<tr>
<td><strong>Payments</strong></td>
<td>Razorpay (Orders API, Payments API, Refunds API, Webhooks)</td>
</tr>
<tr>
<td><strong>API Docs</strong></td>
<td>springdoc-openapi (Swagger UI)</td>
</tr>
<tr>
<td><strong>Build Tools</strong></td>
<td>Maven · npm</td>
</tr>
</table>

<br/>

## 🎯 Design Decisions Worth Knowing About

<details>
<summary><strong>Why pessimistic locking instead of optimistic?</strong></summary>
<br/>
Inventory rows are the contention point during high-traffic booking windows. A pessimistic <code>PESSIMISTIC_WRITE</code> lock on <code>findAndLockAvailableInventory</code> guarantees that two concurrent requests for the same room/date range can never both succeed — one blocks until the other's transaction commits or rolls back. Optimistic locking would need a retry loop on every booking attempt during contention, which is worse UX for a use case where failed bookings should be rare, not routine.
</details>

<details>
<summary><strong>Why a Decorator pattern for pricing?</strong></summary>
<br/>
Surge, occupancy, urgency, and holiday pricing are independent, composable rules that each multiply the running price. Wrapping <code>PricingStrategy</code> implementations around each other (<code>Base → Surge → Occupancy → Urgency → Holiday</code>) means each rule is testable in isolation and new pricing rules can be added without touching existing ones — no giant if/else pricing function.
</details>

<details>
<summary><strong>Why re-verify payments server-side instead of trusting the client?</strong></summary>
<br/>
A client-side "payment succeeded" callback can be spoofed. <code>verifyPayment</code> checks the HMAC signature <em>and</em> re-fetches the payment object directly from Razorpay's API to confirm the order ID, status, and paise amount all match the booking — closing the gap where someone could report success for a payment that never happened, or for a lower amount than the room actually costs.
</details>

<details>
<summary><strong>Why does a booking expire after 10 minutes?</strong></summary>
<br/>
Once a booking hits <code>RESERVED</code>, its inventory is locked (<code>reservedCount</code> incremented) so no one else can book it — even before payment. Without an expiry, an abandoned checkout would hold that inventory hostage indefinitely. The 10-minute TTL (<code>hasBookingExpired</code>) bounds that window.
</details>

<details>
<summary><strong>Why access token + refresh token instead of one long-lived JWT?</strong></summary>
<br/>
The access token is short-lived (10 minutes) and sent in the <code>Authorization</code> header on every request — if it leaks (XSS, logs, a browser extension), the blast radius is capped at 10 minutes. The refresh token is long-lived (6 months) but never touches JavaScript at all: it's set as an <strong><code>httpOnly</code> cookie</strong> in <code>AuthController.login</code>, so client-side scripts can't read or exfiltrate it. <code>/auth/refresh</code> reads that cookie server-side and mints a new access token. This is the standard pattern for balancing "don't make users log in constantly" against "don't give a stolen token unlimited lifetime."
</details>

<details>
<summary><strong>How does role-based access control (RBAC) actually get enforced?</strong></summary>
<br/>
Two layers, not one:

1. <strong>Coarse-grained, at the URL level</strong> — <code>WebSecurityConfig</code> maps URL patterns to roles: <code>/admin/**</code> requires <code>HOTEL_MANAGER</code>, <code>/bookings/**</code> and <code>/users/**</code> require any authenticated user, everything else is public. This runs in the Spring Security filter chain, before a request ever reaches a controller.
2. <strong>Fine-grained, at the method level</strong> — <code>@PreAuthorize("hasRole('HOTEL_MANAGER')")</code> on controllers like <code>HotelController</code> and <code>RoomAdminController</code>, enabled via <code>@EnableMethodSecurity</code>. This is what lets role checks live next to the business logic they protect instead of only in one central config file.

The role itself is embedded in the JWT as a claim at login time (<code>JWTService.generateAccessToken</code>) and re-derived from the DB on every request via <code>JWTAuthFilter</code> → <code>user.getAuthorities()</code> — so a role change takes effect on the user's *next* request, not retroactively on an already-issued token.

<em>Where this currently falls short:</em> role checks confirm <strong>who</strong> you are, not <strong>which resource</strong> you're allowed to touch — see <a href="#-known-limitations">Known Limitations</a> for the ownership-check gap on some admin endpoints.
</details>

<details>
<summary><strong>Why DTOs instead of returning JPA entities directly from controllers?</strong></summary>
<br/>
Every controller talks in <code>DTO</code> types (<code>HotelDTO</code>, <code>BookingDTO</code>, <code>UserDTO</code>...), mapped from entities via <code>ModelMapper</code> — the entities themselves never leave the service layer. This buys three things concretely:

- <strong>No accidental leaks.</strong> <code>User</code> carries a password hash; <code>UserDTO</code> doesn't. If a JPA entity were serialized straight to JSON, one missing <code>@JsonIgnore</code> would leak it.
- <strong>No lazy-loading crashes.</strong> Hibernate entities carry lazy-loaded collections (<code>Hotel.rooms</code>, <code>Booking.guests</code>) that throw <code>LazyInitializationException</code> if touched outside a transaction — which serializing straight to JSON does. DTOs are plain data, so this can't happen.
- <strong>API shape can diverge from DB shape.</strong> <code>HotelPriceResponseDTO</code> bolts a computed <code>price</code> field onto hotel data that doesn't exist as a column anywhere — it's a query-time projection, not a database attribute. Entities can't represent that cleanly; DTOs can.
</details>

<details>
<summary><strong>Why centralized exception handling instead of try/catch in every controller?</strong></summary>
<br/>
<code>GlobalExceptionHandler</code> (via <code>@RestControllerAdvice</code>) catches domain exceptions — <code>ResourceNotFoundException</code>, <code>UnAuthorisedException</code>, <code>IllegalStateException</code>, JWT failures — in one place and turns them into a consistent <code>ApiError</code> response shape. Combined with <code>GlobalResponseHandler</code>, every successful response also gets wrapped in the same envelope (<code>{ data, timeStamp, error }</code>) regardless of which controller produced it. Two payoffs: controllers stay focused on orchestration instead of error formatting, and the frontend's <code>api.js</code> can unwrap every response the same way (<code>json.data ?? json</code>) without knowing which endpoint it called.
</details>

<details>
<summary><strong>Why does the webhook handler duplicate the confirm/fail logic that verifyPayment already does?</strong></summary>
<br/>
Because the two entry points cover different failure modes, not the same one. <code>verifyPayment</code> runs when the <em>user's browser</em> calls back after Razorpay's checkout — but that call can simply never happen (tab closed, network drop, app crashed mid-flow). The <code>/webhooks/razorpay</code> endpoint is Razorpay's own server calling <em>your</em> server directly, independent of whether the user's browser is even still open. Both paths converge on the same <code>confirmPaymentFromWebhook</code> method, and that method is written to be safe to call twice — it checks <code>if (booking.getBookingStatus() != BookingStatus.CONFIRMED)</code> before mutating inventory, so a booking already confirmed by the browser callback doesn't get double-processed when the webhook arrives moments later.
</details>

<details>
<summary><strong>Why does refunding check for "authorized" status separately from "captured"?</strong></summary>
<br/>
Razorpay payments can sit in an <code>authorized</code> state — money is reserved on the card but not yet pulled — before being <code>captured</code>. You can't refund money that was never captured. So <code>PaymentService.refundPayment</code> checks the live status from Razorpay first: if it's only <code>authorized</code>, it explicitly calls <code>payments.capture(...)</code> before issuing the refund, rather than assuming every confirmed booking already has captured funds sitting behind it.
</details>

<details>
<summary><strong>Why is Guest a separate entity from the booking user?</strong></summary>
<br/>
The person paying for a booking (<code>User</code>, authenticated via JWT) isn't necessarily the person staying in the room. <code>Booking</code> holds a <code>Set&lt;Guest&gt;</code> precisely so one logged-in user can book a room for multiple named guests — each with their own name/age/gender/ID details — without needing every guest to have an account. <code>UserController</code> also exposes a standalone guest address-book (<code>/users/guests</code>) so a user can save guest profiles once and reuse them across bookings instead of re-entering details every time.
</details>

<br/>

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- MySQL 8+
- A [Razorpay](https://razorpay.com/) test account (optional — falls back to a mock order if the API call fails)

### Clone

```bash
git clone https://github.com/Sujals246/Airbnb-Booking-System-.git
cd Airbnb-Booking-System-
```

### Backend setup

Create a local MySQL database, then configure your own `src/main/resources/application-local.properties` (never commit real credentials):

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/staybook
spring.datasource.username=your_username
spring.datasource.password=your_password

jwt.secretKey=replace-with-a-long-random-secret

razorpay.key.id=your_razorpay_key_id
razorpay.key.secret=your_razorpay_key_secret
razorpay.webhook.secret=your_webhook_secret
```

Run it:

```bash
./mvnw clean install
./mvnw spring-boot:run
```

The API will be live at `http://localhost:8089/api/v1`, with Swagger UI at `http://localhost:8089/api/v1/swagger-ui.html`.

### Frontend setup

```bash
cd airhouse-frontend
npm install
npm run dev
```

The app will be live at `http://localhost:5173`.

### Environment variables reference

| Variable | Purpose | Example |
|---|---|---|
| `spring.datasource.url` | MySQL connection string | `jdbc:mysql://localhost:3306/staybook` |
| `spring.datasource.username` / `.password` | DB credentials | — |
| `jwt.secretKey` | HMAC signing key for access & refresh tokens | a long random string, 256-bit+ |
| `razorpay.key.id` / `.key.secret` | Razorpay API credentials | from your Razorpay dashboard |
| `razorpay.webhook.secret` | Verifies inbound webhook signatures | set when configuring the webhook in Razorpay |
| `razorpay.currency` | Defaults to `INR` | — |
| `server.port` | Backend port | `8089` |

> No Razorpay account handy? Leave the keys blank — `CheckoutServiceImpl` catches the failure and falls back to a mock order (`order_mock_...`) so the booking flow still works end-to-end for local testing.

<br/>

## 📡 API Reference

<details>
<summary><strong>Authentication</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/signup` | Register a new guest account |
| `POST` | `/auth/login` | Authenticate and receive access + refresh tokens |
| `POST` | `/auth/refresh` | Exchange a refresh token for a new access token |

</details>

<details>
<summary><strong>Hotels & Search</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/hotels/search` | Search available hotels by city, dates & room count |
| `POST` | `/hotels/{hotelId}/info` | Get hotel details with room pricing for a date range |

</details>

<details>
<summary><strong>Bookings</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/bookings/init` | Reserve inventory & initialize a booking |
| `POST` | `/bookings/{id}/guest` | Attach guest details to a reserved booking |
| `POST` | `/bookings/{id}/payments` | Create a Razorpay payment order |
| `POST` | `/bookings/{id}/payments/verify` | Verify payment & confirm booking |
| `POST` | `/bookings/{id}/payments/failed` | Record a client-reported payment failure |
| `POST` | `/bookings/{id}/cancel` | Cancel a booking (auto-refunds if confirmed) |
| `GET` | `/bookings/{id}/status` | Get current booking status |
| `GET` | `/bookings/{id}/invoice` | Download a payment receipt |

</details>

<details>
<summary><strong>Manager — Hotels, Rooms & Inventory</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/admin/hotels` | Create a new hotel |
| `PUT` | `/admin/hotels/{id}` | Update hotel details |
| `PATCH` | `/admin/hotels/{id}` | Activate a hotel (initializes a year of inventory) |
| `DELETE` | `/admin/hotels/{id}` | Delete a hotel |
| `GET` | `/admin/hotels/{id}/bookings` | View all bookings for a hotel |
| `GET` | `/admin/hotels/{id}/reports` | Revenue report for a date range |
| `POST` | `/admin/hotels/{hotelId}/rooms` | Add a room to a hotel |
| `PATCH` | `/admin/hotels/{hotelId}/rooms/{roomId}/inventory` | Adjust surge pricing / close dates |

</details>

<details>
<summary><strong>Webhooks</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/webhooks/razorpay` | Signature-verified Razorpay event handler |

</details>

<br/>

## 📂 Project Structure

```
Staybook/
├── src/main/java/com/logic/
│   ├── controller/        # REST endpoints — thin, delegate to services
│   ├── Service/            # Business logic (booking, pricing, payments, hotels, rooms)
│   ├── Repository/         # Spring Data JPA + custom @Query / @Lock methods
│   ├── entity/              # JPA entities + enums (BookingStatus, PaymentStatus, Role)
│   ├── DTO/                  # Request/response contracts, kept separate from entities
│   ├── strategy/              # Pricing decorators (Base/Surge/Occupancy/Urgency/Holiday)
│   ├── security/                # JWT filter, JWT service, Spring Security config, AuthService
│   ├── advice/                    # Global exception handling + response envelope
│   ├── config/                     # CORS, Razorpay client, ModelMapper beans
│   ├── exception/                    # Domain exceptions (ResourceNotFound, Unauthorised)
│   └── utils/                          # Shared helpers (current-user accessor, etc.)
│
├── src/main/resources/
│   └── application.properties          # ⚠ move secrets to a gitignored local file
│
├── src/test/java/                        # Spring Boot test scaffold
│
└── airhouse-frontend/
    └── src/
        ├── views/            # HotelSearch, HotelDetails, Checkout, MyBookings,
        │                        Profile, ManagerDashboard
        ├── components/       # Navbar, Footer, AuthModal
        ├── context/          # AuthContext (JWT state)
        └── api.js             # Single fetch client wrapping every backend route
```

<br/>

## 🧪 Testing

The domain logic here — locking, pricing math, payment amount verification, refund fallbacks — is exactly the kind of thing unit tests are built for, and that's the honest gap in the project right now: only the default Spring Boot context-load test exists. Priority order for adding coverage:

1. `PricingService` — deterministic, no I/O, easiest to test first (given a fixed `Inventory`, assert the exact final price for surge/weekend/urgency combinations).
2. `BookServiceImpl.validateRazorpayPayment` — mock the Razorpay client and assert amount/status mismatches are rejected.
3. Concurrency test for `findAndLockAvailableInventory` — fire two overlapping booking requests at the same room/date range and assert only one succeeds.

<br/>

## ⚠ Known Limitations

Being upfront about where this stands today rather than overstating it:

- **Manager endpoints check role, not ownership** on some hotel/room mutation paths — a `HOTEL_MANAGER` can currently act on hotels they don't own. Booking/report endpoints already enforce this correctly (`hotel.getOwner().equals(currentUser)`); the fix is bringing the rest of the admin endpoints up to the same standard.
- **Secrets currently live in `application.properties`** rather than environment variables — fine for local dev, not something to commit as-is.
- **Invoices are plain-text**, not PDF — functional, but not the polish a real receipt would have.
- **No automated tests beyond the Spring Boot scaffold** (see [Testing](#-testing) above).
- **CORS allows the `"null"` origin**, which is broader than it needs to be for a browser-only frontend.

None of these block the app from working end-to-end locally — they're the next things to fix before treating this as anything beyond a learning project.

<br/>

## 🗺 Roadmap

- [ ] Email notifications on booking confirmation
- [ ] Google OAuth login
- [ ] Reviews & ratings
- [ ] Wishlist
- [ ] Redis caching for hotel search
- [ ] CI/CD pipeline
- [ ] Dockerized deployment
- [ ] Owner-scoped authorization on remaining admin endpoints
- [ ] Unit test coverage for pricing & payment verification
- [ ] Secrets moved to environment variables

<br/>

## 🤝 Contributing

This started as a learning project, but issues, suggestions, and PRs are genuinely welcome — especially around the items in [Known Limitations](#-known-limitations). If you spot something, open an issue before a PR so we're aligned on approach.

<br/>

## 📄 License

Licensed under the [MIT License](LICENSE).

<br/>

## 👨‍💻 Author

**Sujal Saini**
Final Year B.Tech, Computer Science Engineering
Backend Developer — Java · Spring Boot · MySQL

[GitHub](https://github.com/Sujals246)

<br/>

<div align="center">

If this project helped you learn something, consider giving it a ⭐

</div>
>>>>>>> 025480ae9b019ebc82c963fff1e8c90b7a6c9cad
