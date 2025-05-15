# Football Field Booking API

A RESTful API for a football (soccer) field booking system built with Express.js and SQLite.

## Features

- User Management
  - Registration and email verification
  - Login with single device enforcement (only one active device allowed per user)
  - Profile management
  - Password change
- Field Management
  - Create, list, and search fields
  - View field availability
- Booking System
  - Book fields with specific time slots
  - Add additional services (equipment rental, referee, etc.)
  - Payment tracking
  - Booking cancellation
- Reviews and Ratings
  - Rate and review fields after bookings
- Admin Management
  - Comprehensive dashboard for field management
  - Revenue reporting
  - User management
- Support System
  - Create and track support requests

## Single Device Login Feature

This API implements a security feature that allows only one device to be logged in at a time per user account. If a user logs in from a new device, all other sessions on different devices will be automatically invalidated.

## Tech Stack

- Node.js & Express.js
- SQLite with Sequelize ORM
- JWT for authentication
- bcryptjs for password hashing

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
NODE_ENV=development
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
DATABASE_PATH=./database/football-field.sqlite
```

## Database Setup

Initialize the database with tables:
```bash
node src/utils/syncDatabase.js
```

To recreate all tables (WARNING: this will delete all data):
```bash
node src/utils/syncDatabase.js --force
```

## Running the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The API will be available at `http://localhost:3000/api`.

## API Documentation

See [API Documentation](./api_docs.md) for detailed endpoint documentation.

## License

MIT

