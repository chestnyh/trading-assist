# Multi-stage build for auto-trader application
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm install -g pnpm
RUN pnpm models:migrations:generate
RUN NX_DAEMON=false npx nx build auto-trader

# Generate Prisma client first

# RUN npx prisma generate --schema=./libs/models/prisma/schema.prisma

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 auto-trader

# Copy the built application
COPY --from=builder /app/dist/apps/auto-trader ./dist/apps/auto-trader
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.base.json ./tsconfig.base.json

# Copy Prisma schema and generate client
COPY libs/models/ ./libs/models/
COPY libs/configs/ ./libs/configs/

RUN ls -la ./
RUN ls -la ./libs/models/
RUN ls -la ./libs/configs/

USER auto-trader

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

CMD ["node", "dist/apps/auto-trader/main.js"]
