import os
import json
from kafka import KafkaConsumer
import database as db
from database.entities import Shipment, ShipmentEvent

KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:29092")
POSTGRES_URL = os.getenv("POSTGRES_URL", "postgresql://supplychain_user:supplychain_pass@postgres:5432/supply_chain")
SHIPMENT_EVENT = "shipments.events"
SHIPMENT_CONSUMER_GROUP_ID = 'shipment-consumer-group'


consumer = KafkaConsumer(
    SHIPMENT_EVENT,
    bootstrap_servers = KAFKA_BOOTSTRAP_SERVERS,
    group_id=SHIPMENT_CONSUMER_GROUP_ID,
    value_deserializer=lambda v: json.loads(v),
    key_deserializer=lambda k: k.decode('utf-8')
)

db_conn = db.init_db_connection()

for msg in consumer:
    shipment_event = ShipmentEvent(**msg.value)
    print(f"Processing shipment event: {shipment_event.event_type} for {shipment_event.shipment_id}")
    db.save_shipment_event(db_conn, shipment_event)
    db.save_shipment(db_conn, shipment_event.payload)

db_conn.close()