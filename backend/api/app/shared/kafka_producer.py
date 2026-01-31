import json
import os
import time
from kafka import KafkaProducer

KAFKA_BOOTSTRAP_SERVERS = os.getenv(
    "KAFKA_BOOTSTRAP_SERVERS", "kafka:29092"
)
ORDER_EVENT = "orders.events"
SHIPMENT_EVENT = "shipments.events"

def get_kafka_producer():
    retries = 0
    while retries < 15:
        try:
            print(f"Attempting to connect to Kafka (Attempt {retries+1})...")
            # We use the service name 'kafka' and internal port 29092
            producer = KafkaProducer(
                bootstrap_servers='kafka:29092',
                value_serializer=lambda v: json.dumps(v, default=str).encode("utf-8")
            )
            print("Successfully connected to Kafka!")
            return producer
        except Exception as e:
            retries += 1
            print(f"Kafka not ready yet. Retrying in 3 seconds... Error: {e}")
            time.sleep(3)
            
    raise Exception("Could not connect to Kafka after multiple retries.")

# def get_producer() -> KafkaProducer:
#     return KafkaProducer(
#     bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
#     api_version=(3, 5, 0),   # 🔴 THIS IS THE KEY
#     value_serializer=lambda v: json.dumps(v).encode("utf-8"),
#     retries=5,
#     linger_ms=10
# )

def send_order_event(
        event_type: str, 
        order_id: str,
        payload: dict
):
    producer = get_kafka_producer()
    event = {
        "event_id": order_id + "-evt",
        "event_type": event_type,
        "payload": payload
    }
    # value_encoded = json.dumps(event).encode("utf-8")
    producer.send(ORDER_EVENT, value=event)
    producer.flush()

def send_shipment_event(event_type: str, shipment_id: str, payload: dict):
    producer = get_kafka_producer()
    event = {
        "event_id": shipment_id + "-evt",
        "event_type": event_type,
        "payload": payload
    }
    # value_encoded = json.dumps(event).encode("utf-8")
    producer.send(SHIPMENT_EVENT, value=event)
    producer.flush()

