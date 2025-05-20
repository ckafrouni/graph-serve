#!/bin/bash
set -e

# Start Docker containers
docker compose -f docker-compose.prod.yml up -d --wait

pnpm install
pnpm db:migrate