import os
import time
import psycopg2
from psycopg2.extensions import connection
from psycopg2.extras import RealDictCursor

# from api.app.schemas.response import order # <--- CRITICAL IMPORT

KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:29092")
POSTGRES_URL = os.getenv("POSTGRES_URL", "postgresql://supplychain_user:supplychain_pass@localhost:5432/supply_chain_v2")

def init_db_connection() -> connection:
    retries = 0
    print(f"Attempting to connect to Postgres at {POSTGRES_URL}...")
    while retries < 5:
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

def createUser(
    user_id: str,
    first_name: str,
    last_name: str,
    email: str,
    date_of_birth: str,
    profile_picture_url: str,
    password_hash: str
):
    db_conn = init_db_connection()
    with db_conn.cursor() as cursor:
        # Insert into user_profiles table
        insert_user_query = """
            INSERT INTO user_profiles (
                user_id, 
                first_name, 
                last_name,
                email, 
                date_of_birth, 
                profile_picture_url
            )
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_user_query, (user_id, first_name, last_name, email, date_of_birth, profile_picture_url))
        
        # Insert into user_logins table
        insert_login_query = """
            INSERT INTO user_logins (user_id, email, password_hash, role, is_active)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(insert_login_query, (user_id, email, password_hash, 'customer', True))
        db_conn.commit()
    db_conn.close()

def getUserProfile(email: str):
    user_profile = None
    db_conn = init_db_connection()
    query = f"""SELECT user_id, first_name, last_name, email, date_of_birth, profile_picture_url FROM user_profiles WHERE email = '{email}'"""
    with db_conn.cursor(cursor_factory=RealDictCursor) as cursor:
        cursor.execute(query=query)
        user_profile = cursor.fetchone()
    db_conn.close()
    return user_profile

def getUserCredential(email: str):
    user_credential = None
    db_conn = init_db_connection()
    query = f"""SELECT * FROM user_logins WHERE email = '{email}' AND is_active = TRUE"""
    with db_conn.cursor(cursor_factory=RealDictCursor) as cursor:
        cursor.execute(query=query)
        user_credential = cursor.fetchone()
    db_conn.close()
    return user_credential

def getAllOrders():
    orders = []
    db_conn = init_db_connection()
    query = """SELECT * FROM orders ORDER BY created_at DESC"""
    with db_conn.cursor(cursor_factory=RealDictCursor) as cursor:
        cursor.execute(query=query)
        orders = cursor.fetchall()
    db_conn.close()
    return orders

def getOrderedItems(order_id: str):
    ordered_items = []
    db_conn = init_db_connection()
    query = f"""SELECT * FROM order_items WHERE order_id = '{order_id}'"""
    with db_conn.cursor(cursor_factory=RealDictCursor) as cursor:
        cursor.execute(query=query)
        ordered_items = cursor.fetchall()
    db_conn.close()
    return ordered_items

def getUserOrders(user_id: str):
    orders = []
    db_conn = init_db_connection()
    query = f"""SELECT * FROM orders WHERE user_id = '{user_id}' ORDER BY created_at DESC"""
    with db_conn.cursor(cursor_factory=RealDictCursor) as cursor:
        cursor.execute(query=query)
        orders = cursor.fetchall()
    db_conn.close()
    return orders

def getUserOrderedItems(user_id: str):
    ordered_items = []
    db_conn = init_db_connection()
    query = f"""
        SELECT 
            oi.*, 
            o.order_status, 
            o.delivery_address, 
            o.currency
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.order_id
        WHERE o.user_id = '{user_id}'
        ORDER BY o.created_at DESC
        """
    with db_conn.cursor(cursor_factory=RealDictCursor) as cursor:
        cursor.execute(query=query)
        ordered_items = cursor.fetchall()
    db_conn.close()
    return ordered_items

def getProducts(page: int = 1, page_size: int= 100):
    offset = (page - 1)*page_size
    products = []
    db_conn = init_db_connection()
    query = f"""SELECT * FROM products OFFSET {offset} LIMIT {page_size}"""
    with db_conn.cursor(cursor_factory=RealDictCursor) as cursor:
        cursor.execute(query=query)
        products = cursor.fetchall()
    db_conn.close()
    return products

def getTotalProductCount():
    total_count = 0
    db_conn = init_db_connection()
    query = f"""SELECT COUNT(*) as total_count FROM products"""
    with db_conn.cursor(cursor_factory=RealDictCursor) as cursor:
        cursor.execute(query=query)
        total_count = cursor.fetchone().get('total_count', 0)
    db_conn.close()
    return total_count

def getProductBySlug(slug: str):
    product = None
    db_conn = init_db_connection()
    query = f"""SELECT * FROM products WHERE slug = '{slug}'"""
    with db_conn.cursor(cursor_factory=RealDictCursor) as cursor:
        cursor.execute(query=query)
        product = cursor.fetchall()
    db_conn.close()
    return product

def getProductImages(product_id: str):
    product_images = []
    db_conn = init_db_connection()
    query = f"""SELECT * FROM product_images WHERE product_id = '{product_id}'"""
    with db_conn.cursor(cursor_factory=RealDictCursor) as cursor:
        cursor.execute(query=query)
        product_images = cursor.fetchall()
    db_conn.close()
    return product_images

def getProductReviews(product_id: str):
    product_reviews = []
    db_conn = init_db_connection()
    query = f"""SELECT * FROM product_reviews WHERE product_id = '{product_id}' ORDER BY created_at DESC"""
    with db_conn.cursor(cursor_factory=RealDictCursor) as cursor:
        cursor.execute(query=query)
        product_reviews = cursor.fetchall()
    db_conn.close()
    return product_reviews

def getShipments():
    shipments = []
    db_conn = init_db_connection()
    query = """SELECT * FROM shipments"""
    with db_conn.cursor(cursor_factory=RealDictCursor) as cursor:
        cursor.execute(query=query)
        shipments = cursor.fetchall()
    db_conn.close()
    return shipments
