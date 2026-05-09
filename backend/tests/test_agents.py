from backend.app.agents.planner import PlannerAgent
from backend.app.agents.rag import tokenize, cosine
from collections import Counter


def test_planner_creates_governed_steps():
    planner = PlannerAgent()
    steps = planner.create_plan("Analyze vendor policy and create approval workflow", approval_required=True)
    titles = [step.title for step in steps]
    assert "Retrieve governing knowledge" in titles
    assert any(step.requires_approval for step in steps)
    assert steps[-1].agent == "critic"


def test_retrieval_similarity_prefers_overlap():
    q = Counter(tokenize("vendor approval policy"))
    a = Counter(tokenize("vendor approval controls and policy"))
    b = Counter(tokenize("weather report and sports news"))
    assert cosine(q, a) > cosine(q, b)
