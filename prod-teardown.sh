#!/bin/bash

# Stop and remove containers and remove volumes
docker compose -f docker-compose.prod.yml down -v