from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from datetime import datetime
import pandas as pd
from sqlalchemy import create_engine
import json
import os
import random
from config.db_connection import DBConnection
import uuid

# DB connection (same as docker-compose)
DB_CONN = "postgresql+psycopg2://airflow:airflow@postgres/airflow"
JSON_PATH = '/opt/airflow/data/mock_dataset/flipkart_fashion_products_dataset.json'
CHECKPOINT_DIR = '/opt/airflow/data/checkpoints'
EXTRACT_CHECKPOINT_DIR = f"{CHECKPOINT_DIR}/extract"
TRANSFORM_CHECKPOINT_DIR = f"{CHECKPOINT_DIR}/transform"

# -------------------------------
# Task 1: Extract
# -------------------------------
def extract(**kwargs):
    with open(JSON_PATH, 'r') as f:
        data = json.load(f)
    for i in range(len(data)):
        data[i]['product_details'] = json.dumps(data[i]['product_details'])
    df = pd.DataFrame(data)
    os.makedirs(EXTRACT_CHECKPOINT_DIR, exist_ok=True)
    df.to_parquet(f"{EXTRACT_CHECKPOINT_DIR}/products.parquet", index=False)  # Save as Parquet for better performance


# -------------------------------
# Task 2: Transform
# -------------------------------
def transform(**kwargs):
    os.makedirs(TRANSFORM_CHECKPOINT_DIR, exist_ok=True)

    def product_details_to_dict(details):
        if isinstance(details, list):
            return {f"detail_{i+1}": detail for i, detail in enumerate(details)}
        return {}
    
    df = pd.read_parquet(f"{EXTRACT_CHECKPOINT_DIR}/products.parquet")

    product_df = df.rename(
        columns={
            '_id': 'product_id', 
            'title': 'product_name', 
            'description': 'description', 
            'seller': 'vendor_id', 
            'actual_price': 'mrp', 
            'selling_price': 'selling_price', 
            'category': 'category_slug', 
            'average_rating': 'rating_average', 
            'out_of_stock': 'is_available', 
            'product_details': 'product_details', 
            'crawled_at': 'created_at'
        }
    )

    product_df['slug'] = (
        product_df['category_slug'].str.replace(' ', '-').str.lower() + '-' 
        + product_df['sub_category'].str.replace(' ', '-').str.lower() + '-' 
        + product_df['product_name'].str.replace(' ', '-').str.lower()
    ).fillna('X')

    for col in ('brand', 'product_name', 'category_slug', 'vendor_id'):
        product_df[col] = product_df[col].fillna('X')

    product_df['vendor_id'] = product_df['vendor_id'].astype(str).apply(
        lambda name: str(uuid.uuid5(uuid.NAMESPACE_DNS, name.strip()))
    )

    product_df['currency'] = 'INR'  # Assuming all products are in INR, you can adjust this if needed

    product_df['thumbnail_url'] = product_df['images'].apply(lambda x: x[0] if isinstance(x, list) and len(x) > 0 else None)
    product_df['rating_count'] = product_df['rating_average'].apply(lambda x: random.randint(0, 1000) if pd.notnull(x) else 0)
    product_df['stock'] = product_df['is_available'].apply(lambda x: random.randint(100, 1000) if pd.notnull(x) else 0)

    product_images_df = product_df[['product_id', 'images']].explode('images').rename(columns={'images': 'image_url'})
    product_images_df = product_images_df[(~product_images_df['image_url'].isnull())].drop_duplicates()
    product_images_df['image_id'] = (
        product_images_df['product_id'] + product_images_df['image_url'].apply(lambda x: str(random.randint(0,10000) if x is None else x))
    )
    
    product_images_df['image_id'] = product_images_df['image_id'].astype(str).apply(
        lambda x: str(uuid.uuid5(uuid.NAMESPACE_URL, x))
    )
    
    product_images_df = product_images_df[['image_id', 'product_id', 'image_url']]

    product_df = product_df[[
        'product_id', 'slug', 'brand', 'product_name', 'product_details',
        'description', 'thumbnail_url', 'vendor_id', 'mrp', 
        'selling_price', 'currency', 'category_slug', 'rating_average', 
        'rating_count', 'is_available', 'stock', 'created_at'
    ]]

    # Now change data types as needed (e.g., convert created_at to datetime, ensure numeric types for prices and ratings)
    product_df['created_at'] = pd.to_datetime(product_df['created_at'], errors='coerce').fillna(datetime.now())
    product_df['mrp'] = pd.to_numeric(product_df['mrp'], errors='coerce').fillna(0.0)
    product_df['selling_price'] = pd.to_numeric(product_df['selling_price'], errors='coerce').fillna(0.0)
    product_df['rating_average'] = pd.to_numeric(product_df['rating_average'], errors='coerce').fillna(0.0)
    product_df['is_available'] = product_df['is_available'].astype(bool).fillna(True)
    product_df['stock'] = (product_df['stock']).astype(int).fillna(0)

    product_df.to_parquet(f"{TRANSFORM_CHECKPOINT_DIR}/products.parquet", index=False)
    product_images_df.to_parquet(f"{TRANSFORM_CHECKPOINT_DIR}/product_images.parquet", index=False)


