import re
from backend.app.agents.schemas import PlanStep


class PlannerAgent:
    """Creates a bounded, auditable execution plan from a complex request."""

    def __init__(self, max_steps: int = 8):
        self.max_steps = max_steps

    def create_plan(self, request: str, approval_required: bool = False) -> list[PlanStep]:
        normalized = request.strip()
        intents = self._infer_intents(normalized)
        steps: list[PlanStep] = []

        if "retrieve" in intents or "policy" in intents or "document" in intents:
            steps.append(PlanStep("step_01", "Retrieve governing knowledge", "Find policies, standards, and prior decisions that ground the response.", "rag_retriever", "document_search"))

        steps.append(PlanStep("step_02", "Decompose operating objective", "Convert the user request into structured requirements, constraints, and risks.", "planner", None))

        if "workflow" in intents or "automation" in intents or "implementation" in intents:
            steps.append(PlanStep("step_03", "Design workflow sequence", "Map the required process into clear execution states, tool calls, and fallback paths.", "executor", "workflow_dispatch"))
        else:
            steps.append(PlanStep("step_03", "Execute analysis", "Produce the main analysis using retrieved context and memory.", "executor", "analysis_engine"))

        if "risk" in intents or "approval" in intents or approval_required:
            steps.append(PlanStep("step_04", "Run approval and risk review", "Identify governance, security, and compliance risks before finalization.", "critic", None, requires_approval=approval_required))

        steps.append(PlanStep("step_05", "Generate final structured output", "Return a concise result with actions, evidence, assumptions, and next controls.", "executor", None))
        steps.append(PlanStep("step_06", "Critique and verify output", "Check grounding, tool consistency, unresolved assumptions, and hallucination risk.", "critic", None))
        return steps[: self.max_steps]

    @staticmethod
    def _infer_intents(request: str) -> set[str]:
        terms = set(re.findall(r"[a-zA-Z]+", request.lower()))
        intents = set()
        mapping = {
            "policy": {"policy", "document", "vendor", "contract", "sop"},
            "retrieve": {"retrieve", "find", "search", "evidence"},
            "document": {"document", "file", "knowledge", "manual"},
            "workflow": {"workflow", "process", "sequence", "pipeline"},
            "automation": {"automation", "automate", "n8n", "orchestration"},
            "implementation": {"implementation", "plan", "checklist", "roadmap"},
            "risk": {"risk", "security", "governance", "audit", "compliance"},
            "approval": {"approval", "human", "review", "gate"},
        }
        for intent, keywords in mapping.items():
            if terms & keywords:
                intents.add(intent)
        return intents
