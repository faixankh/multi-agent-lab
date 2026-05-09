from dataclasses import dataclass, field
from typing import Any, Literal

StepStatus = Literal["pending", "running", "completed", "failed", "waiting_approval"]


@dataclass
class PlanStep:
    id: str
    title: str
    objective: str
    agent: str
    tool_hint: str | None = None
    requires_approval: bool = False
    status: StepStatus = "pending"
    output: dict[str, Any] = field(default_factory=dict)


@dataclass
class RetrievalHit:
    document_id: str
    title: str
    score: float
    excerpt: str


@dataclass
class ToolResult:
    name: str
    ok: bool
    output: dict[str, Any]
    error: str | None = None


@dataclass
class Critique:
    pass_review: bool
    risk_level: str
    findings: list[str]
    recommended_action: str


@dataclass
class AgentTraceEvent:
    type: str
    title: str
    payload: dict[str, Any]
