from backend.db.pg import get_connection
from datetime import datetime, timedelta, date

def get_weekly_digest(user_id: str, selected_date: date = None):
    try:
        conn = get_connection()
        cur = conn.cursor()

        # 🧠 Determine the week (Monday to Sunday)
        if selected_date:
            # User picked a specific day — find Monday of that week
            weekday = selected_date.weekday()  # Monday = 0, Sunday = 6
            monday = selected_date - timedelta(days=weekday)
            sunday = monday + timedelta(days=6)
        else:
            # Default to current week
            today = datetime.utcnow().date()
            weekday = today.weekday()
            monday = today - timedelta(days=weekday)
            sunday = monday + timedelta(days=6)

        monday_start = datetime.combine(monday, datetime.min.time())
        sunday_end = datetime.combine(sunday, datetime.max.time())

        cur.execute(
            """
            SELECT id, text, timestamp
            FROM memories
            WHERE user_id = %s
            AND timestamp BETWEEN %s AND %s
            ORDER BY timestamp DESC
            LIMIT 5
            """,
            (user_id, monday_start, sunday_end)
        )

        rows = cur.fetchall()
        cur.close()
        conn.close()

        return {
            "new_memory_count": len(rows),
            "top_memories": rows
        }

    except Exception as e:
        raise RuntimeError(f"Failed to fetch weekly digest: {str(e)}")
