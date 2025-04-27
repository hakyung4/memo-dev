from backend.db.pg import get_connection
from backend.services.embedding import get_embedding
from datetime import datetime, timedelta, date
import numpy as np
import re
from collections import Counter

# 🧠 Helper to extract keywords (mock summarization)
STOPWORDS = set([
    "the", "and", "is", "to", "for", "of", "a", "in", "on", "this", "that", "it", "as", "with", "by", "an",
    "be", "from", "at", "are", "was", "or", "but", "not", "have", "has", "had"
])

def extract_keywords(text):
    words = re.findall(r'\b[a-z]+\b', text.lower())
    words = [w for w in words if w not in STOPWORDS]
    counter = Counter(words)
    most_common = [word for word, _ in counter.most_common(5)]
    return most_common

# 🧠 Cosine similarity
def cosine_similarity(v1, v2):
    v1 = np.array(v1)
    v2 = np.array(v2)
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2) + 1e-10)

def get_weekly_digest(user_id: str, selected_date: date = None):
    try:
        conn = get_connection()
        cur = conn.cursor()

        # Determine week range
        if selected_date:
            weekday = selected_date.weekday()
            monday = selected_date - timedelta(days=weekday)
            sunday = monday + timedelta(days=6)
        else:
            today = datetime.utcnow().date()
            weekday = today.weekday()
            monday = today - timedelta(days=weekday)
            sunday = monday + timedelta(days=6)

        monday_start = datetime.combine(monday, datetime.min.time())
        sunday_end = datetime.combine(sunday, datetime.max.time())

        # Fetch all memories of the week
        cur.execute(
            """
            SELECT id, text, timestamp, project, filename, tags
            FROM memories
            WHERE user_id = %s
            AND timestamp BETWEEN %s AND %s
            """,
            (user_id, monday_start, sunday_end)
        )

        rows = cur.fetchall()
        cur.close()
        conn.close()

        if not rows:
            return {
                "new_memory_count": 0,
                "journal_entries": []
            }

        # Get embeddings (mocked for now)
        embeddings = [get_embedding(row['text']) for row in rows]

        # Simple clustering: assign each memory to a "center" by threshold
        clusters = []
        threshold = 0.85  # Similarity threshold

        for i, emb in enumerate(embeddings):
            assigned = False
            for cluster in clusters:
                if cosine_similarity(emb, cluster['center']) > threshold:
                    cluster['members'].append(rows[i])
                    assigned = True
                    break
            if not assigned:
                clusters.append({
                    "center": emb,
                    "members": [rows[i]]
                })

        # Sort clusters by size
        clusters.sort(key=lambda c: len(c['members']), reverse=True)

        # Take top 5 clusters
        top_clusters = clusters[:5]

        journal_entries = []

        for cluster in top_clusters:
            # Combine texts
            combined_text = " ".join(m['text'] for m in cluster['members'])
            keywords = extract_keywords(combined_text)

            # Fake summarization for now
            if keywords:
                summary = f"This week, you focused on topics like: {', '.join(keywords)}."
            else:
                summary = "This week, you worked on various coding topics."

            journal_entries.append({
                "summary": summary,
                "memory_count": len(cluster['members']),
                "examples": [m['text'][:200] + '...' for m in cluster['members'][:2]]  # small samples
            })

        return {
            "new_memory_count": len(rows),
            "journal_entries": journal_entries
        }

    except Exception as e:
        raise RuntimeError(f"Failed to generate weekly digest: {str(e)}")
