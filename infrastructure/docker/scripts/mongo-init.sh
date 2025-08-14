#!/usr/bin/env bash
set -Eeuo pipefail

echo "[init] waiting mongo to be ready..."
for i in {1..10}; do
  if mongosh --host mongodb:27017 \
    -u "${MONGODB_ROOT_USERNAME:-admin}" \
    -p "${MONGODB_ROOT_PASSWORD:-password}" \
    --authenticationDatabase admin \
    --quiet --eval "db.adminCommand('ping').ok" | grep -q 1; then
    echo "[init] mongo is answering ping"
    break
  fi
  sleep 2
done

RS="${MONGODB_REPLICA_SET:-rs0}"
echo "[init] initiating replicaSet=${RS} if needed..."

mongosh --host mongodb:27017 \
  -u "${MONGODB_ROOT_USERNAME:-admin}" \
  -p "${MONGODB_ROOT_PASSWORD:-password}" \
  --authenticationDatabase admin \
  --eval "
    try {
      rs.status()
    } catch (e) {
      if (e.codeName === 'NotYetInitialized') {
        rs.initiate({_id: '${RS}', members: [{ _id: 0, host: 'mongodb:27017' }]})
      }
    }
  "

echo "[init] done."
