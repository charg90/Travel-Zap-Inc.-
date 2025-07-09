# Movie Review Platform

A full-stack movie review platform built with Next.js 15 (frontend) and NestJS (backend). This application allows users to browse movies, read reviews, and submit their own reviews.

## 🚀 Features

- Modern, responsive UI with Tailwind CSS
- User authentication with NextAuth.js
- RESTful API with NestJS
- TypeScript for type safety
- Docker support for easy deployment
- Environment-based configuration

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Docker (optional, for containerized deployment)
- PostgreSQL (or Docker to run it in a container)

## 🛠️ Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd movie
```

### 2. Set Up Environment Variables

Create `.env` files in both front-end and back-end directories:

#### Frontend (front-end/.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
# Add other frontend environment variables here
```

#### Backend (back-end/.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/moviedb
JWT_SECRET=your-jwt-secret
# Add other backend environment variables here
```

### 3. Install Dependencies

Run in both front-end and back-end directories:

```bash
# In project root
cd front-end && npm install
cd ../back-end && npm install
```

### 4. Start the Development Servers

#### Option 1: Run with Docker (Recommended)

```bash
# From project root
docker-compose up --build
```

This will start:
- Frontend on http://localhost:3001
- Backend on http://localhost:3000
- PostgreSQL on port 5432

#### Option 2: Run Manually

In separate terminal windows:

```bash
# Terminal 1 - Backend
cd back-end
npm run start:dev

# Terminal 2 - Frontend
cd front-end
npm run dev
```

## 🌐 API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
  - Body: `{ "email": string, "password": string, "name": string }`
  - Returns: `{ "message": "User registered successfully" }`

- `POST /auth/login` - Login user
  - Body: `{ "email": string, "password": string }`
  - Returns: JWT token and user data

### Movies

- `GET /movies` - Get all movies with pagination and search
  - Query Params: 
    - `page`: number (default: 1)
    - `limit`: number (default: 10)
    - `search`: string (optional)
  - Returns: Paginated list of movies

- `GET /movies/:id` - Get movie by ID
  - Returns: Movie details

- `POST /movies` - Create a new movie
  - Body: `CreateMovieDto`
  - Returns: Created movie

- `PATCH /movies/:id` - Update a movie
  - Body: `UpdateMovieDto`
  - Returns: Updated movie

- `DELETE /movies/:id` - Delete a movie
  - Returns: 204 No Content

### Actors

- `GET /actors` - Get all actors with pagination and search
  - Query Params:
    - `page`: number (default: 1)
    - `limit`: number (default: 10)
    - `search`: string (optional)
    - `sortBy`: string (optional)
    - `sortOrder`: 'ASC' | 'DESC' (default: 'ASC')
  - Returns: Paginated list of actors

- `GET /actors/:id` - Get actor by ID
  - Returns: Actor details

- `POST /actors` - Create a new actor
  - Body: `CreateActorDto`
  - Returns: Created actor

- `POST /actors/:actorId/add-to-movie/:movieId` - Add actor to a movie
  - Returns: Updated movie with actor

### Ratings

- `GET /ratings` - Get all ratings
  - Returns: List of all ratings

- `GET /ratings/:id` - Get rating by ID
  - Returns: Rating details

- `POST /ratings` - Create a new rating
  - Body: `CreateRatingDto`
  - Returns: Created rating

- `PATCH /ratings/:id` - Update a rating
  - Body: `UpdateRatingDto`
  - Returns: Updated rating

- `DELETE /ratings/:id` - Delete a rating
  - Returns: 204 No Content

## 🧪 Testing

Run tests for both frontend and backend:

```bash
# Frontend tests
cd front-end
npm test

# Backend tests
cd ../back-end
npm test
```

## 🏗️ Production Build

To create a production build:

```bash
# Frontend
cd front-end
npm run build

# Backend
cd ../back-end
npm run build
```

## 🐳 Docker Deployment

### Build and run in production mode:

```bash
docker-compose up --build
```



## 📝 Additional Notes

- The frontend uses Next.js 15 with App Router for optimal performance and SEO.
- The backend is built with NestJS, following clean architecture principles.
- Authentication is handled with JWT tokens.
- The database schema is managed with TypeORM migrations.
- Environment variables are used for configuration management.


