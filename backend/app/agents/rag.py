import math
import re
from collections import Counter
from backend.app.agents.schemas import RetrievalHit

TOKEN_RE = re.compile(r"[a-zA-Z0-9_\-]+")


def tokenize(text: str) -> list[str]:
    return [token.lower() for token in TOKEN_RE.findall(text)]


def cosine(a: Counter[str], b: Counter[str]) -> float:
    if not a or not b:
        return 0.0
    common = set(a) & set(b)
    numerator = sum(a[t] * b[t] for t in common)
    da = math.sqrt(sum(v * v for v in a.values()))
    db = math.sqrt(sum(v * v for v in b.values()))
    return numerator / (da * db) if da and db else 0.0


class LocalRagRetriever:
    """Small deterministic retriever used for local execution.

    The interface intentionally mirrors a vector database adapter so FAISS,
    Qdrant, Chroma, or pgvector can be inserted without changing the agent.
    """

    def __init__(self, repository):
        self.repository = repository

    def search(self, workspace_id: str, query: str, k: int = 5) -> list[RetrievalHit]:
        query_vec = Counter(tokenize(query))
        hits: list[RetrievalHit] = []
        for doc in self.repository.list_documents(workspace_id):
            content = f"{doc['title']}\n{doc['content']}"
            score = cosine(query_vec, Counter(tokenize(content)))
            if score <= 0:
                continue
            excerpt = self._best_excerpt(doc["content"], query)
            hits.append(RetrievalHit(document_id=doc["id"], title=doc["title"], score=round(score, 4), excerpt=excerpt))
        return sorted(hits, key=lambda h: h.score, reverse=True)[:k]

    @staticmethod
    def _best_excerpt(content: str, query: str, max_chars: int = 320) -> str:
        query_terms = set(tokenize(query))
        sentences = re.split(r"(?<=[.!?])\s+", content)
        scored = []
        for sentence in sentences:
            score = len(set(tokenize(sentence)) & query_terms)
            scored.append((score, sentence))
        best = max(scored, key=lambda item: item[0])[1] if scored else content
        return best[:max_chars].strip()
