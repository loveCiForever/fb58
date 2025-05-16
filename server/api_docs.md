# Football Field Booking API

A RESTful API for a football field booking system built with Express.js and SQLite.

## Table of Contents

- [Football Field Booking API](#football-field-booking-api)
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
      - [Cancel booking](#cancel-booking)
      - [Get user's support requests](#get-users-support-requests)
      - [Confirm booking (Admin only)](#confirm-booking-admin-only)
      - [Reject booking (Admin only)](#reject-booking-admin-only)
      - [Get Field Shifts](#get-field-shifts)
    - [Report Endpoints (Admin only)](#report-endpoints-admin-only)
      - [Generate revenue report](#generate-revenue-report)
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
  "error": {}
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
  "password": "Password123",
  "phone": "0123456789"
}
```
- **Response (201)**:
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Verify account
- **Endpoint**: `GET /api/users/verify/{token}`
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
  "password": "Password123"
}
```
- **Response (200)**:
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
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
  "data": [
    {
      "id": "field_id",
      "name": "Field Name",
      "short_description": "Short description",
      "full_description": "Full description",
      "grass_type": "natural",
      "price": 100000,
      "capacity": {
        "players": 22,
        "seats": 100
      }
    }
  ]
}
```

#### Get field info by ID
- **Endpoint**: `GET /api/fields/:id`
- **Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "field_id",
    "name": "Field Name",
    "short_description": "Short description",
    "full_description": "Full description",
    "grass_type": "natural",
    "price": 100000,
    "capacity": {
      "players": 22,
      "seats": 100
    }
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

#### Get Available Shifts
- **Endpoint**: `GET /api/bookings/available-shifts`
- **Query Parameters**:
  - `fieldId`: ID của sân
  - `date`: Ngày muốn xem (format: YYYY-MM-DD)
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      "SHIFT_1",
      "SHIFT_2",
      "SHIFT_3",
      "SHIFT_4",
      "SHIFT_5",
      "SHIFT_6",
      "SHIFT_7",
      "SHIFT_8"
    ]
  }
  ```

#### Create Booking
- **Endpoint**: `POST /api/bookings`
- **Headers**: 
  - `Authorization`: Bearer token
- **Body**:
  ```json
  {
    "field": "field_id",
    "date": "2024-03-20",
    "shift": "SHIFT_1",
    "team1": "Team A",
    "team2": "Team B"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Booking created successfully",
    "data": {
      "id": "booking_id",
      "field": "field_id",
      "date": "2024-03-20T00:00:00.000Z",
      "shift": {
        "name": "SHIFT_1",
        "startTime": "06:00",
        "endTime": "08:00"
      },
      "team1": "Team A",
      "team2": "Team B",
      "totalPrice": 200000,
      "bookingStatus": "pending",
      "paymentStatus": "pending"
    }
  }
  ```

#### Get User's Bookings
- **Endpoint**: `GET /api/bookings/user`
- **Headers**: 
  - `Authorization`: Bearer token
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "booking_id",
        "field": {
          "id": "field_id",
          "name": "Field Name"
        },
        "date": "2024-03-20T00:00:00.000Z",
        "shift": {
          "name": "SHIFT_1",
          "startTime": "06:00",
          "endTime": "08:00"
        },
        "team1": "Team A",
        "team2": "Team B",
        "totalPrice": 200000,
        "bookingStatus": "pending",
        "paymentStatus": "pending"
      }
    ]
  }
  ```

#### Cancel Booking
- **Endpoint**: `PUT /api/bookings/:id/cancel`
- **Headers**: 
  - `Authorization`: Bearer token
- **Body**:
  ```json
  {
    "cancellationReason": "Reason for cancellation"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Booking cancelled successfully",
    "data": {
      "id": "booking_id",
      "bookingStatus": "cancelled",
      "cancellationReason": "Reason for cancellation"
    }
  }
  ```

#### Get All Bookings (Admin)
- **Endpoint**: `GET /api/bookings`
- **Headers**: 
  - `Authorization`: Bearer token (admin)
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "booking_id",
        "field": {
          "id": "field_id",
          "name": "Field Name"
        },
        "user": {
          "id": "user_id",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "date": "2024-03-20T00:00:00.000Z",
        "shift": {
          "name": "SHIFT_1",
          "startTime": "06:00",
          "endTime": "08:00"
        },
        "team1": "Team A",
        "team2": "Team B",
        "totalPrice": 200000,
        "bookingStatus": "pending",
        "paymentStatus": "pending"
      }
    ]
  }
  ```

#### Confirm Booking (Admin)
- **Endpoint**: `PUT /api/bookings/:id/confirm`
- **Headers**: 
  - `Authorization`: Bearer token (admin)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Booking confirmed successfully",
    "data": {
      "id": "booking_id",
      "bookingStatus": "confirmed"
    }
  }
  ```

#### Reject Booking (Admin)
- **Endpoint**: `PUT /api/bookings/:id/reject`
- **Headers**: 
  - `Authorization`: Bearer token (admin)
- **Body**:
  ```json
  {
    "rejectionReason": "Reason for rejection"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Booking rejected successfully",
    "data": {
      "id": "booking_id",
      "bookingStatus": "rejected",
      "rejectionReason": "Reason for rejection"
    }
  }
  ```

#### Get Field Shifts
- **Endpoint**: `GET /api/bookings/field-shifts`
- **Query Parameters**:
  - `fieldId`: ID của sân
  - `date`: Ngày muốn xem (format: YYYY-MM-DD)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "field": {
        "id": "field_id",
        "name": "Field Name"
      },
      "date": "2024-03-20",
      "shifts": [
        {
          "shift": "SHIFT_1",
          "startTime": "06:00",
          "endTime": "08:00",
          "isAvailable": false,
          "booking": {
            "id": "booking_id",
            "team1": "Team A",
            "team2": "Team B",
            "bookingStatus": "confirmed",
            "user": {
              "name": "John Doe",
              "email": "john@example.com"
            }
          }
        },
        {
          "shift": "SHIFT_2",
          "startTime": "08:00",
          "endTime": "10:00",
          "isAvailable": true,
          "booking": null
        }
      ]
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

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "msg": "Error message",
      "param": "field_name",
      "location": "body"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Not authorized to perform this action"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error message (in development only)"
}
```

## Admin Endpoints

### Dashboard Report
```http
GET /api/admin/dashboard
Authorization: Bearer <token>
```
Get dashboard statistics and reports for admin.

**Response:**
```json
{
    "success": true,
    "data": {
        "overview": {
            "totalUsers": 100,
            "totalFields": 5,
            "totalBookings": 500
        },
        "recentBookings": [...],
        "bookingStats": {
            "pending": 10,
            "confirmed": 400,
            "cancelled": 50,
            "rejected": 40
        },
        "revenueStats": [
            {
                "period": "2024-05",
                "totalRevenue": 10000000,
                "bookingCount": 50
            }
        ],
        "fieldPopularity": [
            {
                "fieldName": "My Dinh Stadium",
                "bookingCount": 200,
                "totalRevenue": 40000000
            }
        ],
        "peakTimes": [
            {
                "shift": "SHIFT_5",
                "bookingCount": 100
            }
        ]
    }
}
```

### User Management

#### Get All Users
```http
GET /api/admin/users
Authorization: Bearer <token>
```
Get list of all users.

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "_id": "user_id",
            "name": "User Name",
            "email": "user@email.com",
            "phone": "1234567890",
            "isVerified": true,
            "role": "user"
        }
    ]
}
```

#### Get User by ID
```http
GET /api/admin/users/:id
Authorization: Bearer <token>
```
Get user details by ID.

**Response:**
```json
{
    "success": true,
    "data": {
        "_id": "user_id",
        "name": "User Name",
        "email": "user@email.com",
        "phone": "1234567890",
        "isVerified": true,
        "role": "user"
    }
}
```

#### Update User
```http
PUT /api/admin/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Updated Name",
    "email": "updated@email.com",
    "phone": "1234567890",
    "isVerified": true
}
```
Update user information.

**Response:**
```json
{
    "success": true,
    "data": {
        "_id": "user_id",
        "name": "Updated Name",
        "email": "updated@email.com",
        "phone": "1234567890",
        "isVerified": true,
        "role": "user"
    }
}
```

#### Delete User
```http
DELETE /api/admin/users/:id
Authorization: Bearer <token>
```
Delete a user.

**Response:**
```json
{
    "success": true,
    "message": "User deleted successfully"
}
```

### Field Management

#### Get All Fields
```http
GET /api/admin/fields
Authorization: Bearer <token>
```
Get list of all fields.

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "_id": "field_id",
            "name": "Field Name",
            "short_description": "Short description",
            "full_description": "Full description",
            "type": "5-a-side",
            "price": 200000,
            "priceWithLights": 250000,
            "openTime": "06:00",
            "closeTime": "23:00",
            "status": "available",
            "image": "field.jpg",
            "capacity": {
                "players": 10,
                "seats": 20
            }
        }
    ]
}
```

