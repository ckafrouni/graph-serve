# Dockerfile for apps/studio-frontend

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
COPY apps/studio-frontend/package.json ./apps/studio-frontend/package.json

# Install only production dependencies for the specific app
RUN pnpm install --prod --filter @workspace/studio-frontend...

# 3. ---- Build ----
FROM base AS build
WORKDIR /app

# Copy all necessary files from the root
COPY . ./

# Install all dependencies (including devDependencies like turbo) for the build process
RUN pnpm install --frozen-lockfile

# Build the specific app
# Ensure your turbo.json is configured for 'studio-frontend#build'
RUN pnpm turbo build --filter=@workspace/studio-frontend...

# 4. ---- Runner ----
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install serve to host static files
RUN pnpm add -g serve

# Copy production dependencies from the 'dependencies' stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/studio-frontend/node_modules ./apps/studio-frontend/node_modules

# Copy the built app from the 'build' stage
# The output of 'turbo build --filter=studio-frontend...' will be in its respective app's dist/build folder
# For Next.js or similar frameworks, this usually includes a .next folder and public assets.
COPY --from=build /app/apps/studio-frontend/dist ./apps/studio-frontend/dist
# COPY --from=build /app/apps/studio-frontend/public ./apps/studio-frontend/public # Commented out: Assumes build output in 'dist' includes public assets or they are not in a separate 'public' folder post-build.
COPY --from=build /app/apps/studio-frontend/package.json ./apps/studio-frontend/package.json
COPY --from=build /app/apps/studio-frontend/.env ./apps/studio-frontend/.env
COPY --from=build /app/apps/studio-frontend/.env.example ./apps/studio-frontend/.env.example

# Copy other necessary root files that might be needed at runtime by the built app
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

EXPOSE 3000

CMD ["serve", "-s", "apps/studio-frontend/dist", "-l", "3000"] 