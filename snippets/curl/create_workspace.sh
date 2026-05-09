#!/usr/bin/env bash
set -euo pipefail
curl -X POST http://127.0.0.1:8000/api/v1/workspaces   -H "Content-Type: application/json"   -d '{"id":"enterprise-demo","name":"Enterprise Demo Workspace","owner":"Faizan Ahmed Khan"}'
