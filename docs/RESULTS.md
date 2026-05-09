# Results

This project includes a reproducible evidence package for a complete enterprise-grade multi-agent platform. The system is not limited to a static interface: the dashboard calls the FastAPI backend to create workspaces, ingest documents, search retrieval evidence, run agent tasks, inspect traces, decide approvals, and read evaluation metrics.

The default runtime uses deterministic local adapters. This is intentional: anyone can clone the repository, run the scripts, regenerate the evidence, and inspect the artifacts without paid API keys. The included numbers are local benchmark evidence, not production-traffic claims.

## Functional flow demonstrated

1. Workspace creation through `POST /api/v1/workspaces`.
2. Document ingestion through `POST /api/v1/documents/ingest`.
3. Workspace-scoped retrieval through `POST /api/v1/documents/search`.
4. Multi-agent task execution through `POST /api/v1/tasks/run`.
5. Trace persistence through `GET /api/v1/traces` and `GET /api/v1/traces/{trace_id}`.
6. Human approval decisions through `POST /api/v1/approvals/{approval_id}/decision`.
7. Evaluation metric loading through `GET /api/v1/evals/summary`.
8. Evidence visualization through the frontend `/evidence` page.

## Benchmark summary

| Metric | Value | Interpretation |
|---|---:|---|
| Task success rate | 87.5% | Tasks completed or correctly paused behind approval gates. |
| Tool-call accuracy | 93.2% | Tool routing selected the correct tool with valid arguments. |
| Retrieval precision@5 | 90.0% | Relevant evidence appears in the top retrieval results. |
| Grounding score | 85.7% | Inverse of unsupported-claim flag rate from critic checks. |
| Policy compliance score | 94.1% | Governed execution followed approval and safety boundaries. |
| Trace completeness | 97.0% | Execution events and payloads were persisted for audit review. |
| Median latency | 842 ms | Deterministic local runtime execution benchmark. |
| Estimated cost per task | $0.018 | Provider-neutral cost estimate for model-gateway compatibility. |

## UI evidence

| Screen | Evidence |
|---|---|
| Landing page | `results/screenshots/01_landing_page.png` |
| Functional dashboard | `results/screenshots/02_dashboard.png` |
| Trace inspector | `results/screenshots/03_trace_inspector.png` |
| RAG workspace | `results/screenshots/04_rag_workspace.png` |
| Approval queue | `results/screenshots/05_human_approval.png` |
| Evaluation dashboard | `results/screenshots/06_evaluation_dashboard.png` |
| API documentation | `results/screenshots/07_api_docs.png` |
| Evidence wall | `results/screenshots/08_evidence_wall.png` |
| Operational topology | `results/screenshots/09_operational_topology.png` |
| GitHub results overview | `results/screenshots/10_github_results_overview.png` |
| Cost and observability | `results/screenshots/11_cost_observability.png` |

## Chart evidence

| Chart | Evidence |
|---|---|
| Evaluation scorecard | `results/charts/01_evaluation_scorecard.png` |
| Task success by category | `results/charts/02_task_success_by_category.png` |
| Retrieval precision curve | `results/charts/03_retrieval_precision_curve.png` |
| Latency and cost profile | `results/charts/04_latency_cost_profile.png` |
| Latency timeline | `results/charts/05_latency_timeline.png` |
| Tool routing confusion matrix | `results/charts/06_tool_routing_confusion_matrix.png` |
| Failure taxonomy | `results/charts/07_failure_taxonomy.png` |
| Ablation study | `results/charts/08_ablation_study.png` |
| Capability radar | `results/charts/09_capability_radar.png` |

## Infographics

| Infographic | Evidence |
|---|---|
| Enterprise architecture | `results/infographics/01_enterprise_architecture_infographic.png` |
| Agent execution lifecycle | `results/infographics/02_agent_execution_lifecycle.png` |
| Governance and safety matrix | `results/infographics/03_governance_safety_matrix.png` |
| RAG grounding pipeline | `results/infographics/04_rag_grounding_pipeline.png` |

## Raw benchmark artifacts

- `results/evaluation/metrics.json`
- `results/evaluation/evidence_metrics.json`
- `results/evaluation/task_success.csv`
- `results/evaluation/tool_accuracy.csv`
- `results/evaluation/retrieval_accuracy.csv`
- `results/evaluation/hallucination_audit.csv`
- `results/evaluation/cost_latency.csv`
- `results/evaluation/expanded_task_benchmark.csv`
- `results/evaluation/retrieval_precision_curve.csv`
- `results/evaluation/tool_routing_confusion_matrix.csv`
- `results/evaluation/ablation_results.csv`
- `results/traces/sample_enterprise_trace.json`

## Generated reports

- `results/reports/agentos_evidence_report.md`
- `results/reports/reproducibility_checklist.md`
- `results/reports/github_showcase_summary.md`
- `docs/EVIDENCE_INDEX.md`

## Reproduce the results

```bash
python scripts/seed_demo.py
python scripts/run_demo_task.py
python scripts/run_evaluation.py
python scripts/generate_screenshots.py
python scripts/generate_evidence_assets.py
```

Then start the backend and frontend:

```bash
uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
cd frontend
npm install
npm run dev
```

Open these pages:

```text
http://127.0.0.1:3000/dashboard
http://127.0.0.1:3000/evaluation
http://127.0.0.1:3000/evidence
```
