# Reproducibility Checklist

Use this checklist before pushing the repository to GitHub.

- [ ] Backend dependencies install with `pip install -r backend/requirements.txt`.
- [ ] Demo workspace is seeded with `python scripts/seed_demo.py`.
- [ ] Demo task runs with `python scripts/run_demo_task.py`.
- [ ] Evaluation metrics regenerate with `python scripts/run_evaluation.py`.
- [ ] Visual evidence regenerates with `python scripts/generate_evidence_assets.py`.
- [ ] Backend tests pass with `pytest backend/tests tests -q`.
- [ ] Frontend dependencies install with `cd frontend && npm install`.
- [ ] Frontend type check passes with `npx tsc --noEmit`.
- [ ] Dashboard opens at `http://127.0.0.1:3000/dashboard`.
- [ ] Evidence page opens at `http://127.0.0.1:3000/evidence`.
- [ ] README screenshots render on GitHub.
- [ ] `.env` secrets are not committed.

## Evidence philosophy

This repository separates three types of proof:

1. **Runtime proof**: API routes, tests, demo seed script, task execution script, and trace JSON.
2. **Evaluation proof**: CSV and JSON benchmark artifacts plus chart images.
3. **Presentation proof**: dashboard screenshots, infographics, architecture diagrams, and GitHub-ready reports.
