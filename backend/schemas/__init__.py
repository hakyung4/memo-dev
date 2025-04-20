from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MemoryEntry(BaseModel):
    id: Optional[str] = None  # UUID later
    project: Optional[str] = None
    filename: Optional[str] = None
    text: str
    timestamp: Optional[datetime] = None

class MemoryQuery(BaseModel):
    query: str

class MemoryResponse(BaseModel):
    success: bool
    message: str
