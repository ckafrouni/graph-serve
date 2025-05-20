# Dockerfile for apps/management-server

# 1. ---- Base Node ----
FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# 2. ---- Dependencies ----
FROM base AS dependencies
WORKDIR /app

# Copy global config files
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY turbo.json ./
# COPY .npmrc ./.npmrc # Removed as .npmrc might not exist at the root
COPY .env ./.env
COPY .env.example ./.env.example

# Copy app-specific package.json
COPY apps/management-server/package.json ./apps/management-server/package.json

# Install only production dependencies for the specific app using pnpm prune
RUN pnpm install --prod --filter @workspace/management-server...

# 3. ---- Build ----
FROM base AS build
WORKDIR /app

# Copy all necessary files from the root, including other packages/apps if needed for build
COPY . ./

# Install all dependencies (including devDependencies like turbo) for the build process
RUN pnpm install --frozen-lockfile

# We already installed dependencies in the 'dependencies' stage.
# Here, we'll leverage Turborepo's remote caching or build if no cache hit.
# Ensure your turbo.json is configured for 'management-server#build'
RUN pnpm turbo build --filter=@workspace/management-server...

# 4. ---- Runner ----
FROM base AS runner
WORKDIR /app

# Copy production dependencies from the 'dependencies' stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/management-server/node_modules ./apps/management-server/node_modules

# Copy the built app from the 'build' stage
COPY --from=build /app/apps/management-server/dist ./apps/management-server/dist
COPY --from=build /app/apps/management-server/package.json ./apps/management-server/package.json

# Copy built workspace packages from the 'build' stage to ensure they are available
COPY --from=build /app/packages ./packages

# Copy other necessary root files that might be needed at runtime by the built app
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
# COPY .npmrc ./.npmrc # Removed as .npmrc might not exist at the root
COPY .env ./.env
COPY .env.example ./.env.example


ENV NODE_ENV=production

EXPOSE 8080

CMD ["pnpm", "--filter=@workspace/management-server", "start"] 