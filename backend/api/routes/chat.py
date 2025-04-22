from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Literal
import random

# Uncomment for real GPT
# from openai import OpenAI
# import os
# client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

router = APIRouter()

class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str

class ChatRequest(BaseModel):
    prompt: str
    history: List[ChatMessage] = []

class ChatResponse(BaseModel):
    response: str
    usage: dict

@router.post("/chat", response_model=ChatResponse)
def chat_with_gpt(req: ChatRequest):
    try:
        # ✅ Mocked response for dev (no tokens used)
        dummy_responses = [
            "You can fix circular imports by restructuring your code.",
            "Try placing shared code in a separate module.",
            "Use FastAPI's `Depends` to avoid eager imports.",
        ]
        reply = random.choice(dummy_responses)
        return ChatResponse(response=reply, usage={"mock": True})

        # ✅ Real GPT call (Uncomment for production)
        # messages = req.history + [{"role": "user", "content": req.prompt}]
        # completion = client.chat.completions.create(model="gpt-4o", messages=messages)
        # reply = completion.choices[0].message.content
        # usage = dict(completion.usage) if completion.usage else {}
        # return ChatResponse(response=reply, usage=usage)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"GPT chat failed: {str(e)}")
