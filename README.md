# Project and Service Order Management System

A full-stack application for managing projects and their corresponding service orders. This application allows authenticated users to create, read, update, and delete projects and service orders.

## Features

- **User Authentication**: Secure login and registration
- **Project Management**: Create, view, update, and delete projects
- **Service Order Management**: Create, view, update, and delete service orders
- **Project-Service Order Relationship**: Service orders are linked to projects
- **Responsive UI**: Works on mobile, tablet, and desktop

## Technology Stack

### Frontend

- React 18
- TypeScript
- React Router v7
- ShadCN UI (built on Radix UI)
- Axios for API requests
- Tailwind CSS
- Vite build tool

### Backend

- Node.js with Fastify
- TypeScript
- MySQL database
- JWT for authentication
- Docker containerization

## Prerequisites

Before running the application, ensure you have the following installed:

- Docker and Docker Compose
- Node.js (for local development)
- npm or yarn (for local development)

## Running the Application

### Using Docker Compose (Recommended)

The easiest way to run the entire application stack is using Docker Compose:

1. Clone the repository:

   ```
   git clone https://github.com/juliocanizalez/nlc-test
   cd nlc-test
   ```

2. Build and start the containers:

   ```
   docker-compose down && docker-compose build --no-cache && docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:3000

### Local Development

#### Backend Setup

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file with your database configuration:

   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_DATABASE=service_order_db
   DB_USER=dev
   DB_PASSWORD=password123!
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development server:
   ```
   npm run dev
   ```

#### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file for API configuration:

   ```
   VITE_API_URL=http://localhost:3000
   ```

4. Start the development server:

   ```
   npm run dev
   ```

5. Access the frontend at: http://localhost:5173

## API Documentation

The backend API provides the following endpoints:

### Authentication

- `POST /register` - Register a new user
- `POST /login` - Login and receive JWT token

### Projects

- `GET /projects` - Get all projects
- `GET /projects/:id` - Get a specific project by ID
- `POST /projects` - Create a new project
- `PUT /projects/:id` - Update a project
- `DELETE /projects/:id` - Delete a project

### Service Orders

- `GET /service-orders` - Get all service orders (can filter by project_id)
- `GET /service-orders/:id` - Get a specific service order by ID
- `POST /service-orders` - Create a new service order
- `PUT /service-orders/:id` - Update a service order
- `DELETE /service-orders/:id` - Delete a service order

## Project Structure

```
/
├── backend/                # Backend codebase
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── db/             # Database connection and models
│   │   ├── middlewares/    # Middleware functions
│   │   ├── plugins/        # Fastify plugins
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript type definitions
│   │   └── index.ts        # Main application entry
│   ├── sql/                # SQL initialization scripts
│   ├── Dockerfile          # Backend Docker configuration
│   └── package.json        # Backend dependencies
│
├── frontend/               # Frontend codebase
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── lib/            # Utilities, hooks, and context
│   │   ├── pages/          # Application pages
│   │   └── App.tsx         # Main application component
│   ├── Dockerfile          # Frontend Docker configuration
│   └── package.json        # Frontend dependencies
│
├── docker-compose.yml      # Docker Compose configuration
└── README.md               # Project documentation
```

## Environment Variables

The application uses the following environment variables:

### Backend

- `NODE_ENV` - Environment mode (development, production)
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_DATABASE` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - Secret key for JWT token generation

### Frontend

- `VITE_API_URL` - URL of the backend API
