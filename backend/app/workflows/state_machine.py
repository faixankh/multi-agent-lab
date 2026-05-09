from dataclasses import dataclass


@dataclass
class Transition:
    source: str
    event: str
    target: str


class TaskStateMachine:
    transitions = {
        ("created", "plan_ready"): "planned",
        ("planned", "execution_started"): "running",
        ("running", "approval_required"): "waiting_approval",
        ("waiting_approval", "approved"): "running",
        ("waiting_approval", "rejected"): "rejected",
        ("running", "review_passed"): "completed",
        ("running", "review_failed"): "failed",
    }

    def next_state(self, current: str, event: str) -> str:
        key = (current, event)
        if key not in self.transitions:
            raise ValueError(f"Invalid transition: {current} + {event}")
        return self.transitions[key]
