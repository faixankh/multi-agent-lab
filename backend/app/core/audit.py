from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from typing import Any


@dataclass
class AuditRecord:
    event: str
    actor: str
    workspace_id: str
    resource_id: str
    decision: str
    metadata: dict[str, Any]
    timestamp: str


def audit(event: str, actor: str, workspace_id: str, resource_id: str, decision: str, **metadata: Any) -> dict[str, Any]:
    return asdict(AuditRecord(
        event=event,
        actor=actor,
        workspace_id=workspace_id,
        resource_id=resource_id,
        decision=decision,
        metadata=metadata,
        timestamp=datetime.now(timezone.utc).isoformat(),
    ))
