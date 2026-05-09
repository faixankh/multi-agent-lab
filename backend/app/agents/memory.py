from backend.app.agents.rag import tokenize


class MemoryManager:
    def __init__(self, repository):
        self.repository = repository

    def remember_request_pattern(self, workspace_id: str, request: str, result_summary: str) -> dict:
        importance = 0.75 if any(term in request.lower() for term in ["policy", "approval", "risk", "vendor", "audit"]) else 0.45
        content = f"Request: {request}\nOutcome: {result_summary}"
        return self.repository.add_memory(workspace_id, kind="episodic", content=content, importance=importance)

    def retrieve_relevant(self, workspace_id: str, request: str, limit: int = 4) -> list[dict]:
        query_terms = set(tokenize(request))
        memories = self.repository.list_memories(workspace_id)
        ranked = []
        for memory in memories:
            overlap = len(query_terms & set(tokenize(memory["content"])))
            score = overlap + float(memory["importance"])
            ranked.append((score, memory))
        return [m for _, m in sorted(ranked, key=lambda item: item[0], reverse=True)[:limit]]
