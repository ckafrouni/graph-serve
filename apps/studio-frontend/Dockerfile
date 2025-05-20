# Dockerfile for apps/studio-frontend

ARG VITE_SERVER_URL
ARG VITE_GRAPH_SERVER_URL

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

COPY apps/studio-frontend/package.json ./apps/studio-frontend/package.json

RUN pnpm install --prod --filter @workspace/studio-frontend...

# 3. ---- Build ----
FROM base AS build
WORKDIR /app

ARG VITE_SERVER_URL
ARG VITE_GRAPH_SERVER_URL
ENV VITE_SERVER_URL=${VITE_SERVER_URL}
ENV VITE_GRAPH_SERVER_URL=${VITE_GRAPH_SERVER_URL}

COPY . ./

RUN pnpm install --frozen-lockfile

RUN pnpm turbo build --filter=@workspace/studio-frontend...

# 4. ---- Runner ----
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/studio-frontend/node_modules ./apps/studio-frontend/node_modules

COPY --from=build /app/apps/studio-frontend/dist ./apps/studio-frontend/dist
COPY --from=build /app/apps/studio-frontend/package.json ./apps/studio-frontend/package.json

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

EXPOSE 3000

CMD ["pnpm", "--filter=@workspace/studio-frontend", "run", "start:prod"] 