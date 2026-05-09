from fastapi import Header, HTTPException, status
from backend.app.core.config import get_settings


async def optional_api_key(x_agentos_api_key: str | None = Header(default=None)) -> None:
    """Protect write endpoints when an API key is configured.

    Local development accepts missing credentials when the default key is still
    active. In production, set AGENTOS_API_KEY to a strong value and send it as
    X-AgentOS-API-Key.
    """

    settings = get_settings()
    if settings.env == "development" and settings.api_key == "change-me":
        return
    if x_agentos_api_key != settings.api_key:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API key")
