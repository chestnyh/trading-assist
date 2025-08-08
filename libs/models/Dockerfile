# Multi-stage build for models library
FROM node:18-alpine AS base
WORKDIR /app

# Copy nx configuration files
COPY package.json pnpm-lock.yaml* ./
COPY nx.json ./nx.json
COPY jest.preset.cjs ./jest.preset.cjs
COPY .eslintrc.json ./.eslintrc.json
COPY libs/models ./libs/models
COPY libs/configs ./libs/configs

# Copy tsconfig files for path resolution
COPY tsconfig.base.json ./tsconfig.base.json
COPY libs/models/tsconfig.lib.json ./libs/models/tsconfig.lib.json

# Copy seeds directory
COPY seeds ./seeds

# Install pnpm for local use only
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm models:migrations:generate

# Set default environment variables
ENV DB_HOST=postgres
ENV DB_PORT=5432
ENV DB_USER=${DB_USER}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_NAME=${DB_NAME}

# Default command
CMD ["sh", "-c", "pnpm models:migrations:run && pnpm models:migrations:seed"]
