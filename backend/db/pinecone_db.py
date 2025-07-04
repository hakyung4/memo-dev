import os
import uuid
from pinecone import Pinecone, ServerlessSpec, Index
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

def delete_vector(vector_id: str):
    try:
        index.delete(ids=[vector_id])
    except Exception as e:
        raise RuntimeError(f"delete_vector failed: {str(e)}")
    
def fetch_user_vectors(user_id: str):
    try:
        results = index.query(
            vector=[0.0]*1536,
            top_k=1000,
            filter={"user_id": user_id},
            include_metadata=True,
            include_values=True
        )
        return results.matches
    except Exception as e:
        raise RuntimeError(f"fetch_user_vectors failed: {str(e)}")

def query_project_memories(query_embedding, user_id, project, top_k=5):
    try:
        filter_conditions = {
            "user_id": user_id,
            "project": project,
        }
        result = index.query(
            vector=query_embedding,
            top_k=top_k,
            filter=filter_conditions,
            include_metadata=True
        )
        return result.matches
    except Exception as e:
        raise RuntimeError(f"query_project_memories failed: {str(e)}")