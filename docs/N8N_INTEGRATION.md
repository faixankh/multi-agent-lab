# n8n Integration

The repository includes an importable n8n workflow:

```text
automation/n8n/agentos_enterprise_workflow.json
```

## Purpose

The AgentOS backend can prepare a workflow dispatch payload. The n8n workflow receives that payload, validates the idempotency key, and returns an accepted or rejected response.

## Recommended production pattern

- Keep AgentOS as the decision and governance layer.
- Keep n8n as the workflow execution layer.
- Require approval before any irreversible external operation.
- Store `task_id` as the idempotency key.
- Write the n8n execution URL back into the AgentOS trace.
