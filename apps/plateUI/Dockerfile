FROM node:24-alpine AS base
WORKDIR /app

FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
COPY apps/plateUI/package.json apps/plateUI/package.json
COPY apps/plateServer/package.json apps/plateServer/package.json
COPY apps/plateUI/tsconfig.json apps/plateUI/tsconfig.json
COPY tsconfig.base.json tsconfig.base.json
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build --workspace @plate/plate-ui

FROM base AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
EXPOSE 3000
CMD ["npm", "run", "dev", "--workspace", "@plate/plate-ui"]

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/plateUI/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/plateUI/public ./apps/plateUI/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/plateUI/.next/static ./apps/plateUI/.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "apps/plateUI/server.js"]
