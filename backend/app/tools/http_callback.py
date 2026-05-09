import httpx
from backend.app.core.config import get_settings
from backend.app.agents.schemas import ToolResult
from backend.app.tools.base import Tool


class HttpCallbackTool(Tool):
    name = "http_callback"
    description = "Calls an approved outbound HTTP endpoint. Disabled by default for safety."
    requires_approval = True

    def run(self, **kwargs):
        settings = get_settings()
        if not settings.allow_external_http:
            return ToolResult(name=self.name, ok=True, output={"mode": "dry_run", "reason": "External HTTP disabled", "payload": kwargs})
        url = kwargs.get("url")
        payload = kwargs.get("payload", {})
        try:
            response = httpx.post(url, json=payload, timeout=15)
            return ToolResult(name=self.name, ok=True, output={"status_code": response.status_code, "body": response.text[:1000]})
        except Exception as exc:
            return ToolResult(name=self.name, ok=False, output={}, error=str(exc))
