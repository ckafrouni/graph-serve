# Dockerfile for apps/management-server

# 1. ---- Base Node ----
FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# 2. ---- Dependencies ----
FROM base AS dependencies
WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY turbo.json ./

COPY apps/management-server/package.json ./apps/management-server/package.json

RUN pnpm install --prod --filter @workspace/management-server...

# 3. ---- Build ----
FROM base AS build
WORKDIR /app

COPY . ./

RUN pnpm install --frozen-lockfile

RUN pnpm turbo build --filter=@workspace/management-server...

# 4. ---- Runner ----
FROM base AS runner
WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/management-server/node_modules ./apps/management-server/node_modules

COPY --from=build /app/apps/management-server/dist ./apps/management-server/dist
COPY --from=build /app/apps/management-server/package.json ./apps/management-server/package.json

COPY --from=build /app/packages ./packages

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./



ENV NODE_ENV=production
EXPOSE 8080

CMD ["pnpm", "--filter=@workspace/management-server", "start"] 