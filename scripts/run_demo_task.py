import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from backend.app.agents.orchestrator import AgentOrchestrator
from backend.app.db.repository import Repository

repo = Repository()
repo.upsert_workspace("enterprise-demo", "Enterprise Demo Workspace", "cli")
result = AgentOrchestrator(repo).run(
    "enterprise-demo",
    "Analyze the vendor onboarding policy, identify missing approval controls, draft a remediation checklist, and prepare a structured implementation plan.",
    approval_required=True,
)
print(result)
