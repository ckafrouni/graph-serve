# Dockerfile for apps/studio-server

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

COPY apps/studio-server/package.json ./apps/studio-server/package.json

RUN pnpm install --prod --filter @workspace/studio-server...

# 3. ---- Build ----
FROM base AS build
WORKDIR /app

COPY . ./

RUN pnpm install --frozen-lockfile

RUN pnpm turbo build --filter=@workspace/studio-server...

# 4. ---- Runner ----
FROM base AS runner
WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/studio-server/node_modules ./apps/studio-server/node_modules

COPY --from=build /app/apps/studio-server/dist ./apps/studio-server/dist
COPY --from=build /app/apps/studio-server/package.json ./apps/studio-server/package.json

COPY --from=build /app/packages ./packages

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./



ENV NODE_ENV=production
EXPOSE 8080

CMD ["pnpm", "--filter=@workspace/studio-server", "start"] 