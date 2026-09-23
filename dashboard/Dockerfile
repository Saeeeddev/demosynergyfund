# Multi-stage build for production dashboard
FROM node:22-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:22-slim AS builder
WORKDIR /app

# Copy package files and install ALL dependencies (including devDependencies)
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# NEXT_PUBLIC_* vars are baked in at build time, not read at runtime
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NODE_ENV=production

# Build the Next.js application
RUN npm run build

# Verify build artifacts
RUN echo "=== Verifying build artifacts ===" && \
    ls -la /app/.next/ && \
    ls -la /app/public/ && \
    ls -la /app/public/Images/ && \
    echo "=== Build verification complete ==="

# Production image
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
COPY --from=deps /app/node_modules ./node_modules

# Verify public directory in final image
RUN echo "=== Final image verification ===" && \
    ls -la /app/public/ && \
    ls -la /app/public/Images/ && \
    echo "=== Final verification complete ==="

EXPOSE 3000

CMD ["npm", "start"]
