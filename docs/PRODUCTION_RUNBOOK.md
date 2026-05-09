# Production Runbook

## Daily checks

- Confirm `/health` returns healthy.
- Review task failure rate and approval queue age.
- Inspect traces with high hallucination risk.
- Verify backup completion for database and object storage.
- Review outbound tool-call logs for unexpected destinations.

## Incident response

1. Disable external HTTP by setting `AGENTOS_ALLOW_EXTERNAL_HTTP=false`.
2. Pause workflow dispatch in n8n.
3. Export affected task traces from `/api/v1/traces`.
4. Review approval records and tool payloads.
5. Patch the tool registry or policy rules.
6. Re-run evaluation before re-enabling automation.

## Release process

- Run `pytest backend/tests tests -q`.
- Run `python scripts/run_evaluation.py`.
- Build Docker images.
- Deploy API first, dashboard second.
- Validate one governed task with approval required.
