# Use the exact same Node version as your local dev environment
FROM node:18-alpine AS base
WORKDIR /app

# ---- Dependencies Stage ----
FROM base AS deps
RUN apk add --no-cache libc6-compat git
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# ---- Builder Stage ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

# Coolify-specific build args
ARG COOLIFY_BUILD_ID
ARG COOLIFY_DEPLOYMENT_URL
ENV NEXT_PUBLIC_APP_URL=${COOLIFY_DEPLOYMENT_URL}

RUN npm run build

# ---- Production Stage ----
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0

# Create non-root user (required by Coolify)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
