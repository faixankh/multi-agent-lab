from backend.app.agents.critic import CriticAgent
from backend.app.agents.executor import ExecutorAgent
from backend.app.agents.memory import MemoryManager
from backend.app.agents.planner import PlannerAgent
from backend.app.agents.rag import LocalRagRetriever
from backend.app.agents.schemas import AgentTraceEvent
from backend.app.core.config import get_settings
from backend.app.core.telemetry import emit_event
from backend.app.db.repository import Repository
from backend.app.tools.registry import ToolRegistry
from backend.app.agents.tool_router import ToolRouter


class AgentOrchestrator:
    def __init__(self, repository: Repository | None = None):
        self.repository = repository or Repository()
        self.settings = get_settings()
        self.retriever = LocalRagRetriever(self.repository)
        self.memory = MemoryManager(self.repository)
        self.planner = PlannerAgent(max_steps=self.settings.max_plan_steps)
        self.registry = ToolRegistry(self.retriever)
        self.router = ToolRouter(self.registry)
        self.executor = ExecutorAgent(self.router)
        self.critic = CriticAgent()

    def run(self, workspace_id: str, request: str, approval_required: bool = False) -> dict:
        task = self.repository.create_task(workspace_id, request, approval_required)
        trace: list[AgentTraceEvent] = []
        emit_event("task.created", task_id=task["id"], workspace_id=workspace_id)

        memories = self.memory.retrieve_relevant(workspace_id, request)
        trace.append(AgentTraceEvent("memory", "Relevant memory loaded", {"count": len(memories), "items": memories}))

        steps = self.planner.create_plan(request, approval_required=approval_required)
        trace.append(AgentTraceEvent("plan", "Execution plan created", {"steps": [step.__dict__ for step in steps]}))

        for step in steps:
            output = self.executor.execute_step(step, workspace_id, request, task["id"])
            trace.append(AgentTraceEvent("step", step.title, {"step": step.__dict__, "output": output}))

        critique = self.critic.review(request, steps)
        trace.append(AgentTraceEvent("critique", "Critic review completed", critique.__dict__))

        final_result = self._final_result(request, steps, critique)
        if approval_required:
            approval = self.repository.create_approval(task["id"], workspace_id, summary=final_result["executive_summary"])
            final_result["approval"] = approval
            status = "waiting_approval"
        else:
            status = "completed"

        self.memory.remember_request_pattern(workspace_id, request, final_result["executive_summary"])
        self.repository.update_task(task["id"], status, final_result)
        trace_payload = {
            "task": task,
            "status": status,
            "events": [event.__dict__ for event in trace],
            "final_result": final_result,
        }
        saved_trace = self.repository.save_trace(task["id"], workspace_id, trace_payload)
        final_result["trace_id"] = saved_trace["id"]
        self.repository.update_task(task["id"], status, final_result)
        emit_event("task.completed", task_id=task["id"], status=status, trace_id=saved_trace["id"])
        return {"task_id": task["id"], "status": status, "result": final_result, "trace_id": saved_trace["id"]}

    @staticmethod
    def _final_result(request, steps, critique) -> dict:
        evidence = []
        workflow_payloads = []
        for step in steps:
            tool_result = step.output.get("tool_result") or {}
            output = tool_result.get("output") or {}
            if "hits" in output:
                evidence.extend(output["hits"])
            if output.get("workflow_name"):
                workflow_payloads.append(output)
        return {
            "executive_summary": "The request was decomposed into a governed multi-agent workflow with retrieval, execution, review, and trace capture.",
            "request": request,
            "plan": [{"id": s.id, "title": s.title, "status": s.status, "agent": s.agent} for s in steps],
            "evidence": evidence[:5],
            "workflow_payloads": workflow_payloads,
            "risk_review": critique.__dict__,
            "recommended_next_actions": [
                "Review the approval gate if external workflow dispatch is enabled.",
                "Attach source documents to strengthen retrieval grounding.",
                "Run the evaluation suite after connecting production tools.",
            ],
        }
