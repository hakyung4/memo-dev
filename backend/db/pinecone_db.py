import os
import uuid
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv

load_dotenv()

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index_name = os.getenv("PINECONE_INDEX", "memo-dev")

if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name,
        dimension=1536,
        metric="cosine",
        spec=ServerlessSpec(cloud=os.getenv("PINECONE_CLOUD", "aws"), region=os.getenv("PINECONE_REGION", "us-east-1"))
    )

index = pc.Index(index_name)

def upsert_memory(embedding: list[float], metadata: dict):
    try:
        if "id" not in metadata:
            raise ValueError("Missing 'id' in metadata for Pinecone upsert")

        vector_id = metadata["id"]  # ✅ DO NOT generate a new one

        index.upsert([
            {
                "id": vector_id,
                "values": embedding,
                "metadata": metadata
            }
        ])

        return vector_id
    except Exception as e:
        raise RuntimeError(f"upsert_memory failed: {str(e)}")

def query_similar_memories(query_embedding: list[float], top_k=5):
    try:
        result = index.query(vector=query_embedding, top_k=top_k, include_metadata=True)
        return result.matches
    except Exception as e:
        raise RuntimeError(f"query_similar_memories failed: {str(e)}")
