# Appointment-Based Logistics API

A scalable backend API for appointment-based logistics operations, built with Node.js, Express, and MongoDB.

## Features

- Partner selection and priority system
- Service state management
- Hub operations for appointment deliveries
- Dynamic slot and LCR control system
- Real-time price and availability system
- Customer communication and exception management
- End-to-end journey priority management

## API Specifications

- API versioning (e.g., api/v1/<resource>)
- RESTful design with proper HTTP verbs
- Comprehensive logging
- Health check endpoint
- Unit tests for all endpoints

## Tech Stack

- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- Winston for logging
- Jest for testing

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on the `.env.example`
4. Start the development server:
   ```
   npm run dev
   ```

### Running Tests

```
npm test
```

## API Endpoints

### Health Check
- GET `/api/v1/healthcheck`

### Authentication
- POST `/api/v1/auth/register`
- POST `/api/v1/auth/login`

### Partners
- GET `/api/v1/partners`
- POST `/api/v1/partners`
- GET `/api/v1/partners/:id`
- PUT `/api/v1/partners/:id`
- DELETE `/api/v1/partners/:id`

### Appointments
- GET `/api/v1/appointments`
- POST `/api/v1/appointments`
- GET `/api/v1/appointments/:id`
- PUT `/api/v1/appointments/:id`
- DELETE `/api/v1/appointments/:id`

### Hubs
- GET `/api/v1/hubs`
- POST `/api/v1/hubs`
- GET `/api/v1/hubs/:id`
- PUT `/api/v1/hubs/:id`
- DELETE `/api/v1/hubs/:id`

### Slots
- GET `/api/v1/slots`
- POST `/api/v1/slots`
- GET `/api/v1/slots/:id`
- PUT `/api/v1/slots/:id`
- DELETE `/api/v1/slots/:id`

## License

MIT
