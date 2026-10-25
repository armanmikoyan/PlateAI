FROM node:24-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache libc6-compat

FROM base AS deps
COPY package.json package-lock.json ./
COPY apps/plateUI/package.json ./apps/plateUI/package.json
COPY apps/plateServer/package.json ./apps/plateServer/package.json
COPY packages/plate-ai/package.json ./packages/plate-ai/package.json
COPY packages/plate-billing/package.json ./packages/plate-billing/package.json
RUN --mount=type=cache,target=/root/.npm,sharing=locked HUSKY=0 npm ci --no-audit --no-fund

FROM base AS builder
COPY --from=deps /app ./
COPY . .
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_GA_ID
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID
RUN --mount=type=cache,target=/app/apps/plateUI/.next/cache,sharing=locked npm run build

FROM base AS dev
COPY --from=deps /app ./
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/plateUI/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/plateUI/public ./apps/plateUI/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/plateUI/.next/static ./apps/plateUI/.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "apps/plateUI/server.js"]