#### Get Field by ID
```http
GET /api/admin/fields/:id
Authorization: Bearer <token>
```
Get field details by ID.

**Response:**
```json
{
    "success": true,
    "data": {
        "_id": "field_id",
        "name": "Field Name",
        "short_description": "Short description",
        "full_description": "Full description",
        "type": "5-a-side",
        "price": 200000,
        "priceWithLights": 250000,
        "openTime": "06:00",
        "closeTime": "23:00",
        "status": "available",
        "image": "field.jpg",
        "capacity": {
            "players": 10,
            "seats": 20
        }
    }
}
```

#### Create Field
```http
POST /api/admin/fields
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "New Field",
    "short_description": "Short description",
    "full_description": "Full description",
    "type": "5-a-side",
    "price": 200000,
    "priceWithLights": 250000,
    "openTime": "06:00",
    "closeTime": "23:00",
    "status": "available",
    "image": "field.jpg",
    "capacity": {
        "players": 10,
        "seats": 20
    }
}
```
Create a new field.

**Response:**
```json
{
    "success": true,
    "data": {
        "_id": "field_id",
        "name": "New Field",
        "short_description": "Short description",
        "full_description": "Full description",
        "type": "5-a-side",
        "price": 200000,
        "priceWithLights": 250000,
        "openTime": "06:00",
        "closeTime": "23:00",
        "status": "available",
        "image": "field.jpg",
        "capacity": {
            "players": 10,
            "seats": 20
        }
    }
}
```

#### Update Field
```http
PUT /api/admin/fields/:id
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Updated Field Name",
    "price": 250000,
    "status": "maintenance"
}
```
Update field information.

**Response:**
```json
{
    "success": true,
    "data": {
        "_id": "field_id",
        "name": "Updated Field Name",
        "price": 250000,
        "status": "maintenance",
        // ... other field properties
    }
}
```

#### Delete Field
```http
DELETE /api/admin/fields/:id
Authorization: Bearer <token>
```
Delete a field.

**Response:**
```json
{
    "success": true,
    "message": "Field deleted successfully"
}
```
