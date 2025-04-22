from backend.services.embedding import get_embedding
from backend.db.pinecone_db import upsert_memory, query_similar_memories
from backend.schemas import MemoryEntry
from backend.db.pg import insert_memory_to_db, fetch_memories_by_ids
from datetime import datetime
import uuid

# def store_memory(entry: MemoryEntry):
#     try:
#         embedding = get_embedding(entry.text)

#         # Set timestamp if not set
#         timestamp = entry.timestamp or datetime.utcnow()
#         memory_id = entry.id or str(uuid.uuid4())

#         metadata = {
#             "id": memory_id,
#             "user_id": str(entry.user_id),
#             "project": entry.project,
#             "filename": entry.filename,
#             "text": entry.text,
#             "timestamp": timestamp.isoformat(),
#             "fixed_by_ai": entry.fixed_by_ai,
#         }

#         # Save to Pinecone
#         upsert_memory(embedding, metadata)

#         # Save to PostgreSQL
#         insert_memory_to_db(
#             memory_id,
#             entry.user_id,
#             entry.project,
#             entry.filename,
#             entry.text,
#             timestamp,
#             entry.fixed_by_ai
#         )

#         return memory_id
#     except Exception as e:
#         raise RuntimeError(f"store_memory failed: {str(e)}")
    
def store_memory(entry: MemoryEntry):
    try:
        embedding = get_embedding(entry.text)

        # ✅ One single ID used everywhere
        memory_id = str(uuid.uuid4())
        timestamp = entry.timestamp or datetime.utcnow()

        metadata = {
            "id": memory_id,  # used for Pinecone vector ID
            "user_id": str(entry.user_id),
            "project": entry.project,
            "filename": entry.filename,
            "text": entry.text,
            "timestamp": timestamp.isoformat(),
            "fixed_by_ai": entry.fixed_by_ai,
        }

        # ✅ Pinecone vector gets the same ID
        upsert_memory(embedding, metadata)

        # ✅ Postgres row gets the same ID
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

        # Print exact metadata Pinecone is returning (once and for all)
        print("\\n--- Pinecone Matches ---")
        for match in results:
            print("Match ID:", match.id)
            print("Metadata:", match.metadata)

        # Filter only those vector matches with matching user_id
        matching_ids = [
            match.metadata["id"] for match in results
            if str(match.metadata.get("user_id")) == str(user_id)
        ]


        print("Matching IDs after filter:", matching_ids)

        if not matching_ids:
            return []

        return fetch_memories_by_ids(user_id, matching_ids)
    except Exception as e:
        raise RuntimeError(f"search_memory failed: {str(e)}")

