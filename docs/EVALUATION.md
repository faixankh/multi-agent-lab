# Evaluation Design

AgentOS evaluates the system as an agentic workflow, not only as text generation.

## Metrics

| Metric | Definition |
|---|---|
| Task success rate | Fraction of tasks completed or correctly paused for approval. |
| Tool-call accuracy | Correct tool selected with valid arguments. |
| Retrieval precision@5 | Relevant source evidence appears in the top five retrieval hits. |
| Hallucination flag rate | Share of tasks where critic detects unsupported claims. |
| Median latency | Median end-to-end runtime in deterministic local evaluation. |
| Estimated cost per task | Configurable cost estimate based on model/tool token usage. |

## Reproducible local benchmark

Run:

```bash
python scripts/run_evaluation.py
```

Outputs are saved to:

```text
results/evaluation/
```

The included benchmark is deterministic and intentionally local. It proves the evaluation infrastructure. For a public production claim, replace fixtures with real enterprise tasks, real documents, and blinded labels.
