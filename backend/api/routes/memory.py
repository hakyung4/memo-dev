from fastapi import APIRouter, HTTPException
from backend.schemas import MemoryEntry, MemoryQuery, MemoryResponse
from backend.services.memory import store_memory, search_memory

router = APIRouter()

@router.post("/add", response_model=MemoryResponse)
def add_memory(entry: MemoryEntry):
    try:
        vector_id = store_memory(entry)
        return MemoryResponse(success=True, message=f"Memory stored with ID: {vector_id}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error storing memory: {str(e)}")

@router.post("/search", response_model=list[MemoryEntry])
def search_memory_route(query: MemoryQuery):
    try:
        results = search_memory(query.query, query.user_id)

        if not results:
            print("⚠️ No rows fetched from fetch_memories_by_ids")
            return []

        print("\n✅ Raw results returned from Postgres:")
        for r in results:
            print(r)

        models = []
        for row in results:
            try:
                # Ensure all required fields are present
                row.setdefault("fixed_by_ai", False)
                models.append(MemoryEntry(**row))
            except Exception as e:
                print("❌ Error converting row to MemoryEntry:", e)
                print("Row:", row)

        return models

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching memory: {str(e)}")
