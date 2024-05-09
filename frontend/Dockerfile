FROM node:20.10.0-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat

# RUN mkdir -p /app
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock tailwind.config.ts postcss.config.mjs next.config.mjs tsconfig.json ./
RUN yarn install --frozen-lockfile
RUN rm -rf ./.next/cache

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs ../app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs ../app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
