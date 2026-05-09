import json
import logging
from datetime import datetime, timezone
from typing import Any

logger = logging.getLogger("agentos")
logging.basicConfig(level=logging.INFO, format="%(message)s")


def emit_event(event: str, **payload: Any) -> None:
    record = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "event": event,
        **payload,
    }
    logger.info(json.dumps(record, default=str))
