from backend.app.agents.schemas import ToolResult
from backend.app.tools.base import Tool


class WorkflowDispatchTool(Tool):
    name = "workflow_dispatch"
    description = "Builds a structured workflow dispatch payload for n8n or another orchestrator."
    requires_approval = True

    def run(self, **kwargs):
        request = kwargs.get("request", "")
        payload = {
            "workflow_name": "agentos_enterprise_execution",
            "trigger": "manual_or_api",
            "states": [
                "validate_request",
                "retrieve_context",
                "execute_tools",
                "human_approval_if_required",
                "finalize_output",
                "write_trace",
            ],
            "request": request,
            "delivery": {"mode": "webhook", "idempotency_key": kwargs.get("task_id")},
        }
        return ToolResult(name=self.name, ok=True, output=payload)
