import os
import psycopg2
from psycopg2.extras import RealDictCursor
from flask import current_app

def get_db_connection():
    conn = psycopg2.connect(
        host=os.environ.get('DB_HOST', 'postgres'),
        port=os.environ.get('DB_PORT', '5432'),
        user=os.environ.get('DB_USER', 'microservices'),
        password=os.environ.get('DB_PASSWORD', 'microservices123'),
        database=os.environ.get('DB_NAME', 'product_db')
    )
    return conn

def init_db():
    """Initialize database connection check"""
    try:
        conn = get_db_connection()
        conn.close()
        return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False
