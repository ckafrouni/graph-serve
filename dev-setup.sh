#!/bin/bash
set -e

# Start Docker containers
docker compose -f docker-compose.dev.yml up -d --wait

# Create S3 bucket
BUCKET_NAME=uploaded-documents
aws s3 mb s3://${BUCKET_NAME} --endpoint-url=http://localhost:4566 || true

pnpm install
pnpm db:push