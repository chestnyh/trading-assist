# First Time Setup for Development

This document is created to help developers (and others) run the local project setup.
It consists of a list of commands with short descriptions that should be executed.

## Step-by-Step Setup

### 1. Clone the Repository
```bash
git clone git@github.com:chestnyh/trading-assist.git
cd trading-assist
```
### 2. Verify Development Tools
Run the automated tool checker to ensure all required tools are installed:
```bash
./tools/development/scripts/dev-tools-checking.sh
```
If any tools are missing, install them before proceeding.

### 3. Install Dependencies
Install project dependencies:
```bash
pnpm install --frozen-lockfile
```

### 4. Environment Configuration
Copy the environment template file to create your local environment variables file:
```bash
cp .env.dev.example .env.dev
```
Customize it if the default values don’t work for any reason.

### 5. Prepare Docker Volumes
Create necessary directories for Docker volumes:
```bash
pnpm development:create-volume-folder
```

### 6. Start External Services
Launch all required external services (with the `-d` flag for daemon mode):
```bash
pnpm development:external-up -d
```

### 7. Run Migrations and Seeds
Create the database structure and fill it with demo data:
```bash
pnpm models:migrations:migrate-and-seed
```

### 8. Start All Services
Launch all services to verify everything works properly:
```bash
pnpm all:start
```

### 9. Log in to the Platform
In the browser go to http://localhost:4200 (or a different port if you changed its value in the `.env.dev` file).
Sign in with email `admin@tb.com` and password `Password123!`.
