import os
import psycopg2
from psycopg2.extras import RealDictCursor, execute_values
from dotenv import load_dotenv
import uuid
from psycopg2 import sql
from datetime import timedelta

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

def insert_memory_to_db(memory_id, user_id, project, filename, text, timestamp, fixed_by_ai, tags=None):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO memories (id, user_id, project, filename, text, timestamp, fixed_by_ai, tags)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (memory_id, user_id, project, filename, text, timestamp, fixed_by_ai, tags)
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

def fetch_memory_by_id(memory_id: str):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT * FROM memories
        WHERE id = %s
        """,
        (memory_id,)
    )
    row = cur.fetchone()
    cur.close()
    conn.close()
    return row

def fetch_memory_ids(user_id: str):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT id FROM memories
        WHERE user_id = %s
        """,
        (user_id,)
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return {row['id'] for row in rows}

def fetch_memories_filtered(user_id, ids, project=None, date_from=None, date_to=None, fixed_by_ai=None, tags=None):
    conn = get_connection()
    cur = conn.cursor()

    uuid_ids = [str(uuid.UUID(i)) for i in ids]
    placeholders = ",".join(["%s"] * len(uuid_ids))

    base_query = f"""
        SELECT * FROM memories
        WHERE user_id = %s AND id IN ({placeholders})
    """
    params = [str(user_id)] + uuid_ids

    # 🧠 Dynamic filter additions
    if project:
        base_query += " AND project = %s"
        params.append(project)

    if date_from:
        base_query += " AND timestamp >= %s"
        params.append(date_from)

    if date_to:
        # Add one day to make date_to inclusive
        adjusted_date_to = date_to + timedelta(days=1)
        base_query += " AND timestamp < %s"
        params.append(adjusted_date_to)

    if fixed_by_ai is not None:
        base_query += " AND fixed_by_ai = %s"
        params.append(fixed_by_ai)

    # (Optional) Tags filtering (if you add tagging support later)
    if tags:
        base_query += " AND tags && %s"
        params.append(tags)

    base_query += " ORDER BY timestamp DESC"

    print("🧠 Final Query:", base_query)
    print("🧠 Params:", params)

    cur.execute(base_query, params)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

def fetch_all_memories(user_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT * FROM memories
        WHERE user_id = %s
        ORDER BY timestamp DESC
        """,
        (user_id,)
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

def fetch_memories_filtered_no_ids(user_id, project=None, date_from=None, date_to=None, fixed_by_ai=None, tags=None):
    conn = get_connection()
    cur = conn.cursor()

    base_query = """
        SELECT * FROM memories
        WHERE user_id = %s
    """
    params = [str(user_id)]

    if project:
        base_query += " AND project = %s"
        params.append(project)

    if date_from:
        base_query += " AND timestamp >= %s"
        params.append(date_from)

    if date_to:
        base_query += " AND timestamp <= %s"
        params.append(date_to)

    if fixed_by_ai is not None:
        base_query += " AND fixed_by_ai = %s"
        params.append(fixed_by_ai)
    
    if tags:
        base_query += " AND tags && %s"
        params.append(tags)

    base_query += " ORDER BY timestamp DESC"

    cur.execute(base_query, params)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

def fetch_user_projects(user_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT DISTINCT project
        FROM memories
        WHERE user_id = %s
        """,
        (user_id,)
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows
