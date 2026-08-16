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
[Tech Stack](#-tech-stack) •
[Getting Started](#-getting-started) •
[API Reference](#-api-reference) •
[Design Decisions](#-design-decisions)

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

## 🗺 Roadmap

- [ ] Email notifications on booking confirmation
- [ ] Google OAuth login
- [ ] Reviews & ratings
- [ ] Wishlist
- [ ] Redis caching for hotel search
- [ ] CI/CD pipeline
- [ ] Dockerized deployment

<br/>

## 👨‍💻 Author

**Sujal Saini**
 B.Tech, Computer Science & Engineering graduate 2026
Backend Developer — Java · Spring Boot · MySQL

[GitHub](https://github.com/Sujals246)

<br/>

<div align="center">

If this project helped you learn something, consider giving it a ⭐

</div>
