from backend.app.agents.schemas import PlanStep, ToolResult


class ExecutorAgent:
    def __init__(self, tool_router):
        self.tool_router = tool_router

    def execute_step(self, step: PlanStep, workspace_id: str, request: str, task_id: str) -> dict:
        step.status = "running"
        selected_tool = step.tool_hint or self.tool_router.choose_tool(step.title, request)
        tool_result: ToolResult | None = None

        if selected_tool == "document_search":
            tool_result = self.tool_router.call("document_search", workspace_id=workspace_id, query=request, k=5)
        elif selected_tool == "workflow_dispatch":
            tool_result = self.tool_router.call("workflow_dispatch", workspace_id=workspace_id, request=request, task_id=task_id)
        elif selected_tool == "calculator":
            tool_result = self.tool_router.call("calculator", expression="1200 / 60")

        analysis = self._compose_analysis(step, request, tool_result)
        step.status = "completed" if not step.requires_approval else "waiting_approval"
        step.output = {
            "selected_tool": selected_tool,
            "tool_result": tool_result.__dict__ if tool_result else None,
            "analysis": analysis,
        }
        return step.output

    @staticmethod
    def _compose_analysis(step: PlanStep, request: str, tool_result: ToolResult | None) -> dict:
        evidence = []
        if tool_result and tool_result.ok and "hits" in tool_result.output:
            evidence = tool_result.output["hits"]
        return {
            "step": step.title,
            "objective": step.objective,
            "request_focus": request[:280],
            "evidence_count": len(evidence),
            "evidence": evidence,
            "decision": "continue" if not step.requires_approval else "requires_human_review",
        }