# -------------------------------
# Task 3: Load
# -------------------------------
def load_product_summary(**kwargs):

    conn = DBConnection().connect()

    product_df = pd.read_parquet(f"{TRANSFORM_CHECKPOINT_DIR}/products.parquet")

    conn.load_data(
        table_name='products', data=product_df
    )

def load_product_images(**kwargs):
    conn = DBConnection().connect()
    product_images_df = pd.read_parquet(f"{TRANSFORM_CHECKPOINT_DIR}/product_images.parquet")
    conn.load_data(
        table_name='product_images', data=product_images_df
    )

def load_copy(**kwargs):
    product_df = pd.read_parquet(f"{TRANSFORM_CHECKPOINT_DIR}/products.parquet")
    product_images_df = pd.read_parquet(f"{TRANSFORM_CHECKPOINT_DIR}/product_images.parquet")

    engine = create_engine(DB_CONN)
    product_df.to_sql("products_summary", engine, if_exists="replace", index=False)
    product_images_df.to_sql("product_images", engine, if_exists="replace", index=False)

def cleanup(**kwargs):
    print("Cleaning up checkpoint files...")
    print(f"Removing {EXTRACT_CHECKPOINT_DIR}/products.parquet")
    os.remove(f"{EXTRACT_CHECKPOINT_DIR}/products.parquet")

    print(f"Removing {TRANSFORM_CHECKPOINT_DIR}/products.parquet")
    os.remove(f"{TRANSFORM_CHECKPOINT_DIR}/products.parquet")

    print(f"Removing {TRANSFORM_CHECKPOINT_DIR}/product_images.parquet")
    os.remove(f"{TRANSFORM_CHECKPOINT_DIR}/product_images.parquet")

# -------------------------------
# DAG Definition
# -------------------------------
with DAG(
    dag_id="etl_orders_pipeline",
    start_date=datetime(2024, 1, 1),
    schedule_interval=None,  # Set to None for manual trigger, or use a cron expression for scheduled runs
    catchup=False,
    tags=["etl", "demo"],
) as dag:

    extract_task = PythonOperator(
        task_id="extract",
        python_callable=extract,
    )

    transform_task = PythonOperator(
        task_id="transform",
        python_callable=transform,
    )

    load_product_summary_task = PythonOperator(
        task_id="load_product_summary",
        python_callable=load_product_summary,
    )

    load_product_images_task = PythonOperator(
        task_id="load_product_images",
        python_callable=load_product_images,
    )

    load_copy_task = PythonOperator(
        task_id="load_copy",
        python_callable=load_copy,
    )

    cleanup_task = PythonOperator(
        task_id="cleanup",
        python_callable=cleanup,
    )

    extract_task >> transform_task >> [load_product_summary_task >> load_product_images_task, load_copy_task] >> cleanup_task