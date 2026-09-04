# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# Keep the credential server-only. Render injects TMDB_API_TOKEN at runtime;
# manual Docker builds that intentionally make build-time TMDB requests can
# provide it with: --build-arg TMDB_API_TOKEN=... . It is not copied into the
# final image.
ARG TMDB_API_TOKEN
ENV TMDB_API_TOKEN=$TMDB_API_TOKEN
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Render routes traffic to the port supplied in PORT (10000 by default).  The
# standalone Next.js server also needs to listen on all interfaces inside the
# container rather than only on localhost.
ENV PORT=10000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 10000
CMD ["node", "server.js"]
