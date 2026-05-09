from backend.app.agents.schemas import Critique, PlanStep


class CriticAgent:
    def review(self, request: str, steps: list[PlanStep]) -> Critique:
        findings: list[str] = []
        retrieval_steps = [s for s in steps if s.output.get("selected_tool") == "document_search"]
        if retrieval_steps:
            total_hits = sum((s.output.get("tool_result") or {}).get("output", {}).get("count", 0) for s in retrieval_steps)
            if total_hits == 0:
                findings.append("No retrieval evidence was found; final output must label assumptions clearly.")
        if any(s.status == "failed" for s in steps):
            findings.append("At least one execution step failed and must be retried or escalated.")
        if any(s.requires_approval for s in steps):
            findings.append("Human approval gate is active because the request touches governance or external workflow execution.")
        if not findings:
            findings.append("Execution trace is internally consistent and suitable for finalization.")
        risk_level = "medium" if any("approval" in f.lower() or "no retrieval" in f.lower() for f in findings) else "low"
        return Critique(
            pass_review=risk_level in {"low", "medium"},
            risk_level=risk_level,
            findings=findings,
            recommended_action="finalize_with_trace" if risk_level != "high" else "escalate",
        )
