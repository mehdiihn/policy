# Stage 1: Base image (use Node 18 Alpine for smaller size)
FROM node:18-alpine AS base
WORKDIR /app

# Stage 2: Install dependencies (including devDependencies for build)
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# Stage 3: Build the application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 4: Production runtime
FROM base AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs nextjs && \
    mkdir -p /app/.next && \
    chown nextjs:nodejs /app/.next

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
