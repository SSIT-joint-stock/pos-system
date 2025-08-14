#!/usr/bin/env bash
set -Eeuo pipefail

if [ ! -s /run/secrets/mongo-keyfile ]; then
  echo "Keyfile missing or empty at /run/secrets/mongo-keyfile" >&2
  exit 2
fi

mkdir -p /data/configdb
cp /run/secrets/mongo-keyfile /data/configdb/keyfile
chown mongodb:mongodb /data/configdb/keyfile
chmod 600 /data/configdb/keyfile

exec /usr/local/bin/docker-entrypoint.sh mongod \
  --auth \
  --replSet "${MONGODB_REPLICA_SET:-rs0}" \
  --bind_ip_all \
  --keyFile /data/configdb/keyfile
