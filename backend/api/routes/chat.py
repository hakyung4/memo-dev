from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Literal
import random
from backend.services.embedding import get_embedding
from backend.db.pinecone_db import query_project_memories

router = APIRouter()

class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str

class ChatRequest(BaseModel):
    prompt: str
    history: List[ChatMessage] = []
    project: str = ''
    user_id: str = '' 

class ChatResponse(BaseModel):
    response: str
    usage: dict
    memories: list[str] = []
    
@router.post("/chat", response_model=ChatResponse)
def chat_with_gpt(req: ChatRequest):
    try:
        base_prompt = ""
        pulled_memories = []

        if req.project and req.user_id:
            query_embedding = get_embedding(req.prompt)
            matched_memories = query_project_memories(query_embedding, req.user_id, req.project, top_k=5)
            if matched_memories:
                pulled_memories = [match['metadata']['text'] for match in matched_memories]
                memory_text = "\n".join(f"- {m}" for m in pulled_memories)
                base_prompt += (
                    "Here are some past memories from your project that may help you answer:\n\n"
                    f"{memory_text}\n\n"
                    "Please begin your reply by listing these memories.\n"
                    "Then provide the answer to the user's question.\n\n"
                )

        # If no memories found, just ask user's question directly
        full_prompt = (base_prompt + req.prompt) if pulled_memories else req.prompt

        # Mocked GPT response (for now)
        dummy_responses = [
            "You can fix circular imports by restructuring your code.",
            "Try placing shared code in a separate module.",
            "Use FastAPI's `Depends` to avoid eager imports.",
        ]
        reply = random.choice(dummy_responses)

        return {
            "response": reply,
            "usage": {"mock": True},
            "memories": pulled_memories
        }

     # ✅ Real GPT call (Uncomment for production)
        # messages = req.history + [{"role": "user", "content": req.prompt}]
        # completion = client.chat.completions.create(model="gpt-4o", messages=messages)
        # reply = completion.choices[0].message.content
        # usage = dict(completion.usage) if completion.usage else {}
        # return ChatResponse(response=reply, usage=usage)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"GPT chat failed: {str(e)}")


@router.post("/chat", response_model=ChatResponse)
def chat_with_gpt(req: ChatRequest):
    try:
        base_prompt = ""
        pulled_memories = []

        if req.project and req.user_id:
            query_embedding = get_embedding(req.prompt)
            matched_memories = query_project_memories(query_embedding, req.user_id, req.project, top_k=5)
            if matched_memories:
                pulled_memories = [match['metadata']['text'] for match in matched_memories]
                memory_text = "\n".join(f"- {m}" for m in pulled_memories)
                base_prompt += (
                    "Here are some past memories from your project that may help you answer:\n\n"
                    f"{memory_text}\n\n"
                    "Please begin your reply by listing these memories.\n"
                    "Then provide the answer to the user's question.\n\n"
                )

        full_prompt = base_prompt + req.prompt

        # Mocked GPT response for dev
        dummy_responses = [
            "You can fix circular imports by restructuring your code.",
            "Try placing shared code in a separate module.",
            "Use FastAPI's `Depends` to avoid eager imports.",
        ]
        reply = random.choice(dummy_responses)

        return {
            "response": reply,
            "usage": {"mock": True},
            "memories": pulled_memories
        }
    # ✅ Real GPT call (Uncomment for production)
        # messages = req.history + [{"role": "user", "content": req.prompt}]
        # completion = client.chat.completions.create(model="gpt-4o", messages=messages)
        # reply = completion.choices[0].message.content
        # usage = dict(completion.usage) if completion.usage else {}
        # return ChatResponse(response=reply, usage=usage)


    except Exception as e:
        raise HTTPException(status_code=500, detail=f"GPT chat failed: {str(e)}")