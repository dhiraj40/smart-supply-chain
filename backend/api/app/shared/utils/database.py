import os
from time import time
from datetime import datetime
import psycopg2
import json
from psycopg2.extensions import connection

KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:29092")
POSTGRES_URL = os.getenv("POSTGRES_URL", "postgresql://supplychain_user:supplychain_pass@postgres:5432/supply_chain")

def init_db_connection() -> connection:
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

def getOrders():
    orders = []
    db_conn = init_db_connection()
    query = """SELECT * FROM orders"""
    with db_conn.cursor() as cursor:
        cursor.execute(query=query)
        orders = cursor.fetchall()
    db_conn.close()
    return orders

def getShipments():
    orders = []
    db_conn = init_db_connection()
    query = """SELECT * FROM shipments"""
    with db_conn.cursor() as cursor:
        cursor.execute(query=query)
        orders = cursor.fetchall()
    db_conn.close()
    return orders