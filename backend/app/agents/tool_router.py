from backend.app.agents.schemas import ToolResult


class ToolRouter:
    def __init__(self, registry):
        self.registry = registry

    def call(self, name: str, **kwargs) -> ToolResult:
        tool = self.registry.get(name)
        return tool.run(**kwargs)

    def choose_tool(self, step_title: str, request: str) -> str | None:
        text = f"{step_title} {request}".lower()
        if any(term in text for term in ["retrieve", "document", "policy", "knowledge"]):
            return "document_search"
        if any(term in text for term in ["workflow", "automation", "orchestrator", "n8n"]):
            return "workflow_dispatch"
        if any(term in text for term in ["calculate", "cost", "token", "latency"]):
            return "calculator"
        return None
