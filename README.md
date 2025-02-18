# Blog Post Backend

## Description
This is a NestJS backend application for managing blog posts, comments, and user authentication.

## Required Dependencies

### Strapi Service

In case you want to run Strapi locally, you can use the [blog-post-cms](https://github.com/YKK101/blog-post-cms) repository.

### Postgres Service

The development docker-compose already provide you with a postgres service.

### Redis Service

The development docker-compose already provide you with a redis service.

## Development Running Steps

To run the application in a development environment using Docker Compose, follow these steps:

1. Copy the `.env.example` to `.env` and fill in the values.

2. Run the following command to start the application:

   ```bash
   docker-compose -f docker/development/docker-compose.yml up --build
   ```

3. You can now access the application at http://localhost:3000

### Api Document

Api document is available at http://localhost:3000/api