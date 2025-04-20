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
        results = search_memory(query.query)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching memory: {str(e)}")
