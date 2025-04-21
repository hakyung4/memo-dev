import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    return psycopg2.connect(
        dbname=os.getenv("PG_DB"),
        user=os.getenv("PG_USER"),
        password=os.getenv("PG_PASSWORD"),
        host=os.getenv("PG_HOST"),
        port=os.getenv("PG_PORT"),
        cursor_factory=RealDictCursor
    )

def insert_memory_to_db(memory_id, user_id, project, filename, text, timestamp, fixed_by_ai):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO memories (id, user_id, project, filename, text, timestamp, fixed_by_ai)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """,
        (memory_id, user_id, project, filename, text, timestamp, fixed_by_ai)
    )
    conn.commit()
    cur.close()
    conn.close()

def fetch_memories_by_ids(user_id, ids):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT * FROM memories
        WHERE user_id = %s AND id = ANY(%s)
        ORDER BY timestamp DESC
        """,
        (user_id, ids)
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows
