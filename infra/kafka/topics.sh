#!/bin/bash

# File: infra/kafka/topics.sh
# Purpose: Create Kafka topics for Smart Supply Chain Event Tracker

KAFKA_CONTAINER=kafka
BOOTSTRAP_SERVER=localhost:9092

echo "Creating Kafka topics..."

docker exec $KAFKA_CONTAINER kafka-topics \
  --bootstrap-server $BOOTSTRAP_SERVER \
  --create \
  --if-not-exists \
  --topic order.events \
  --partitions 3 \
  --replication-factor 1

docker exec $KAFKA_CONTAINER kafka-topics \
  --bootstrap-server $BOOTSTRAP_SERVER \
  --create \
  --if-not-exists \
  --topic shipment.events \
  --partitions 3 \
  --replication-factor 1

docker exec $KAFKA_CONTAINER kafka-topics \
  --bootstrap-server $BOOTSTRAP_SERVER \
  --create \
  --if-not-exists \
  --topic delay.events \
  --partitions 2 \
  --replication-factor 1

docker exec $KAFKA_CONTAINER kafka-topics \
  --bootstrap-server $BOOTSTRAP_SERVER \
  --create \
  --if-not-exists \
  --topic analytics.events \
  --partitions 1 \
  --replication-factor 1

echo "Kafka topics created successfully."
