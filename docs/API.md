# API Reference

The API is implemented with FastAPI and exposes OpenAPI documentation at `/docs`.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Health check. |
| POST | `/api/v1/workspaces` | Create or update a workspace. |
| POST | `/api/v1/documents/ingest` | Add a document to a workspace. |
| GET | `/api/v1/documents/{workspace_id}` | List workspace documents. |
| POST | `/api/v1/tasks/run` | Execute a multi-agent task. |
| GET | `/api/v1/tasks/{task_id}` | Read a task result. |
| GET | `/api/v1/traces/{trace_id}` | Read a full trace payload. |
| GET | `/api/v1/traces` | List traces for a workspace. |
| GET | `/api/v1/tools` | List registered tools. |
| GET | `/api/v1/approvals` | List approval items. |
| POST | `/api/v1/approvals/{approval_id}/decision` | Approve or reject an action. |
| GET | `/api/v1/evals/summary` | Return evaluation metrics. |

## Example task request

```json
{
  "workspace_id": "enterprise-demo",
  "request": "Analyze the vendor onboarding policy, identify missing approval controls, draft a remediation checklist, and prepare a structured implementation plan.",
  "approval_required": true
}
```

## Output contract

```json
{
  "task_id": "task_xxx",
  "status": "waiting_approval",
  "trace_id": "trace_xxx",
  "result": {
    "executive_summary": "...",
    "plan": [],
    "evidence": [],
    "workflow_payloads": [],
    "risk_review": {},
    "recommended_next_actions": []
  }
}
```
