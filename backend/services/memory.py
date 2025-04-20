from backend.services.embedding import get_embedding
from backend.db.pinecone_db import upsert_memory, query_similar_memories
from backend.schemas import MemoryEntry
from datetime import datetime
    
def store_memory(entry: MemoryEntry):
    try:
        embedding = get_embedding(entry.text)

        # Safely extract metadata without None values
        metadata = {
            k: (
                v.isoformat() if isinstance(v, datetime) else v
            )
            for k, v in entry.model_dump().items()
            if v is not None
        }

        # Ensure timestamp is set and stringified
        if "timestamp" not in metadata:
            metadata["timestamp"] = datetime.utcnow().isoformat()

        return upsert_memory(embedding, metadata)
    except Exception as e:
        raise RuntimeError(f"store_memory failed: {str(e)}")



def search_memory(query: str):
    try:
        query_embedding = get_embedding(query)
        results = query_similar_memories(query_embedding)
        return [match.metadata for match in results]
    except Exception as e:
        raise RuntimeError(f"search_memory failed: {str(e)}")
