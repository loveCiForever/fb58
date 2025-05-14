# Football Field Booking API

A RESTful API for a football field booking system built with Express.js and SQLite.

## Table of Contents

- [Football Field Booking API](#football-field-booking-api)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the API](#running-the-api)
  - [API Documentation](#api-documentation)
    - [Response Format](#response-format)
    - [Base URL](#base-url)
    - [Authentication Endpoints](#authentication-endpoints)
      - [Register a new user](#register-a-new-user)
      - [Verify account](#verify-account)
      - [Login](#login)
      - [Get user profile](#get-user-profile)
      - [Update user profile](#update-user-profile)
      - [Change password](#change-password)
    - [Field Endpoints](#field-endpoints)
      - [Get info of all fields](#get-info-of-all-fields)
      - [Get field info by ID](#get-field-info-by-id)
      - [Get available time slots](#get-available-time-slots)
      - [Get booked time slots by fieldID and date](#get-booked-time-slots-by-fieldid-and-date)
      - [Get booked time slots by date](#get-booked-time-slots-by-date)
      - [Create a new field (admin only)](#create-a-new-field-admin-only)
    - [Booking Endpoints](#booking-endpoints)
      - [Create a new booking](#create-a-new-booking)
      - [Get user's bookings](#get-users-bookings)
      - [Get booking by ID](#get-booking-by-id)
      - [Update booking payment proof](#update-booking-payment-proof)
      - [Cancel booking](#cancel-booking)
    - [Service Endpoints](#service-endpoints)
      - [Get all active services](#get-all-active-services)
      - [Get service by ID](#get-service-by-id)
      - [Create a new service (admin only)](#create-a-new-service-admin-only)
    - [Review Endpoints](#review-endpoints)
      - [Get all reviews for a field](#get-all-reviews-for-a-field)
      - [Create a review](#create-a-review)
    - [Support Endpoints](#support-endpoints)
      - [Create support request](#create-support-request)
      - [Get user's support requests](#get-users-support-requests)
    - [Report Endpoints (Admin only)](#report-endpoints-admin-only)
      - [Generate revenue report](#generate-revenue-report)
  - [License](#license)
## Features

- User authentication (register, login, profile management)
- Field listings and availability search
- Booking management with services and payment tracking
- Reviews and ratings for fields
- Customer support request system
- Admin dashboard for managing fields, bookings, and services
- Revenue reporting

## Tech Stack

- Node.js & Express.js
- SQLite with Sequelize ORM
- JSON Web Tokens for authentication
- bcryptjs for password hashing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd football-field-booking-api
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
PORT=3000
NODE_ENV=development
JWT_SECRET=your_secret_key
```

### Running the API

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3000/api`.

## API Documentation

### Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful message",
  "data": {
    // Response data here
  }
}
```

For errors:

```json
{
  "success": false,
  "message": "Error message",
  "data": {}
}
```

### Base URL
`http://localhost:3000/api`

### Authentication Endpoints

#### Register a new user
- **Endpoint**: `POST /api/users/register`
- **Request body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "0123456789",
  "password": "password123"
}
```
- **Response (201)**:
```json
{
  "success": true,
  "message": "User registered successfully. Please verify your account.",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "0123456789",
      "isVerified": false,
      "role": "user"
    }
  }
}
```

#### Verify account
- **Endpoint**: `POST /api/users/verify`
- **Request body**:
```json
{
  "email": "john@example.com",
  "code": "123456"
}
```
- **Response (200)**:
```json
{
  "success": true,
  "message": "Account verified successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "0123456789",
      "isVerified": true,
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
- **Endpoint**: `POST /api/users/login`
- **Request body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response (200)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "0123456789",
      "isVerified": true,
      "role": "user",
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get user profile
- **Endpoint**: `GET /api/users/profile`
- **Headers**: `Authorization: Bearer {token}`
- **Response (200)**:
```json
{
  "success": true,
  "message": "fetching data successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "0123456789",
      "isVerified": true,
      "role": "user"
    }
  }
}
```

#### Update user profile
- **Endpoint**: `PUT /api/users/profile`
- **Headers**: `Authorization: Bearer {token}`
- **Request body**:
```json
{
  "name": "John Updated",
  "phone": "9876543210"
}
```
- **Response (200)**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Updated",
      "email": "john@example.com",
      "phone": "9876543210",
      "isVerified": true,
      "role": "user"
    }
  }
}
```

#### Change password
- **Endpoint**: `POST /api/users/change-password`
- **Headers**: `Authorization: Bearer {token}`
- **Request body**:
```json
{
  "currentPassword": "password123",
  "newPassword": "newPassword123"
}
```
- **Response (200)**:
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": {}
}
```

### Field Endpoints

#### Get info of all fields
- **Endpoint**: `GET /api/fields`
- **Response (200)**:
```json
{
  "success": true,
  "message": "fetching data successful",
  "data": {
      "fields": [
        {
          "id": 1,
          "name": "field 1",
          "short_description": "field1_short_des",
          "full_description": "field1_full_des",
          "grass_type": "artificial",
          "price": 200000,
          "priceWithLights": 250000,
          "lighting_system": {
              "number_bulbs": 10,
              "power": "1000W"
          },
          "capacity": {
              "players": 10,
              "seats": 100
          },
          "openTime": "07:00",
          "closeTime": "22:00"
        }
      ]
  }
}
```

#### Get field info by ID
- **Endpoint**: `GET /api/fields/:id`
- **Response (200)**:
```json
{
  "success": true,
  "message": "fetching data successful",
  "data": {
      "fields": [
        {
          "id": 1,
          "name": "field 1",
          "short_description": "field1_short_des",
          "full_description": "field1_full_des",
          "grass_type": "artificial",
          "price": 200000,
          "priceWithLights": 250000,
          "lighting_system": {
              "number_bulbs": 10,
              "power": "1000W"
          },
          "capacity": {
              "players": 10,
              "seats": 100
          },
          "openTime": "07:00",
          "closeTime": "22:00"
        }
      ]
  }
}
```

#### Get available time slots
- **Endpoint**: `GET /api/fields/:fieldId/available-slots/:date`
- **Response (200)**:
```json
{
  "success": true,
  "message": "fetching data successful",
  "data": {
    "field": "Field 1",
    "date": "2023-07-25",
    "availableTimeSlots": [
      {
        "startTime": "07:00",
        "endTime": "08:00"
      },
      {
        "startTime": "08:00",
        "endTime": "09:00"
      },
      {
        "startTime": "09:00",
        "endTime": "10:00"
      }
    ]
  }
}
```

#### Get booked time slots by fieldID and date
- **Endpoint**: `GET /api/booked-time-slots/:filedId/:date`
- **Response (200)**:
```json
{
  "success": true,
  "message": "fetching data successful",
  "data": {
    "field": "Field 1",
    "fieldId": 1,
    "date": "2023-05-14",
    "booked_time_slots": [
      { 
        "team1": "Doi bong thieu lam",
        "team2": "MU",
        "startTime": "07:00",
        "endTime": "08:00",
        "bookedBy": "userid",
        "bookedAt": "datetime"
      },
      {
        "team1": "23H50301",
        "team2": "20E20101",
        "startTime": "18:00",
        "bookedBy": "userid",
        "bookedAt": "datetime"
        
      },
      {
        "team1": "Real Madrid CF",
        "team2": "Barcelona FC",
        "startTime": "20:00",
        "endTime": "22:00",
        "bookedBy": "userid",
        "bookedAt": "datetime"
      }
    ]
  }
}
```

#### Get booked time slots by date
- **Endpoint**: `GET /api/booked-time-slots/:date`
- **Response (200)**:
```json
{
  "success": true,
  "message": "fetching data successful",
  "data": {
    "date": "2023-05-14",
    "fields": [
      {
        "field": "Field 1",
        "id": 1,
        "booked_time_slots": [
          { 
            "team1": "Doi bong thieu lam",
            "team2": "MU",
            "startTime": "09:00",
            "endTime": "10:00",
            "bookedBy": "userid",
            "bookedAt": "datetime"
          },
          {
            "team1": "23H50301",
            "team2": "20E20101",
            "startTime": "18:00",
            "endTime": "10:00",
            "bookedBy": "userid",
            "bookedAt": "datetime"
            
          },
          {
            "team1": "Real Madrid CF",
            "team2": "Barcelona FC",
            "startTime": "20:00",
            "endTime": "22:00",
            "bookedBy": "userid",
            "bookedAt": "datetime"
          }
        ]
      },
      {
        "field": "Field 2",
        "id": 2,
        "booked_time_slots": [
          { 
            "team1": "Doi bong thieu lam",
            "team2": "MU",
            "startTime": "07:00",
            "endTime": "08:00",
            "bookedBy": "userid",
            "bookedAt": "datetime"
          },
          {
            "team1": "23H50301",
            "team2": "20E20101",
            "startTime": "18:00",
            "bookedBy": "userid",
            "bookedAt": "datetime"
            
          },
          {
            "team1": "Real Madrid CF",
            "team2": "Barcelona FC",
            "startTime": "20:00",
            "endTime": "22:00",
            "bookedBy": "userid",
            "bookedAt": "datetime"
          }
        ]
      }
    ]
  }
}
```

#### Create a new field (admin only)
- **Endpoint**: `POST /api/fields`
- **Headers**: `Authorization: Bearer {admin_token}`
- **Request body**:
```json
{
  "name": "Field 4",
  "description": "Premium 11-a-side field with natural grass",
  "type": "11-a-side",
  "price": 500000,
  "priceWithLights": 600000,
  "openTime": "07:00",
  "closeTime": "22:00",
  "image": "field4.jpg"
}
```
- **Response (201)**:
```json
{
  "success": true,
  "message": "Field created successfully",
  "data": {
    "field": {
      "id": 4,
      "name": "Field 4",
      "description": "Premium 11-a-side field with natural grass",
      "type": "11-a-side",
      "price": 500000,
      "priceWithLights": 600000,
      "openTime": "07:00",
      "closeTime": "22:00",
      "status": "available",
      "image": "field4.jpg"
    }
  }
}
```

### Booking Endpoints

#### Create a new booking
- **Endpoint**: `POST /api/bookings`
- **Headers**: `Authorization: Bearer {token}`
- **Request body**:
```json
{
  "fieldId": 1,
  "date": "2023-07-25",
  "startTime": "08:00",
  "endTime": "10:00",
  "useLights": false,
  "serviceIds": [1, 3],
  "quantities": [2, 1],
  "paymentMethod": "bank_transfer"
}
```
- **Response (201)**:
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "booking": {
      "id": 1,
      "userId": 1,
      "fieldId": 1,
      "date": "2023-07-25",
      "startTime": "08:00",
      "endTime": "10:00",
      "useLights": false,
      "totalPrice": 500000,
      "depositAmount": 150000,
      "paymentStatus": "pending",
      "bookingStatus": "pending",
      "fieldPrice": 400000,
      "servicesTotal": 100000
    }
  }
}
```

#### Get user's bookings
- **Endpoint**: `GET /api/bookings/user`
- **Headers**: `Authorization: Bearer {token}`
- **Response (200)**:
```json
{
  "success": true,
  "message": "fetching data successful",
  "data": {
    "bookings": [
      {
        "id": 1,
        "userId": 1,
        "fieldId": 1,
        "date": "2023-07-25",
        "startTime": "08:00",
        "endTime": "10:00",
        "totalPrice": 500000,
        "depositAmount": 150000,
        "paymentStatus": "pending",
        "bookingStatus": "pending",
        "Field": {
          "id": 1,
          "name": "Field 1",
          "type": "5-a-side"
        }
      }
    ]
  }
}
```

#### Get booking by ID
- **Endpoint**: `GET /api/bookings/user/:id`
- **Headers**: `Authorization: Bearer {token}`
- **Response (200)**:
```json
{
  "success": true,
  "message": "fetching data successful",
  "data": {
    "booking": {
      "id": 1,
      "userId": 1,
      "fieldId": 1,
      "date": "2023-07-25",
      "startTime": "08:00",
      "endTime": "10:00",
      "useLights": false,
      "totalPrice": 500000,
      "depositAmount": 150000,
      "paymentStatus": "pending",
      "bookingStatus": "pending",
      "Field": {
        "id": 1,
        "name": "Field 1",
        "type": "5-a-side"
      },
      "BookingServices": [
        {
          "id": 1,
          "bookingId": 1,
          "serviceId": 1,
          "quantity": 2,
          "price": 50000,
          "totalPrice": 100000,
          "Service": {
            "id": 1,
            "name": "Football",
            "description": "Rent a football"
          }
        }
      ]
    }
  }
}
```

#### Update booking payment proof
- **Endpoint**: `PUT /api/bookings/:id/payment`
- **Headers**: `Authorization: Bearer {token}`
- **Request body**:
```json
{
  "paymentProof": "payment_receipt.jpg"
}
```
- **Response (200)**:
```json
{
  "success": true,
  "message": "Payment proof uploaded successfully",
  "data": {
    "booking": {
      "id": 1,
      "paymentProof": "payment_receipt.jpg",
      "paymentStatus": "deposit_paid"
    }
  }
}
```

#### Cancel booking
- **Endpoint**: `PUT /api/bookings/:id/cancel`
- **Headers**: `Authorization: Bearer {token}`
- **Request body**:
```json
{
  "cancellationReason": "Unable to attend due to emergency"
}
```
- **Response (200)**:
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "refundStatus": "refunded",
    "booking": {
      "id": 1,
      "bookingStatus": "cancelled",
      "cancellationReason": "Unable to attend due to emergency",
      "paymentStatus": "refunded"
    }
  }
}
```

### Service Endpoints

#### Get all active services
- **Endpoint**: `GET /api/services`
- **Response (200)**:
```json
{
  "success": true,
  "message": "fetching data successful",
  "data": {
    "services": [
      {
        "id": 1,
        "name": "Football",
        "description": "Rent a football",
        "price": 50000,
        "category": "equipment",
        "status": "active"
      },
      {
        "id": 2,
        "name": "Referee",
        "description": "Professional referee service",
        "price": 200000,
        "category": "staff",
        "status": "active"
      }
    ]
  }
}
```

#### Get service by ID
- **Endpoint**: `GET /api/services/:id`
- **Response (200)**:
```json
{
  "success": true,
  "message": "fetching data successful",
  "data": {
    "service": {
      "id": 1,
      "name": "Football",
      "description": "Rent a football",
      "price": 50000,
      "category": "equipment",
      "status": "active",
      "image": "football.jpg"
    }
  }
}
```

#### Create a new service (admin only)
- **Endpoint**: `POST /api/services`
- **Headers**: `Authorization: Bearer {admin_token}`
- **Request body**:
```json
{
  "name": "Team Uniforms",
  "description": "Set of jerseys for your team",
  "price": 150000,
  "category": "equipment",
  "image": "uniforms.jpg"
}
```
- **Response (201)**:
```json
{
  "success": true,
  "message": "Service created successfully",
  "data": {
    "service": {
      "id": 5,
      "name": "Team Uniforms",
      "description": "Set of jerseys for your team",
      "price": 150000,
      "category": "equipment",
      "status": "active",
      "image": "uniforms.jpg"
    }
  }
}
```

### Review Endpoints

#### Get all reviews for a field
- **Endpoint**: `GET /api/reviews/field/:fieldId`
- **Response (200)**:
```json
{
  "success": true,
  "message": "fetching data successful",
  "data": {
    "field": "Field 1",
    "averageRating": 4.5,
    "totalReviews": 2,
    "reviews": [
      {
        "id": 1,
        "userId": 1,
        "fieldId": 1,
        "rating": 5,
        "comment": "Excellent field, very well maintained!",
        "createdAt": "2023-07-20T10:15:30.000Z",
        "User": {
          "id": 1,
          "name": "John Doe"
        }
      },
      {
        "id": 2,
        "userId": 2,
        "fieldId": 1,
        "rating": 4,
        "comment": "Good field, but lighting could be improved",
        "createdAt": "2023-07-22T14:30:45.000Z",
        "User": {
          "id": 2,
          "name": "Jane Smith"
        }
      }
    ]
  }
}
```

#### Create a review
- **Endpoint**: `POST /api/reviews/field/:fieldId`
- **Headers**: `Authorization: Bearer {token}`
- **Request body**:
```json
{
  "rating": 5,
  "comment": "Excellent field, very well maintained!"
}
```
- **Response (201)**:
```json
{
  "success": true,
  "message": "Review submitted successfully",
  "data": {
    "review": {
      "id": 1,
      "userId": 1,
      "fieldId": 1,
      "rating": 5,
      "comment": "Excellent field, very well maintained!",
      "createdAt": "2023-07-20T10:15:30.000Z"
    }
  }
}
```

### Support Endpoints

#### Create support request
- **Endpoint**: `POST /api/support`
- **Headers**: `Authorization: Bearer {token}`
- **Request body**:
```json
{
  "subject": "Problem with booking",
  "message": "I need to reschedule my booking but the system doesn't allow me to change the date."
}
```
- **Response (201)**:
```json
{
  "success": true,
  "message": "Support request submitted successfully",
  "data": {
    "supportRequest": {
      "id": 1,
      "userId": 1,
      "subject": "Problem with booking",
      "message": "I need to reschedule my booking but the system doesn't allow me to change the date.",
      "status": "open",
      "createdAt": "2023-07-25T09:30:00.000Z"
    }
  }
}
```

#### Get user's support requests
- **Endpoint**: `GET /api/support/user`
- **Headers**: `Authorization: Bearer {token}`
- **Response (200)**:
```json
{
  "success": true,
  "message": "fetching data successful",
  "data": {
    "supportRequests": [
      {
        "id": 1,
        "userId": 1,
        "subject": "Problem with booking",
        "message": "I need to reschedule my booking but the system doesn't allow me to change the date.",
        "status": "in_progress",
        "response": "We are looking into this issue and will get back to you soon.",
        "createdAt": "2023-07-25T09:30:00.000Z",
        "updatedAt": "2023-07-25T10:15:00.000Z"
      }
    ]
  }
}
```

### Report Endpoints (Admin only)

#### Generate revenue report
- **Endpoint**: `GET /api/reports/revenue?startDate=2023-07-01&endDate=2023-07-31`
- **Headers**: `Authorization: Bearer {admin_token}`
- **Response (200)**:
```json
{
  "success": true,
  "message": "fetching data successful",
  "data": {
    "startDate": "2023-07-01",
    "endDate": "2023-07-31",
    "totalRevenue": 5000000,
    "fieldRevenueOnly": 4500000,
    "serviceRevenueOnly": 500000,
    "revenueByField": [
      {
        "fieldId": 1,
        "revenue": 3000000,
        "bookings": 15,
        "Field": {
          "name": "Field 1"
        }
      },
      {
        "fieldId": 2,
        "revenue": 2000000,
        "bookings": 10,
        "Field": {
          "name": "Field 2"
        }
      }
    ],
    "serviceRevenue": [
      {
        "serviceId": 1,
        "revenue": 300000,
        "totalQuantity": 30,
        "Service": {
          "name": "Football",
          "category": "equipment"
        }
      },
      {
        "serviceId": 2,
        "revenue": 200000,
        "totalQuantity": 1,
        "Service": {
          "name": "Referee",
          "category": "staff"
        }
      }
    ],
    "revenueByDate": [
      {
        "date": "2023-07-01",
        "revenue": 500000,
        "bookings": 2
      },
      {
        "date": "2023-07-02",
        "revenue": 700000,
        "bookings": 3
      }
    ]
  }
}
```

## License

This project is licensed under the MIT License.
