from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.routes import memory, chat, digest

app = FastAPI(
    title="Memo.dev API",
    description="Personalized AI Coding Assistant API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(memory.router, prefix="/api/memory", tags=["Memory"])
app.include_router(chat.router, prefix="/api/gpt")
app.include_router(digest.router, prefix="/api/digest", tags=["Digest"])