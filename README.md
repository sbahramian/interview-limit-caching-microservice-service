# Interview Limit Caching Microservice Service Challenge (API Rate Limiting & Caching System) 

```bash
╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱
╱╱                                             ╱╱
╱╱  ╭━━━╮╱╱╱╱╱╱╱╱╭╮╭━━╮╱╱╱╭╮                   ╱╱
╱╱  ┃╭━╮┃╱╱╱╱╱╱╱╱┃┃┃╭╮┃╱╱╱┃┃                   ╱╱
╱╱  ┃╰━━┳━━┳━━┳┳━╯┃┃╰╯╰┳━━┫╰━┳━┳━━┳╮╭┳┳━━┳━╮   ╱╱
╱╱  ╰━━╮┃╭╮┃┃━╋┫╭╮┃┃╭━╮┃╭╮┃╭╮┃╭┫╭╮┃╰╯┣┫╭╮┃╭╮╮  ╱╱
╱╱  ┃╰━╯┃╭╮┃┃━┫┃╰╯┃┃╰━╯┃╭╮┃┃┃┃┃┃╭╮┃┃┃┃┃╭╮┃┃┃┃  ╱╱
╱╱  ╰━━━┻╯╰┻━━┻┻━━╯╰━━━┻╯╰┻╯╰┻╯╰╯╰┻┻┻┻┻╯╰┻╯╰╯  ╱╱
╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱
```

### Technologies used in this project:
   * NodeJs
   * Nest.js
   * Mongodb
   * Redis
   * DDD architecture
   * CQRS
   * i18n
   * Docker

Welcome to Interview Limit Caching Microservice Service Challenge (API Rate Limiting & Caching System) ! This README will guide you through setting up the project, accessing documentation, understanding the database design and backend architecture, as well as explaining the backend routes and sample APIs.

## Table of Contents

1. [Introduction](#introduction)
2. [Technologies Used](#technologies-used)
3. [Backend Architecture](#backend-architecture)
   - [Project Architecture](#project-architecture)
   - [Presentation Layer](#presentation-layer)
   - [Application Layer](#application-layer)
   - [Domain Layer](#domain-layer)
   - [Infrastructure Layer](#infrastructure-layer)
4. [Installation](#installation)
   - [Local Installation](#local-installation)
   - [Docker Installation](#docker-installation)
5. [Accessing API Documentation](#accessing-api-documentation)
6. [Backend Routes](#backend-routes)
7. [Sample APIs](#sample-apis)
8. [Database Design](#database-design)
9. [Contributing](#contributing)
10. [License](#license)


## Backend Architecture

The backend architecture of this project follows the principles of Domain-Driven Design (DDD) and Clean Architecture. The architecture is structured into layers, including:

- **Presentation Layer**: Controllers, decorators, DTOs, and OpenAPI.
- **Application Layer**: Interfaces, mapping, service (commands, queries, utilities), and use cases.
- **Domain Layer**: Domain models and services (factories, repositories).
- **Infrastructure Layer**: Interfaces, localization, and modules.

### Project Architecture

This document outlines the architecture of the project.

### Presentation Layer

The presentation layer deals with the user interface. It includes the following components:

- Controllers: Handle incoming requests.
- Decorators: Add functionality to classes or methods.
- DTOs (Data Transfer Objects): Exchange data between layers.
- OpenAPI: Document the API.

### Application Layer

The application layer contains the business logic of the application. It consists of the following components:

- Interfaces: Define contracts.
- Mapping: Transform data between layers.
- Service:
  - Commands: Execute specific actions.
  - Queries: Retrieve data.
  - Utilities: Common functionality.
- Use Cases: Represent high-level actions.

### Domain Layer

The domain layer represents the core domain logic of the application. It includes the following components:

- Services:
  - Factories: Create domain objects.
  - Repositories: Persist and retrieve domain objects.

### Infrastructure Layer

The infrastructure layer provides support to the upper layers. It includes the following components:

- Interfaces: Define contracts with external systems.
- Localization: Handle internationalization and localization concerns.
- Modules: Encapsulate reusable infrastructure components.

Each layer is responsible for specific concerns, and the sublayers help organize and manage the complexity of the application architecture. This architecture follows the principles of Domain-Driven Design (DDD) and CQRS (Command Query Responsibility Segregation), which promote a clear separation of concerns and maintainability of the codebase.

## Installation

### Local Installation

To run the project locally, follow these steps:

1. Clone the repository to your local machine:

   ```bash
      git clone https://github.com/sbahramian/interview-limit-caching-microservice-service.git
   ```

2. Navigate to the project directory:

   ```bash
      cd interview-limit-caching-microservice-service
   ```

3. Install dependencies:

   ```bash
      yarn install
   ```
 
4. Build the application:

Once the dependencies are installed and environment variables are set up, build the application:

   ```bash
      yarn build
   ```

5. Please create `.env` file. you can use from sample `.env.example`:

   ```bash
      IS_DEVELOPMENT=
      IS_TEST_MODE=
      LOG_LEVEL=
      LOG_PRETTY=
      HTTP_PORT=
      SENTRY_DSN=
      JWT_SLAT=
      MONGO_DB=
      MONGO_HOST=
      MONGO_USER=
      MONGO_PASS=
      MONGO_PORT=
      MONGO_QUERY=
      REDIS_DB=
      REDIS_HOST=
      REDIS_USER=
      REDIS_PASS=
      REDIS_PORT=
      EXPIRES_CACHE_TIME=
      RATE_LIMIT_MAX_REQUESTS=
      RATE_LIMIT_WINDOW_IN_SECONDS=
   ```

6. Start the server:

   ```bash
      yarn start:dev
   ```

7. Run tests:

To ensure that your application functions as expected, run the tests with the following command:

   ```bash
      yarn test
   ```

### Docker Installation

Before you begin, ensure you have the following installed:

- **Docker**: Install from [here](https://docs.docker.com/get-docker/).
- **Docker Compose**: Install from [here](https://docs.docker.com/compose/install/).

#### 4. Build and run the application with docker

To build and run the application using Docker, follow these steps:


1. Build the Docker containers:

```bash
docker-compose up --build
```

This command will build the Docker images and start the containers.

2. Run the containers in the background:

If you want to run the containers in detached mode (background):

```bash
docker-compose up -d
```

3. Check the logs:

To see the logs from the running containers:

```bash
docker-compose logs -f
```

4. Stop the containers:

If you need to stop the running containers:

```bash
docker-compose down
```

## Accessing API Documentation (Swagger)

This project uses [Swagger](https://swagger.io/) for API documentation. After the application is running, you can access the Swagger UI to explore the available endpoints and their details.

Open your browser and navigate to the following URL:

```bash
http://localhost:${PORT}/doc/v1
```

Replace ${PORT} with the actual port from your .env file (default: 3000).