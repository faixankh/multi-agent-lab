from dataclasses import dataclass


@dataclass
class ModelResponse:
    text: str
    input_tokens: int
    output_tokens: int
    provider: str


class ModelGateway:
    """Provider-neutral boundary for future LLM integrations."""

    def complete(self, prompt: str, system: str = "") -> ModelResponse:
        text = self._deterministic_response(prompt, system)
        return ModelResponse(text=text, input_tokens=len(prompt.split()), output_tokens=len(text.split()), provider="deterministic")

    @staticmethod
    def _deterministic_response(prompt: str, system: str = "") -> str:
        lower = prompt.lower()
        if "risk" in lower or "approval" in lower:
            return "Use an approval gate, preserve trace evidence, and mark assumptions before execution."
        if "workflow" in lower:
            return "Validate input, retrieve context, execute approved tools, review output, then persist the trace."
        return "Create a structured answer with evidence, actions, constraints, and verification notes."
