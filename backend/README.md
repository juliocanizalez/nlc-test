# Service Order Management API

A RESTful API for managing projects and service orders, built with Node.js, Fastify, TypeScript, and MySQL.

## Features

- User authentication with JWT
- CRUD operations for projects and service orders
- Validation for all requests using TypeBox
- Swagger API documentation
- Containerized with Docker and Docker Compose
- Database integration with @fastify/mysql plugin
- Database migrations with Postgrator

## Prerequisites

- [Node.js](https://nodejs.org/) (v20 required)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [Postman](https://www.postman.com/) (for testing API endpoints)

## Project Structure

```
service-order-management-api/
├── src/                            # Source code
│   ├── config/                     # Configuration
│   ├── db/                         # Database related
│   │   ├── migrations/             # SQL migrations
│   │   └── seeds/                  # Seed data
│   ├── middlewares/                # Middleware functions
│   ├── plugins/                    # Fastify plugins
│   ├── routes/                     # Route definitions
│   └── types/                      # TypeScript type declarations
├── .env.example                    # Example environment variables
├── .gitignore                      # Git ignore file
├── docker-compose.yml              # Docker Compose configuration
├── Dockerfile                      # Docker configuration
├── package.json                    # NPM package configuration
├── postgrator.config.js            # Postgrator configuration
├── README.md                       # This file
└── tsconfig.json                   # TypeScript configuration
```

## Getting Started

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/juliocanizalez/nlc-test && cd backend
```

2. Install dependencies:

```bash
npm i
```

3. Create a `.env` file from the example:

```bash
cp .env.example .env
```

4. Configure your environment variables in the `.env` file.

5. Start the MySQL container:

```bash
docker-compose up -d db
```

6. Seed the database with initial data:

```bash
npm run seed
```

7. Start the development server:

```bash
npm run dev
```

The API will be available at http://localhost:3000

### Using Docker Compose

To run the entire application with Docker Compose:

```bash
docker-compose up -d
```

This will start both the API and MySQL database in containers. The application uses Node.js 20 in production. The API will be available at http://localhost:3000.

#### Troubleshooting Docker Setup

If you encounter module not found errors, rebuild the Docker image:

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

Make sure your package.json has the correct build and start scripts:

- "build": should compile TypeScript to the dist/ directory
- "start": should run the compiled JavaScript (node dist/index.js)

##### Common Docker Issues

1. **bcrypt Native Module Error**: This project uses bcryptjs instead of bcrypt in Docker to avoid native compilation issues.

2. **Connection to MySQL**: The Docker setup waits for MySQL to be fully running before starting the API container.

3. **Resolving ARM64/AMD64 compatibility issues**: If you encounter "Exec format error" with native modules when switching between different CPU architectures, rebuild the Docker images from scratch.

4. **Migration Error**: The seed script automatically runs migrations before seeding data, so the separate migrate step might show as missing. This is normal.

## API Documentation

The API documentation is available at http://localhost:3000/api-docs when the server is running. The documentation is generated using Swagger/OpenAPI and provides a comprehensive interface to:

- Browse all available endpoints
- View request/response schemas
- Test API endpoints directly from the browser
- See authentication requirements for each endpoint
- View detailed descriptions of parameters and responses

### Swagger Features

The Swagger documentation includes:

- Detailed descriptions of all endpoints
- Request and response schemas
- Authentication requirements
- Example requests
- Data models
- Try-it-out functionality to test endpoints directly

### Testing with Swagger UI

1. Navigate to http://localhost:3000/api-docs in your browser
2. For protected endpoints, click the "Authorize" button and enter your JWT token in the format: `Bearer <your-token>`
3. Explore available endpoints grouped by tags (Auth, Projects, Service Orders)
4. Use the "Try it out" feature to test endpoints directly from the browser

### Authentication

All endpoints except for `/api/auth/register`, `/api/auth/login` and `/api-docs` require authentication. To authenticate, obtain a JWT token by logging in, and then include it in the `Authorization` header of your requests:

```
Authorization: Bearer <your-token>
```

## Database

This project uses MySQL for data storage and @fastify/mysql plugin for database connectivity. The database connection is set up as a Fastify plugin, making it accessible via `server.mysql` throughout the application.

## Database Migrations

This project uses Postgrator for database migrations. Migration files are located in `src/db/migrations/`.

- Run migrations: `npm run migrate`
- Create a new migration: Add a file in the format `XXX.do.description.sql` for "up" migrations and `XXX.undo.description.sql` for "down" migrations in the `src/db/migrations/` directory.

## Testing with Postman

The Postman collection for this API is available online at this [Postman collection](https://www.postman.com/juliocanizalez/workspace/nlc-test/collection/12747956-68af7445-79f5-4e27-8b1a-35e02f8bc973?action=share&creator=12747956)
When using the collection, set up an environment in Postman with the following variables:

- `baseUrl`: The base URL of your API (e.g., `http://localhost:3000`)
- `token`: Will be automatically set after a successful login

## Default User

When you seed the database, a default user is created:

- Username: `admin`
- Password: `password123`
- Email: `admin@example.com`
