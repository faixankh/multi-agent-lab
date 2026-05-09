import ast
import operator as op
from backend.app.agents.schemas import ToolResult
from backend.app.tools.base import Tool

_ALLOWED = {
    ast.Add: op.add,
    ast.Sub: op.sub,
    ast.Mult: op.mul,
    ast.Div: op.truediv,
    ast.Pow: op.pow,
    ast.USub: op.neg,
}


def _eval(node):
    if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
        return node.value
    if isinstance(node, ast.BinOp) and type(node.op) in _ALLOWED:
        return _ALLOWED[type(node.op)](_eval(node.left), _eval(node.right))
    if isinstance(node, ast.UnaryOp) and type(node.op) in _ALLOWED:
        return _ALLOWED[type(node.op)](_eval(node.operand))
    raise ValueError("Unsupported expression")


class CalculatorTool(Tool):
    name = "calculator"
    description = "Safely evaluates arithmetic expressions."

    def run(self, **kwargs):
        expression = kwargs.get("expression", "0")
        try:
            value = _eval(ast.parse(expression, mode="eval").body)
            return ToolResult(name=self.name, ok=True, output={"expression": expression, "value": value})
        except Exception as exc:
            return ToolResult(name=self.name, ok=False, output={}, error=str(exc))
