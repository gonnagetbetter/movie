# Movie API

A Node.js application for managing movies with authentication.

## Architecture Overview

This application follows a modular architecture with the following components:

- **Express.js Framework**: Handles HTTP requests and routing
- **Sequelize ORM**: Manages database operations with SQLite
- **JWT Authentication**: Secures API endpoints
- **MVC-like Structure**:
  - **Models**: Define data structure (Movie, Actor, User)
  - **Controllers**: Handle business logic
  - **Routes**: Define API endpoints
  - **Middleware**: Manage authentication and request processing

### Key Features

- User authentication (register/login)
- Movie management (CRUD operations)
- Actor management with many-to-many relationship to movies
- Data validation and error handling

## Running the Application

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Environment Variables

This application uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```
PORT=8000                       # Port the application will run on
JWT_SECRET=your_secret_key      # Secret key for JWT token generation and verification
DB_DIALECT=sqlite               # Database dialect (sqlite, mysql, postgres, etc.)
DB_HOST=./dev.sqlite            # Database host/path
```

You can also use the provided `.env.example` file as a template.

### Local Development

For local development without Docker:

```bash
# Install dependencies
npm install

# Start in development mode with auto-reloading
npm run start:dev
```

The application will be available at:
- http://localhost:8000/api/v1/auth - for authentication endpoints
- http://localhost:8000/api/v1 - for protected movie endpoints (requires authentication)

## Docker Setup

### Building the Docker Image

To build the Docker image, run the following command from the project root:

```bash
docker build -t gonnagetbetter/movies .
```


### Running the Docker Container

To run the application in a Docker container:

```bash
docker run --name movies -p 8000:8050 -e APP_PORT=8050 gonnagetbetter/movies
```

This command:
- Creates a container named "movies"
- Maps port 8050 inside the container to port 8000 on your host machine
- Sets the APP_PORT environment variable to 8050
- Uses the image you built earlier

### Accessing the Application

Once the container is running, you can access the API at:
- http://localhost:8000/api/v1/auth - for authentication endpoints
- http://localhost:8000/api/v1 - for protected movie endpoints (requires authentication)
