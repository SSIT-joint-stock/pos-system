#!/usr/bin/bash

docker compose -f docker-compose.dev.yml exec mongodb mongosh \
-u "${MONGODB_ROOT_USERNAME:-admin}" \
-p "${MONGODB_ROOT_PASSWORD:-password}" \
--authenticationDatabase admin \
--eval 'rs.status().set'