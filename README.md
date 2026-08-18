# 🏨 Airbnb Booking System

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

Airbnb Booking System is a **production-style full-stack web application** inspired by Airbnb that enables users to discover hotels, browse rooms, securely book accommodations, and complete online payments using **Razorpay**.

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
