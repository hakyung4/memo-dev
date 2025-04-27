from fastapi import APIRouter, HTTPException, Path
from backend.schemas import MemoryEntry, MemoryQuery, MemoryResponse, ChatSaveRequest, GraphResponse
from backend.services.memory import store_memory, search_memory, store_chat_memory, delete_memory, get_memory_graph, extract_keywords
from backend.db.pg import fetch_memory_by_id, fetch_all_memories, fetch_user_projects

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
        results = search_memory(query)

        if not results:
            print("⚠️ No rows fetched from fetch_memories_by_ids")
            return []

        print("\n✅ Raw results returned from Postgres:")
        for r in results:
            print(r)

        models = []
        for row in results:
            try:
                row.setdefault("fixed_by_ai", False)
                models.append(MemoryEntry(**row))
            except Exception as e:
                print("❌ Error converting row to MemoryEntry:", e)
                print("Row:", row)

        return models

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching memory: {str(e)}")


@router.post("/save-chat", response_model=MemoryResponse)
def save_chat(entry: ChatSaveRequest):
    try:
        memory_id = store_chat_memory(entry)
        return MemoryResponse(success=True, message=f"Chat Q&A saved with ID: {memory_id}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving chat Q&A: {str(e)}")

@router.delete("/delete/{memory_id}/{user_id}", response_model=MemoryResponse)
def delete_memory_route(memory_id: str = Path(...), user_id: str = Path(...)):
    try:
        delete_memory(memory_id, user_id)
        return MemoryResponse(success=True, message=f"Deleted memory {memory_id}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting memory: {str(e)}")
    
@router.get("/graph/{user_id}", response_model=GraphResponse)
def memory_graph(user_id: str):
    try:
        return get_memory_graph(user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating graph: {str(e)}")
    
@router.get("/detail/{memory_id}", response_model=MemoryEntry)
def memory_detail(memory_id: str):
    try:
        memory = fetch_memory_by_id(memory_id)
        if not memory:
            raise HTTPException(status_code=404, detail="Memory not found")

        # 🧠 Extract keywords from memory text
        keywords = extract_keywords(memory.get("text", ""))

        return MemoryEntry(
            **memory,
            suggested_keywords=keywords
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching memory detail: {str(e)}")
    
@router.get("/all/{user_id}", response_model=list[MemoryEntry])
def all_memories(user_id: str):
    try:
        memories = fetch_all_memories(user_id)
        return [MemoryEntry(**mem) for mem in memories]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching all memories: {str(e)}")

@router.get("/projects/{user_id}", response_model=list)
def user_projects(user_id: str):
    try:
        projects = fetch_user_projects(user_id)
        return projects
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching projects: {str(e)}")
