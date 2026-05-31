# Multi-stage build for models library
FROM node:18-alpine AS base
WORKDIR /app

# Copy workspace structure and nx configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY nx.json ./nx.json
COPY jest.preset.cjs ./jest.preset.cjs
COPY .eslintrc.json ./.eslintrc.json
COPY libs/models ./libs/models
COPY libs/configs ./libs/configs
COPY libs/crypto-utils ./libs/crypto-utils

# Copy tsconfig files for path resolution
COPY tsconfig.base.json ./tsconfig.base.json
COPY libs/models/tsconfig.lib.json ./libs/models/tsconfig.lib.json

# Install pnpm for local use only
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm models:migrations:generate

# Default command
CMD ["sh", "-c", "pnpm models:migrations:run && pnpm models:migrations:seed"]
