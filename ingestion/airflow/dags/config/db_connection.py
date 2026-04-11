import os
import time
import pandas as pd
from sqlalchemy import create_engine

POSTGRES_URL = os.getenv("POSTGRES_URL", "postgresql://supplychain_user:supplychain_pass@host.docker.internal:5432/supply_chain_v2")


TARGET_TABLES = {
    'products': {
        'columns': [
            'product_id', 'slug', 'brand', 'product_name', 'product_details', 
            'description', 'thumbnail_url', 'vendor_id', 'mrp', 
            'selling_price', 'currency', 'category_slug', 'rating_average', 
            'rating_count', 'is_available', 'stock', 'created_at'
        ],
        'primary_key': 'product_id',
        'not_null_columns': [
            'product_id', 'slug', 'brand', 'product_name', 'vendor_id', 'mrp', 
            'selling_price', 'currency', 'category_slug', 'rating_average', 
            'rating_count', 'is_available', 'stock', 'created_at'
        ]
    },
    # Add more tables as needed
    'product_images': {
        'columns': ['image_id', 'product_id', 'image_url'],
        'primary_key': 'image_id',
        'not_null_columns': [
            'image_id', 'product_id', 'image_url'
        ]
    }
}


class DBConnection:

    def __init__(self):
        self.postgres_url = POSTGRES_URL
        self.engine = None

    def connect(self):
        self.engine = self.__init_db_connection()
        return self

    def __init_db_connection(self):
        retries = 0
        print(f"Attempting to connect to Postgres at {POSTGRES_URL}...")
        while retries < 5:
            try:
                print(f"Attempting to connect to Postgres (Attempt {retries+1})...")
                engine = create_engine(self.postgres_url)
                print("Successfully connected to Postgres!")
                return engine
            except Exception as e:
                retries += 1
                print(f"Postgres not ready yet. Retrying in 3 seconds... Error: {e}")
                time.sleep(3)
                
        raise Exception("Could not connect to Postgres after multiple retries.")
    
    def load_data(self, table_name: str, data: pd.DataFrame):

        print(f"Loading data to localhost:5432/supply_chain_v2 - {table_name}")

        if table_name not in TARGET_TABLES:
            raise ValueError(f"Table {table_name} is not defined in TARGET_TABLES.")
        
        columns = TARGET_TABLES[table_name]['columns']

        # Ensure data has the required columns
        if not all(col in data.columns for col in columns):
            raise ValueError(f"Data is missing required columns for table {table_name}. Required columns: {columns}")

        
        data.to_sql(
            table_name,
            self.engine,
            if_exists='append',  # For simplicity, replace existing data. In production, consider upsert logic.
            index=False,
            method='multi',  # Use multi-row insert for better performance
            chunksize=1000  # Insert in batches of 1000 rows
        )
    
    def close(self):
        if self.engine:
            self.engine.dispose()