FROM node:24-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
COPY apps/plateServer/package.json apps/plateServer/package.json
COPY packages/plate-billing/package.json packages/plate-billing/package.json
COPY apps/plateServer/tsconfig.json apps/plateServer/tsconfig.json
COPY tsconfig.base.json tsconfig.base.json
RUN npm ci

FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build:server

FROM node:24-alpine AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 4000
CMD ["npm", "run", "dev:server"]

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/apps/plateServer/dist /app/dist
COPY --from=builder /app/packages/plate-billing /app/packages/plate-billing
EXPOSE 4000
CMD ["node", "dist/index.js"]
