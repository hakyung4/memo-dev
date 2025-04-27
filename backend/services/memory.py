from backend.services.embedding import get_embedding
from backend.db.pinecone_db import upsert_memory, query_similar_memories, delete_vector, fetch_user_vectors
from backend.schemas import MemoryEntry, ChatSaveRequest, GraphNode, GraphEdge, GraphResponse, MemoryQuery
from backend.db.pg import insert_memory_to_db, fetch_memories_by_ids, delete_memory_from_db, fetch_memory_ids, fetch_memories_filtered, fetch_memories_filtered_no_ids
from datetime import datetime
import uuid
import numpy as np
import re
from collections import Counter

STOPWORDS = set([
    "the", "and", "is", "to", "for", "of", "a", "in", "on", "this", "that", "it", "as", "with", "by", "an", "be",
    "from", "at", "are", "was", "or", "but", "not", "have", "has", "had"
])
    
def store_memory(entry: MemoryEntry):
    try:
        embedding = get_embedding(entry.text)

        memory_id = str(uuid.uuid4())
        timestamp = entry.timestamp or datetime.utcnow()

        metadata = {
            "id": memory_id,
            "user_id": str(entry.user_id),
            "project": entry.project,
            "filename": entry.filename,
            "text": entry.text,
            "timestamp": timestamp.isoformat(),
            "fixed_by_ai": entry.fixed_by_ai,
            "tags": [tag.lower() for tag in entry.tags] if entry.tags else [],
        }

        upsert_memory(embedding, metadata)

        insert_memory_to_db(
            memory_id,
            entry.user_id,
            entry.project,
            entry.filename,
            entry.text,
            timestamp,
            entry.fixed_by_ai,
            [tag.lower() for tag in entry.tags] if entry.tags else None
        )

        return memory_id
    except Exception as e:
        raise RuntimeError(f"store_memory failed: {str(e)}")


    
def search_memory(query_obj: MemoryQuery):
    try:
        if not query_obj.query or query_obj.query.strip() == "":
            # 🆕 No semantic search if no query — just SQL filters
            return fetch_memories_filtered_no_ids(
                user_id=query_obj.user_id,
                project=query_obj.project,
                date_from=query_obj.date_from,
                date_to=query_obj.date_to,
                fixed_by_ai=query_obj.fixed_by_ai,
                tags=query_obj.tags
            )
        
        query_embedding = get_embedding(query_obj.query)
        pinecone_matches = query_similar_memories(query_embedding)

        matching_ids = [
            match.metadata["id"] for match in pinecone_matches
            if str(match.metadata.get("user_id")) == str(query_obj.user_id)
        ]

        if not matching_ids:
            return []

        return fetch_memories_filtered(
            user_id=query_obj.user_id,
            ids=matching_ids,
            project=query_obj.project,
            date_from=query_obj.date_from,
            date_to=query_obj.date_to,
            fixed_by_ai=query_obj.fixed_by_ai,
            tags=query_obj.tags
        )
    except Exception as e:
        raise RuntimeError(f"search_memory failed: {str(e)}")

def store_chat_memory(entry: ChatSaveRequest):
    try:
        full_text = f"Q: {entry.prompt}\n\n---\n\nA: {entry.response}"

        memory = MemoryEntry(
            user_id=entry.user_id,
            project=entry.project or "",
            filename=entry.filename or "",
            text=full_text,
            fixed_by_ai=entry.fixed_by_ai or False,
            tags=[tag.lower() for tag in entry.tags] if entry.tags else [],  # 🆕 properly propagate tags
        )
        return store_memory(memory)
    except Exception as e:
        raise RuntimeError(f"store_chat_memory failed: {str(e)}")


def delete_memory(memory_id: str, user_id: str):
    delete_vector(memory_id)
    delete_memory_from_db(memory_id, user_id)

def cosine_similarity(v1, v2):
    v1 = np.array(v1)
    v2 = np.array(v2)
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2) + 1e-10)

def extract_keyword(text: str):
    cleaned = re.sub(r"Q:|A:|---", "", text)
    words = cleaned.strip().split()
    if words:
        return words[0].capitalize()
    return "Memory"

def get_memory_graph(user_id: str) -> GraphResponse:
    try:
        matches = fetch_user_vectors(user_id)
        vectors = []
        nodes = []

        valid_ids = fetch_memory_ids(user_id)

        for match in matches:
            meta = match.metadata
            if "id" not in meta:
                continue
            if meta["id"] not in valid_ids:
                continue
            if "values" not in match or not match.values:
                continue

            label = meta.get("filename")
            if not label:
                label = extract_keyword(meta.get("text", ""))

            if meta.get("project"):
                label += f" ({meta.get('project')})"

            vectors.append((match.id, match.values))
            nodes.append(GraphNode(
                id=match.id,
                label=label,
                project=meta.get("project"),
                filename=meta.get("filename")
            ))

        edges = []
        for i in range(len(vectors)):
            for j in range(i + 1, len(vectors)):
                sim = cosine_similarity(vectors[i][1], vectors[j][1])
                if sim > 0.85:
                    edges.append(GraphEdge(
                        source=vectors[i][0],
                        target=vectors[j][0],
                        weight=sim
                    ))

        return GraphResponse(nodes=nodes, edges=edges)
    except Exception as e:
        raise RuntimeError(f"get_memory_graph failed: {str(e)}")
    
def extract_keywords(text: str) -> list[str]:
    text = text.lower()
    words = re.findall(r'\b[a-z]+\b', text)  # Only keep words (no numbers/symbols)
    words = [w for w in words if w not in STOPWORDS]
    counter = Counter(words)
    most_common = [word for word, _ in counter.most_common(5)]
    return most_common