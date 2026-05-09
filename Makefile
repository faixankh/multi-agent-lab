.PHONY: install seed api frontend test eval docker screenshots evidence results clean

install:
	python -m pip install -r backend/requirements.txt

seed:
	python scripts/seed_demo.py

api:
	uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000

frontend:
	cd frontend && npm run dev

test:
	python -m pytest tests backend/tests -q

eval:
	python scripts/run_evaluation.py

screenshots:
	python scripts/generate_screenshots.py

evidence:
	python scripts/generate_evidence_assets.py

results:
	python scripts/run_evaluation.py
	python scripts/generate_screenshots.py
	python scripts/generate_evidence_assets.py

docker:
	docker compose up --build

clean:
	rm -rf .pytest_cache backend/.pytest_cache frontend/.next storage/agentos.db
