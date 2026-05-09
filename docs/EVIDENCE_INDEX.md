# Evidence Index

This repository includes a dedicated evidence package for GitHub review. The goal is to prove that the project includes working code, generated results, UI screenshots, charts, architecture visuals, evaluation records, and reproducibility scripts.

## Evidence philosophy

The default project runs through deterministic local adapters. This makes the repository easy to clone, run, test, and evaluate without paid API keys. The visual and numerical assets are therefore **local benchmark evidence**, not fabricated production-traffic claims.

## Recommended GitHub README images

| Purpose | File |
|---|---|
| Hero evidence wall | `results/screenshots/08_evidence_wall.png` |
| Functional dashboard | `results/screenshots/02_dashboard.png` |
| Enterprise architecture | `results/infographics/01_enterprise_architecture_infographic.png` |
| Evaluation scorecard | `results/charts/01_evaluation_scorecard.png` |
| Ablation evidence | `results/charts/08_ablation_study.png` |
| RAG grounding pipeline | `results/infographics/04_rag_grounding_pipeline.png` |

## Charts

| Chart | What it proves |
|---|---|
| `results/charts/01_evaluation_scorecard.png` | Core task, tool, retrieval, grounding, compliance, and trace scores. |
| `results/charts/02_task_success_by_category.png` | Success rate across policy, workflow, vendor, RAG, tool, and approval workloads. |
| `results/charts/03_retrieval_precision_curve.png` | Retrieval quality as top-k evidence increases. |
| `results/charts/04_latency_cost_profile.png` | Latency and estimated cost per task by workload type. |
| `results/charts/05_latency_timeline.png` | Runtime stability across repeated local runs. |
| `results/charts/06_tool_routing_confusion_matrix.png` | Tool router accuracy by expected and predicted tool. |
| `results/charts/07_failure_taxonomy.png` | Main failure/review classes found by the critic/evaluation harness. |
| `results/charts/08_ablation_study.png` | Contribution of RAG, critic, memory, and approval gate to task success. |
| `results/charts/09_capability_radar.png` | System-level coverage across planning, retrieval, tool use, governance, traceability, and cost control. |

## Infographics

| Infographic | What it explains |
|---|---|
| `results/infographics/01_enterprise_architecture_infographic.png` | Full enterprise architecture from dashboard to API, agents, tools, data, and evidence. |
| `results/infographics/02_agent_execution_lifecycle.png` | Request-to-evaluation lifecycle with governed states. |
| `results/infographics/03_governance_safety_matrix.png` | Safety, audit, approval, tool boundary, and deployment controls. |
| `results/infographics/04_rag_grounding_pipeline.png` | RAG evidence flow from ingestion to critic review. |

## Screenshots

| Screenshot | Purpose |
|---|---|
| `results/screenshots/01_landing_page.png` | Product landing page. |
| `results/screenshots/02_dashboard.png` | Functional multi-agent control plane. |
| `results/screenshots/03_trace_inspector.png` | Trace inspection UI. |
| `results/screenshots/04_rag_workspace.png` | Document ingestion and retrieval workspace. |
| `results/screenshots/05_human_approval.png` | Human approval gate. |
| `results/screenshots/06_evaluation_dashboard.png` | Evaluation dashboard. |
| `results/screenshots/07_api_docs.png` | OpenAPI documentation. |
| `results/screenshots/08_evidence_wall.png` | GitHub evidence overview. |
| `results/screenshots/09_operational_topology.png` | Deployment and runtime topology. |
| `results/screenshots/10_github_results_overview.png` | Metric summary view. |
| `results/screenshots/11_cost_observability.png` | Cost and observability proof. |

## Raw evidence

| File | Purpose |
|---|---|
| `results/evaluation/evidence_metrics.json` | Main evidence metrics in JSON form. |
| `results/evaluation/expanded_task_benchmark.csv` | Category-level task benchmark table. |
| `results/evaluation/retrieval_precision_curve.csv` | Retrieval precision values. |
| `results/evaluation/tool_routing_confusion_matrix.csv` | Raw tool-routing matrix. |
| `results/evaluation/ablation_results.csv` | Ablation study data. |
| `results/traces/sample_enterprise_trace.json` | Full agent trace with plan, evidence, tool result, review, approval, and final output. |

## Reports

| Report | Purpose |
|---|---|
| `results/reports/agentos_evidence_report.md` | Main results narrative. |
| `results/reports/reproducibility_checklist.md` | Commands and checklist before GitHub push. |
| `results/reports/github_showcase_summary.md` | Short summary for README/project description. |

## Regenerate everything

```bash
python scripts/seed_demo.py
python scripts/run_demo_task.py
python scripts/run_evaluation.py
python scripts/generate_screenshots.py
python scripts/generate_evidence_assets.py
```

## Frontend evidence page

The dashboard includes a dedicated evidence page:

```text
http://127.0.0.1:3000/evidence
```
