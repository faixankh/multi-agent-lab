# AgentOS Evidence Report

This folder is the evidence package for the repository. It is intentionally designed for GitHub reviewers, recruiters, and admissions committees who need to see proof that the project is more than a static interface.

## Evidence type

The included numbers are deterministic local benchmark outputs generated from the repository scripts. They do **not** claim paid production traffic. They prove that the project has a reproducible evaluation harness, trace schema, UI evidence, and deployment-ready architecture.

## Core metrics

| Metric | Value | Evidence file |
|---|---:|---|
| Task success rate | 87.5% | `results/charts/01_evaluation_scorecard.png`, `results/evaluation/expanded_task_benchmark.csv` |
| Tool-call accuracy | 93.2% | `results/charts/06_tool_routing_confusion_matrix.png`, `results/evaluation/tool_routing_confusion_matrix.csv` |
| Retrieval precision@5 | 90.0% | `results/charts/03_retrieval_precision_curve.png`, `results/evaluation/retrieval_precision_curve.csv` |
| Grounding score | 85.7% | `results/charts/07_failure_taxonomy.png`, `results/evaluation/hallucination_audit.csv` |
| Median latency | 842 ms | `results/charts/04_latency_cost_profile.png`, `results/charts/05_latency_timeline.png` |
| Estimated cost per task | $0.018 | `results/evaluation/evidence_metrics.json` |
| Trace completeness | 97.0% | `results/traces/sample_enterprise_trace.json` |

## Visual evidence added

### Charts

- `results/charts/01_evaluation_scorecard.png`
- `results/charts/02_task_success_by_category.png`
- `results/charts/03_retrieval_precision_curve.png`
- `results/charts/04_latency_cost_profile.png`
- `results/charts/05_latency_timeline.png`
- `results/charts/06_tool_routing_confusion_matrix.png`
- `results/charts/07_failure_taxonomy.png`
- `results/charts/08_ablation_study.png`
- `results/charts/09_capability_radar.png`

### Infographics

- `results/infographics/01_enterprise_architecture_infographic.png`
- `results/infographics/02_agent_execution_lifecycle.png`
- `results/infographics/03_governance_safety_matrix.png`
- `results/infographics/04_rag_grounding_pipeline.png`

### Screenshots

- `results/screenshots/01_landing_page.png`
- `results/screenshots/02_dashboard.png`
- `results/screenshots/03_trace_inspector.png`
- `results/screenshots/04_rag_workspace.png`
- `results/screenshots/05_human_approval.png`
- `results/screenshots/06_evaluation_dashboard.png`
- `results/screenshots/07_api_docs.png`
- `results/screenshots/08_evidence_wall.png`
- `results/screenshots/09_operational_topology.png`
- `results/screenshots/10_github_results_overview.png`
- `results/screenshots/11_cost_observability.png`

## Reproduce

```bash
python scripts/seed_demo.py
python scripts/run_demo_task.py
python scripts/run_evaluation.py
python scripts/generate_screenshots.py
python scripts/generate_evidence_assets.py
```

The frontend also includes a dedicated `/evidence` page that displays key artifacts from `frontend/public/evidence/`.
