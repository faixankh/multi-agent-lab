from backend.app.agents.evaluator import EvaluationEngine
from backend.app.tools.calculator import CalculatorTool


def test_evaluator_contract_contains_required_metrics():
    summary = EvaluationEngine().summarize()
    required = {"task_success_rate", "tool_call_accuracy", "retrieval_precision_at_5", "hallucination_flag_rate"}
    assert required.issubset(summary)


def test_calculator_tool_safe_arithmetic():
    result = CalculatorTool().run(expression="2 + 3 * 4")
    assert result.ok is True
    assert result.output["value"] == 14
