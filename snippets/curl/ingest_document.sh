#!/usr/bin/env bash
set -euo pipefail
curl -X POST http://127.0.0.1:8000/api/v1/documents/ingest   -H "Content-Type: application/json"   -d '{
    "workspace_id":"enterprise-demo",
    "title":"Vendor Onboarding Policy",
    "content":"Every vendor handling confidential data must pass security review before production access. Purchases above 5000 USD require department approval and finance approval.",
    "metadata":{"domain":"governance"}
  }'
