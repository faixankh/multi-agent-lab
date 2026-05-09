from abc import ABC, abstractmethod
from typing import Any
from backend.app.agents.schemas import ToolResult


class Tool(ABC):
    name: str
    description: str
    requires_approval: bool = False

    @abstractmethod
    def run(self, **kwargs: Any) -> ToolResult:
        raise NotImplementedError
