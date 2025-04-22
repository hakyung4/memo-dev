from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MemoryEntry(BaseModel):
    id: Optional[str] = None
    user_id: Optional[str] = None
    project: Optional[str] = None
    filename: Optional[str] = None
    text: str
    timestamp: Optional[datetime] = None
    fixed_by_ai: Optional[bool] = False

class MemoryQuery(BaseModel):
    query: str
    user_id: str

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
