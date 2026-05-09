from backend.app.agents.schemas import ToolResult
from backend.app.tools.base import Tool


class DocumentSearchTool(Tool):
    name = "document_search"
    description = "Searches workspace documents through the RAG retriever."

    def __init__(self, retriever):
        self.retriever = retriever

    def run(self, **kwargs):
        workspace_id = kwargs["workspace_id"]
        query = kwargs["query"]
        hits = [hit.__dict__ for hit in self.retriever.search(workspace_id, query, k=kwargs.get("k", 5))]
        return ToolResult(name=self.name, ok=True, output={"hits": hits, "count": len(hits)})
