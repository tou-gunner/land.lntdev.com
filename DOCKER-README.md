# Docker Deployment Guide

This guide explains how to deploy the application using Docker in a production environment.

## Prerequisites

- Docker and Docker Compose installed on your server
- Git (to clone the repository)
- Basic understanding of Docker concepts

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Create a `.env` file with your production environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your production values:
   ```
   NODE_ENV=production
   PORT=3000
   NEXT_PUBLIC_API_URL=<your-api-url>
   DATABASE_URL=<your-database-connection-string>
   ```

   **Important:** The `NEXT_PUBLIC_API_URL` should be set to the base URL of your API service (e.g., `https://api.example.com`). This variable is used for:
   - API route rewrites in Next.js configuration
   - Client-side API calls

## Next.js Configuration

The application is configured to run in `standalone` output mode for Next.js, which optimizes the production build by creating a minimal server-side bundle. This is controlled by the `output: 'standalone'` setting in `next.config.ts`.

The Docker build process is designed to be compatible with both standalone and regular builds, ensuring maximum flexibility.

### API Configuration

The application uses the `NEXT_PUBLIC_API_URL` environment variable to configure API endpoint rewrites. This allows you to change the API endpoint without rebuilding the application. If the environment variable is not set, it will fall back to the default URL configured in `next.config.ts`.

## Deployment

1. Build and start the Docker containers:
   ```bash
   docker-compose up -d --build
   ```

   This will:
   - Build the Docker image with all necessary dependencies
   - Start the application container
   - Map the configured port (default: 3000) to the host

2. Verify the application is running:
   ```bash
   docker-compose ps
   ```

   You should see your application running and healthy.

## PDF Rendering Support

The application uses PDF.js and React PDF for rendering PDF documents. The Docker configuration includes all necessary dependencies for the `canvas` module required by these libraries:

- Build dependencies: build-base, g++, cairo-dev, jpeg-dev, pango-dev, giflib-dev
- Runtime dependencies: cairo, jpeg, pango, giflib

These dependencies are automatically installed during the Docker build process.

## Updating the Application

To update the application:

1. Pull the latest changes:
   ```bash
   git pull
   ```

2. Rebuild and restart the containers:
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

## Logs and Troubleshooting

To view logs:
```bash
docker-compose logs -f app
```

To check container status:
```bash
docker-compose ps
```

If you encounter build errors related to memory, the configuration includes `NODE_OPTIONS=--max_old_space_size=4096` to increase the memory limit for Node.js during the build process.

## Database Considerations

The application uses Prisma to connect to a PostgreSQL database. Make sure your database is accessible from the Docker container and that the connection string in the `.env` file is correct.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | production |
| PORT | Port the application runs on | 3000 |
| NODE_OPTIONS | Node.js options | --max_old_space_size=4096 |
| NEXT_PUBLIC_API_URL | URL of the API | http://mcconsultancy.la:9092 |
| DATABASE_URL | PostgreSQL connection string | - | 