from backend.services.embedding import get_embedding
from backend.db.pinecone_db import upsert_memory, query_similar_memories
from backend.schemas import MemoryEntry
from backend.db.pg import insert_memory_to_db, fetch_memories_by_ids
from datetime import datetime
import uuid

def store_memory(entry: MemoryEntry):
    try:
        embedding = get_embedding(entry.text)

        # Set timestamp if not set
        timestamp = entry.timestamp or datetime.utcnow()
        memory_id = entry.id or str(uuid.uuid4())

        metadata = {
            "id": memory_id,
            "user_id": entry.user_id,
            "project": entry.project,
            "filename": entry.filename,
            "text": entry.text,
            "timestamp": timestamp.isoformat(),
            "fixed_by_ai": entry.fixed_by_ai,
        }

        # Save to Pinecone
        upsert_memory(embedding, metadata)

        # Save to PostgreSQL
        insert_memory_to_db(
            memory_id,
            entry.user_id,
            entry.project,
            entry.filename,
            entry.text,
            timestamp,
            entry.fixed_by_ai
        )

        return memory_id
    except Exception as e:
        raise RuntimeError(f"store_memory failed: {str(e)}")

def search_memory(query: str, user_id: str):
    try:
        query_embedding = get_embedding(query)
        results = query_similar_memories(query_embedding)
        matched_ids = [match.id for match in results]
        return fetch_memories_by_ids(user_id, matched_ids)
    except Exception as e:
        raise RuntimeError(f"search_memory failed: {str(e)}")
