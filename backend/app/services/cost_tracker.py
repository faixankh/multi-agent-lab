from dataclasses import dataclass


@dataclass
class CostEvent:
    provider: str
    input_tokens: int
    output_tokens: int
    tool_calls: int


class CostTracker:
    def __init__(self, input_rate_per_1k: float = 0.0015, output_rate_per_1k: float = 0.0020, tool_call_cost: float = 0.0005):
        self.input_rate_per_1k = input_rate_per_1k
        self.output_rate_per_1k = output_rate_per_1k
        self.tool_call_cost = tool_call_cost

    def estimate(self, event: CostEvent) -> dict:
        model_cost = (event.input_tokens / 1000 * self.input_rate_per_1k) + (event.output_tokens / 1000 * self.output_rate_per_1k)
        tool_cost = event.tool_calls * self.tool_call_cost
        return {
            "provider": event.provider,
            "input_tokens": event.input_tokens,
            "output_tokens": event.output_tokens,
            "tool_calls": event.tool_calls,
            "estimated_usd": round(model_cost + tool_cost, 6),
        }
