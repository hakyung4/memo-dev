import os
import psycopg2
from psycopg2.extras import RealDictCursor, execute_values
from dotenv import load_dotenv
import uuid
from psycopg2 import sql


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

    # ✅ Convert all UUIDs to strings
    uuid_ids = [str(uuid.UUID(i)) for i in ids]
    placeholders = ",".join(["%s"] * len(uuid_ids))

    query = sql.SQL(f"""
        SELECT * FROM memories
        WHERE user_id = %s AND id IN ({placeholders})
        ORDER BY timestamp DESC
    """)

    print("🧪 Running Postgres Query:")
    print("user_id =", user_id)
    print("uuid_ids =", uuid_ids)
    print("placeholders =", placeholders)

    cur.execute(query, [str(user_id), *uuid_ids])
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

def delete_memory_from_db(memory_id, user_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "DELETE FROM memories WHERE id = %s AND user_id = %s",
        (memory_id, user_id)
    )
    conn.commit()
    cur.close()
    conn.close()
