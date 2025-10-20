# NestJS Monorepo - User Management System

A NestJS monorepo application featuring microservices architecture with Gateway and Authentication services communicating via TCP.

## Architecture

- **Gateway** (Port 3000): Public HTTP REST API
- **Authentication** (Port 3001): Internal microservice for user management
- **MongoDB** (Port 27017): Database
- **Communication**: TCP between services

## Features

- User registration and authentication
- JWT-based login with protected routes
- Health checks (liveness, readiness)
- Rate limiting (10 req/min global, 5 req/min for sensitive endpoints)
- Swagger API documentation
- Docker support

## Prerequisites

- Node.js 18.x or higher
- MongoDB (local or Docker)
- Docker & Docker Compose (optional)

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root:
```env
MONGODB_URI=mongodb://localhost:27017/nestjs-challenge
GATEWAY_PORT=3000
AUTH_TCP_HOST=localhost
AUTH_TCP_PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=1h
```

### 3. Run Locally

**Option A: With Local MongoDB**
```bash
# Terminal 1 - Start Authentication Service
npm run start:dev authentication

# Terminal 2 - Start Gateway
npm run start:dev gateway
```

**Option B: With Docker**
```bash
docker-compose up --build
```

## API Documentation

Access Swagger UI at: `http://localhost:3000/api`

## Available Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login (returns JWT token)
- `GET /auth/users` - Get all users (requires JWT)
- `GET /auth/profile` - Get current user (requires JWT)

### Health
- `GET /health` - Full health check
- `GET /health/ready` - Readiness probe
- `GET /health/live` - Liveness probe

## Tech Stack

- NestJS 10.x
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Swagger/OpenAPI
- Docker

## Author

Emanuel

---