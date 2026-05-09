import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from backend.app.db.repository import Repository

repo = Repository()
workspace_id = "enterprise-demo"
repo.upsert_workspace(workspace_id, "Enterprise Demo Workspace", "Faizan Ahmed Khan")

documents = [
    (
        "Vendor Onboarding Policy",
        "Every vendor handling confidential data must pass security review before production access. Purchases above 5000 USD require department approval and finance approval. High-risk integrations require legal review, data processing agreement verification, and a named business owner. Emergency exceptions expire after seven days and must be reviewed by the risk committee.",
        {"domain": "governance", "version": "2026.1"},
    ),
    (
        "AI Governance Standard",
        "AI systems that call external tools must keep execution traces, preserve source evidence, use human approval for irreversible operations, and run hallucination checks for policy-sensitive answers. Production deployments must include monitoring, rollback, and incident response ownership.",
        {"domain": "ai-risk", "version": "2026.1"},
    ),
    (
        "Workflow Automation Control Procedure",
        "Workflow dispatch must include an idempotency key, request owner, approved action summary, retry limit, failure owner, and audit log pointer. External callbacks are disabled by default until allow-listed by the platform owner.",
        {"domain": "automation", "version": "2026.1"},
    ),
]

for title, content, metadata in documents:
    repo.add_document(workspace_id, title, content, metadata)

repo.add_memory(workspace_id, "preference", "The workspace prefers approval-first automation for external workflow dispatch.", 0.9)
print(f"Seeded workspace: {workspace_id}")
