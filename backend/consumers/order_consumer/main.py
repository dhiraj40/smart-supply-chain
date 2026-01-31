import os
import json
import time
from kafka import KafkaConsumer
import database as db
from database.entities import Order, OrderEvent

KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:29092")
ORDER_EVENT = "orders.events"
ORDER_CONSUMER_GROUP_ID = "order-consumer-group-v1"

def get_kafka_consumer():
    retries = 0
    while retries < 15:
        try:
            print(f"Attempting to connect to Kafka (Attempt {retries+1})...")
            # We use the service name 'kafka' and internal port 29092
            consumer = KafkaConsumer(
                ORDER_EVENT,
                bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
                group_id=ORDER_CONSUMER_GROUP_ID,
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
        order_event = OrderEvent(**msg.value)
        print(f"Processing event: {order_event.event_type} for {order_event}")
        db.save_order_event(db_conn, order_event)
        db.save_order(db_conn, order_event.payload)
    except Exception as error:
        print(error)

db_conn.close()