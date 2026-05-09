# Benchmark Report

The benchmark validates the local deterministic agent runtime and the evaluation pipeline.

| Metric | Value |
|---|---:|
| Task success rate | 87.5% |
| Tool-call accuracy | 93.2% |
| Retrieval precision@5 | 90.0% |
| Hallucination flag rate | 14.3% |
| Median latency | 842 ms |
| Estimated cost per task | $0.018 |

## Interpretation

The system correctly plans, retrieves, routes tools, pauses risky workflow dispatches for approval, and writes complete traces. The hallucination flag metric is intentionally retained because the critic should surface unsupported claims rather than hiding them.
