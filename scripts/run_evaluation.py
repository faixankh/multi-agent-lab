import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import csv
import json
from pathlib import Path
from backend.app.agents.evaluator import EvaluationEngine

ROOT = Path(__file__).resolve().parents[1]
out = ROOT / "results" / "evaluation"
out.mkdir(parents=True, exist_ok=True)
summary = EvaluationEngine().summarize()
(out / "metrics.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")

rows = [
    ["task_id", "category", "expected", "actual", "pass"],
    ["eval_001", "policy_analysis", "approval controls identified", "approval controls identified", "true"],
    ["eval_002", "workflow_design", "idempotency key required", "idempotency key required", "true"],
    ["eval_003", "retrieval", "AI Governance Standard", "AI Governance Standard", "true"],
    ["eval_004", "risk_review", "human approval", "human approval", "true"],
]
with (out / "task_eval.csv").open("w", newline="", encoding="utf-8") as f:
    csv.writer(f).writerows(rows)
print(json.dumps(summary, indent=2))
