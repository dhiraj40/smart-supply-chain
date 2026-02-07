import json
import os
import time
from kafka import KafkaProducer
from ulid import ULID
from datetime import datetime

KAFKA_BOOTSTRAP_SERVERS = os.getenv(
    "KAFKA_BOOTSTRAP_SERVERS", "kafka:29092"
)

# TOPICS = {
#     "ORDER_EVENT": "orders.events",
#     "SHIPMENT_EVENT": "shipments.events"
# }

# class Topics:
ORDER_EVENT = "orders.events"
SHIPMENT_EVENT = "shipments.events"

def get_kafka_producer():
    retries = 0
    while retries < 15:
        try:
            print(f"Attempting to connect to Kafka (Attempt {retries+1})...")
            # We use the service name 'kafka' and internal port 29092
            producer = KafkaProducer(
                bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
                value_serializer=lambda v: json.dumps(v, default=str).encode("utf-8")
            )
            print("Successfully connected to Kafka!")
            return producer
        except Exception as e:
            retries += 1
            print(f"Kafka not ready yet. Retrying in 3 seconds... Error: {e}")
            time.sleep(3)
            
    raise Exception("Could not connect to Kafka after multiple retries.")

def send_event(
    event_topic: str,
    event: dict
):
    producer = get_kafka_producer()
    producer.send(event_topic, value=event)
    producer.flush()

def send_order_event(
    ulid: str,
    event_type: str,
    payload: dict
):
    order_id = 'ORD-' + ulid
    event_id = 'EVT-' + ulid
    payload['order_id'] = order_id
    event = {
        "event_id": event_id,
        "order_id": order_id,
        "event_type": event_type,
        "event_timestamp": datetime.now(),
        "payload": payload
    }

    send_event(ORDER_EVENT, event)
    return payload

def send_shipment_event(
    ulid: str,
    event_type: str,
    payload: dict
):
    shipment_id = 'SHIP-' + ulid
    event_id = 'EVT-' + ulid
    payload['shipment_id'] = shipment_id
    event = {
        "event_id": event_id,
        "shipment_id": shipment_id,
        "event_type": event_type,
        "event_timestamp": datetime.now(),
        "payload": payload
    }

    send_event(SHIPMENT_EVENT, event)
    return payload