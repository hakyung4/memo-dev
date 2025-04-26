from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class MemoryEntry(BaseModel):
    id: Optional[str] = None
    user_id: Optional[str] = None
    project: Optional[str] = None
    filename: Optional[str] = None
    text: str
    timestamp: Optional[datetime] = None
    fixed_by_ai: Optional[bool] = False
    suggested_keywords: Optional[List[str]] = []

class MemoryQuery(BaseModel):
    query: str
    user_id: str
    project: Optional[str] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    fixed_by_ai: Optional[bool] = None
    tags: Optional[List[str]] = None  # for future extension
    
class MemoryResponse(BaseModel):
    success: bool
    message: str

class ChatSaveRequest(BaseModel):
    user_id: str
    prompt: str
    response: str
    project: Optional[str] = None
    filename: Optional[str] = None
    fixed_by_ai: Optional[bool] = True

class GraphNode(BaseModel):
    id: str
    label: str
    project: Optional[str]
    filename: Optional[str]

class GraphEdge(BaseModel):
    source: str
    target: str
    weight: float

class GraphResponse(BaseModel):
    nodes: list[GraphNode]
    edges: list[GraphEdge]
