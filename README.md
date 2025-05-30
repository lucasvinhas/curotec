# Curotec Challenge

A full-stack application with a React frontend and Node.js/Express backend using PostgreSQL database.

## Prerequisites

- Node.js (v20 or higher)
- Docker and Docker Compose
- npm

## Setup Instructions

### 1. Start the Database

First, start the PostgreSQL container using Docker Compose:

```bash
docker-compose up -d
```

This will start a PostgreSQL database container with the following configuration:
- Host: `localhost`
- Port: `5432`
- Database: `mydatabase`
- Username: `user`
- Password: `password`

### 2. Setup Backend

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create an `.env` file in the backend directory with the following variables:

```bash
# Create .env file
cat > .env << EOF
DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase?schema=public"
PORT=3000
EOF
```

Or manually create the `.env` file with:

```
DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase?schema=public"
PORT=3000
```

#### Prisma Database Setup

Generate the Prisma client:

```bash
npx prisma generate
```

Run database migrations to create the tables:

```bash
npx prisma migrate dev
```

This will:
1. Create the database tables based on your Prisma schema
2. Generate the Prisma client
3. Apply any pending migrations

If you need to reset the database (⚠️ **This will delete all data**):

```bash
npx prisma migrate reset
```

To view your database in Prisma Studio (optional):

```bash
npx prisma studio
```

Start the backend development server:

```bash
npm run dev
```

The backend will be available at `http://localhost:3000`

### 3. Setup Frontend

In a new terminal, navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Development Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## Stopping the Application

To stop the database container:

```bash
docker-compose down
```

To stop and remove all data:

```bash
docker-compose down -v
```

## Project Structure

```
curotecChallenge/
├── backend/          # Node.js/Express API
├── frontend/         # React application
├── docs/            # Documentation
└── docker-compose.yml # Database container configuration
``` 