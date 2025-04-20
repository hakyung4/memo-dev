from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.routes import memory

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