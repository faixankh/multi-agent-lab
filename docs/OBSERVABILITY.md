# Observability

AgentOS emits structured events for task creation and completion. The trace store records every agent step, selected tool, retrieved evidence, approval state, and critic finding.

## Recommended production telemetry

- API latency histogram.
- Task status counter.
- Tool-call success and failure counter.
- Retrieval precision evaluation jobs.
- Approval queue age.
- Estimated cost per workspace.
- Hallucination flag rate by task category.

## Trace inspection fields

| Field | Purpose |
|---|---|
| task_id | Correlates API response, approvals, and trace payload. |
| workspace_id | Enforces tenant isolation. |
| events | Ordered execution history. |
| selected_tool | Shows why an external or internal tool was used. |
| evidence | Allows source-grounding review. |
| risk_review | Captures critic findings and recommended action. |
