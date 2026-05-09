from typing import Protocol
from backend.app.agents.schemas import RetrievalHit


class VectorBackend(Protocol):
    def upsert(self, workspace_id: str, document_id: str, text: str, metadata: dict) -> None: ...
    def search(self, workspace_id: str, query: str, k: int = 5) -> list[RetrievalHit]: ...


class BackendSelection:
    SUPPORTED = {"local", "faiss", "qdrant", "chroma", "pgvector"}

    @classmethod
    def validate(cls, backend: str) -> str:
        if backend not in cls.SUPPORTED:
            raise ValueError(f"Unsupported vector backend: {backend}")
        return backend
