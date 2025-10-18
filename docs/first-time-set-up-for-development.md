# First Time Setup for Development

This document is created to help developers (and others) run the local project setup. 
It consists of a list of commands with short descriptions that should be executed. 

## Step-by-Step Setup

### 1. Clone the Repository
```bash
git clone git@github.com:chestnyh/trading-bot.git
cd trading-bot
```

### 2. Verify Development Tools
Run our automated tool checker to ensure all required tools are installed:
```bash
./scripts/dev-tools-checking.sh
```
If any tools are missing, install them before proceeding.

### 3. Environment Configuration
Copy the environment template file to create your local environment variables file:
```bash
cp .env.dev.example .env.dev
```
Customize it if the default values don’t work for any reason.


### 4. Install Dependencies
Install all project dependencies:
```bash
pnpm install
```

### 5. Prepare Docker Volumes
Create necessary directories for Docker volumes:
```bash
source .env.dev && mkdir -p ${DOCKER_DB_VOLUME}
```

### 6. Start External Services
Launch all required external services(with the `-d` flag for daemon mode):
```bash
pnpm docker:init-external:up -d
```

### 7. Start All Services
Launch all services to verify everything works properly:
```bash
pnpm all:start
```