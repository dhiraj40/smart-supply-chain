import os
from time import time
from datetime import datetime
import psycopg2
import json

KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:29092")
POSTGRES_URL = os.getenv("POSTGRES_URL", "postgresql://supplychain_user:supplychain_pass@postgres:5432/supply_chain")


def init_db_connection():
    retries = 0
    while retries < 15:
        try:
            print(f"Attempting to connect to Postgres (Attempt {retries+1})...")
            conn = psycopg2.connect(POSTGRES_URL)
            print("Successfully connected to Postgres!")
            return conn
        except Exception as e:
            retries += 1
            print(f"Postgres not ready yet. Retrying in 3 seconds... Error: {e}")
            time.sleep(3)
            
    raise Exception("Could not connect to Postgres after multiple retries.")

# def save_order_event(conn, event):
#     with conn.cursor() as cursor:
#         insert_query = """
#         INSERT INTO order_events (event_id, order_id, event_type, event_timestamp, payload)
#         VALUES (%s, %s, %s, %s, %s)
#         """
#         cursor.execute(insert_query, (
#             event['event_id'],
#             event['order_id'],
#             event['event_type'],
#             event['event_timestamp'],
#             json.dumps(event['payload'])
#         ))
#         conn.commit()

def save_shipment_event(conn, event):
    with conn.cursor() as cursor:
        insert_query = """
        INSERT INTO shipment_events (event_id, shipment_id, event_type, event_timestamp, payload)
        VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (
            event['event_id'],
            event['shipment_id'],
            event['event_type'],
            event['event_timestamp'],
            json.dumps(event['payload'])
        ))
        conn.commit()

# def save_order(conn, order):
#     with conn.cursor() as cursor:
#         insert_query = """
#         INSERT INTO orders (order_id, customer_id, warehouse_id, status, order_amount, currency, created_at, updated_at)
#         VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
#         ON CONFLICT (order_id) DO UPDATE SET
#             status = EXCLUDED.status,
#             order_amount = EXCLUDED.order_amount,
#             currency = EXCLUDED.currency,
#             updated_at = EXCLUDED.updated_at
#         """
#         cursor.execute(insert_query, (
#             order['order_id'],
#             order['customer_id'],
#             order['warehouse_id'],
#             order['status'],
#             order['order_amount'],
#             order['currency'],
#             order['created_at'],
#             order['updated_at']
#         ))
        conn.commit()

def save_shipment(conn, shipment):
    with conn.cursor() as cursor:
        insert_query = """
        INSERT INTO shipments (shipment_id, order_id, status, current_location, expected_delivery, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (shipment_id) DO UPDATE SET
            status = EXCLUDED.status,
            current_location = EXCLUDED.current_location,
            expected_delivery = EXCLUDED.expected_delivery,
            updated_at = EXCLUDED.updated_at
        """
        cursor.execute(insert_query, (
            shipment['shipment_id'],
            shipment['order_id'],
            shipment['status'],
            shipment['current_location'],
            shipment['expected_delivery'],
            shipment['created_at'],
            shipment['updated_at']
        ))
        conn.commit()

def save_errors(conn, error_message):
    with conn.cursor() as cursor:
        insert_query = """INSERT INTO exceptions (error_msg, time_stamp) VALUES (%s, %s)"""
        cursor.execute(insert_query, (str(error_message), str(datetime.now())))
        conn.commit()