#!/usr/bin/env bash
set -euo pipefail
curl -X POST http://127.0.0.1:8000/api/v1/tasks/run   -H "Content-Type: application/json"   -d '{
    "workspace_id":"enterprise-demo",
    "request":"Analyze the vendor onboarding policy, identify missing approval controls, draft a remediation checklist, and prepare a structured implementation plan.",
    "approval_required":true
  }'
