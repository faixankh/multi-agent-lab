from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration.

    The defaults are safe for local development. Production deployments should
    override values through environment variables or a secrets manager.
    """

    model_config = SettingsConfigDict(env_prefix="AGENTOS_", env_file=".env", extra="ignore")

    env: str = "development"
    api_key: str = "change-me"
    database_url: str = "sqlite:///./storage/agentos.db"
    vector_backend: str = "local"
    llm_provider: str = "deterministic"
    object_storage: str = "local"
    n8n_webhook_url: str = "http://localhost:5678/webhook/agentos-execution"
    allow_external_http: bool = False
    max_plan_steps: int = 8
    default_workspace_id: str = "enterprise-demo"


@lru_cache
def get_settings() -> Settings:
    return Settings()
