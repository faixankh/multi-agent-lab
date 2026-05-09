from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.routes import router
from backend.app.db.session import init_db

app = FastAPI(
    title="AgentOS Enterprise Platform API",
    description="Multi-agent AI operating system with tool use, RAG, memory, approvals, traces, and evaluation.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    init_db()


@app.get("/health")
def health() -> dict:
    return {"status": "healthy", "service": "agentos-api", "version": "2.0.0"}


app.include_router(router)
