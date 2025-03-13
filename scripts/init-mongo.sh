#!/bin/bash

echo "⏳ Waiting for MongoDB to be ready..."
until mongosh --host mongo --eval "db.runCommand({ ping: 1 })" > /dev/null 2>&1; do
  sleep 2
done

echo "✅ MongoDB is ready. Checking replica set status..."
IS_REPLICA_INITIALIZED=$(mongosh --host mongo --eval "rs.status().ok" --quiet)

if [ "$IS_REPLICA_INITIALIZED" == "1" ]; then
  echo "⚡ Replica set is already initialized."
else
  echo "🔄 Initializing replica set..."
  mongosh --host mongo --eval "rs.initiate()"
fi

echo "🚀 MongoDB Replica Set is configured!"
