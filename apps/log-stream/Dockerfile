# Multi-stage build for log-stream application
FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm install -g pnpm
RUN NX_DAEMON=false npx nx build log-stream

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 log-stream

COPY --from=builder /app/dist/apps/log-stream ./dist/apps/log-stream
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.base.json ./tsconfig.base.json

COPY libs/models/ ./libs/models/
COPY libs/configs/ ./libs/configs/

USER log-stream

EXPOSE 3002

ENV PORT=3002
ENV NODE_ENV=production

CMD ["node", "dist/apps/log-stream/main.js"]
