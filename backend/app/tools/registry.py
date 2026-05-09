from backend.app.tools.calculator import CalculatorTool
from backend.app.tools.document_search import DocumentSearchTool
from backend.app.tools.workflow_dispatch import WorkflowDispatchTool
from backend.app.tools.http_callback import HttpCallbackTool


class ToolRegistry:
    def __init__(self, retriever):
        self.tools = {
            "calculator": CalculatorTool(),
            "document_search": DocumentSearchTool(retriever),
            "workflow_dispatch": WorkflowDispatchTool(),
            "http_callback": HttpCallbackTool(),
        }

    def get(self, name: str):
        if name not in self.tools:
            raise KeyError(f"Tool not registered: {name}")
        return self.tools[name]

    def list_tools(self) -> list[dict]:
        return [
            {"name": tool.name, "description": tool.description, "requires_approval": tool.requires_approval}
            for tool in self.tools.values()
        ]
