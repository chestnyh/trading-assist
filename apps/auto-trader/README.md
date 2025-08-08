# Auto-Trader Docker Setup

This directory contains the Docker configuration for the auto-trader application.

## Prerequisites

- Docker and Docker Compose installed
- Environment variables configured (see Environment Setup below)

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_HOST=postgres
DB_PORT=5432

# Application Configuration
NODE_ENV=production
PORT=3000
```

## Building and Running

### Option 1: Using Docker Compose (Recommended)

1. **Build and run the entire stack:**
   ```bash
   cd apps/auto-trader
   docker-compose up --build
   ```

2. **Run in detached mode:**
   ```bash
   docker-compose up -d --build
   ```

3. **Stop the services:**
   ```bash
   docker-compose down
   ```

4. **View logs:**
   ```bash
   docker-compose logs -f auto-trader
   ```

### Option 2: Using Docker directly

1. **Build the image:**
   ```bash
   # From the root directory
   docker build -f apps/auto-trader/Dockerfile -t auto-trader .
   ```

2. **Run the container:**
   ```bash
   docker run -d \
     --name auto-trader \
     -p 3000:3000 \
     --env-file .env \
     --network trading_network \
     auto-trader
   ```

3. **Stop the container:**
   ```bash
   docker stop auto-trader
   docker rm auto-trader
   ```

## Development

### Local Development with Docker

1. **Build for development:**
   ```bash
   docker build -f apps/auto-trader/Dockerfile -t auto-trader:dev --target builder .
   ```

2. **Run with volume mounting for hot reload:**
   ```bash
   docker run -it \
     --name auto-trader-dev \
     -p 3000:3000 \
     -v $(pwd):/app \
     -v /app/node_modules \
     --env-file .env \
     auto-trader:dev
   ```

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Check what's using port 3000
   lsof -i :3000
   
   # Kill the process or change the port in docker-compose.yml
   ```

2. **Database connection issues:**
   - Ensure the database is running: `docker-compose ps`
   - Check database logs: `docker-compose logs postgres`
   - Verify environment variables are set correctly

3. **Build failures:**
   - Clear Docker cache: `docker system prune -a`
   - Ensure all dependencies are installed: `pnpm install`

### Logs and Debugging

1. **View application logs:**
   ```bash
   docker-compose logs -f auto-trader
   ```

2. **Access container shell:**
   ```bash
   docker exec -it auto-trader sh
   ```

3. **Check container status:**
   ```bash
   docker-compose ps
   ```

## Production Deployment

For production deployment, consider:

1. **Using a production database** (not the one in docker-compose)
2. **Setting up proper logging** with external log aggregation
3. **Configuring health checks**
4. **Setting up monitoring and alerting**
5. **Using secrets management** for sensitive environment variables

## Health Check

The application exposes a health check endpoint at `/health` (if implemented in the NestJS app).

You can check the health status with:
```bash
curl http://localhost:3000/health
```

## Performance Optimization

- The Dockerfile uses multi-stage builds to minimize image size
- Alpine Linux is used for smaller base images
- Dependencies are cached in separate layers
- Production builds exclude development dependencies