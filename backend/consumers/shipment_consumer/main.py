import os
import json
import time
from kafka import KafkaConsumer
import database as db
from database.entities import Shipment, ShipmentEvent

KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:29092")
POSTGRES_URL = os.getenv("POSTGRES_URL", "postgresql://supplychain_user:supplychain_pass@postgres:5432/supply_chain")
SHIPMENT_EVENT = "shipments.events"
SHIPMENT_CONSUMER_GROUP_ID = 'shipment-consumer-group-v1'


def get_kafka_consumer():
    retries = 0
    while retries < 15:
        try:
            print(f"Attempting to connect to Kafka (Attempt {retries+1})...")
            # We use the service name 'kafka' and internal port 29092
            consumer = KafkaConsumer(
                SHIPMENT_EVENT,
                bootstrap_servers='kafka:29092',
                group_id=SHIPMENT_CONSUMER_GROUP_ID,
                value_deserializer = lambda v: json.loads(v),
                key_deserializer = lambda k: k.decode("utf-8") if k else None,
                auto_offset_reset = "earliest"
            )
            print("Successfully connected to Kafka!")
            return consumer
        except Exception as e:
            retries += 1
            print(f"Kafka not ready yet. Retrying in 3 seconds... Error: {e}")
            time.sleep(3)
            
    raise Exception("Could not connect to Kafka after multiple retries.")

consumer = get_kafka_consumer()
db_conn = db.init_db_connection()


for msg in consumer:
    try:
        shipment_event = msg.value #ShipmentEvent(**msg.value)
        print(f"Processing shipment event: {shipment_event['event_type']} for {shipment_event}")
        db.save_shipment_event(db_conn, shipment_event)
        db.save_shipment(db_conn, shipment_event['payload'])
    except Exception as error:
        db.save_errors(db_conn, error)

db_conn.close()