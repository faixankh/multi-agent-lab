from pydantic import BaseModel, Field
from typing import Any


class WorkspaceCreate(BaseModel):
    id: str = Field(default="enterprise-demo", examples=["enterprise-demo"])
    name: str = Field(default="Enterprise Demo Workspace", examples=["Enterprise Demo Workspace"])
    owner: str = "platform"


class DocumentIngest(BaseModel):
    workspace_id: str = "enterprise-demo"
    title: str
    content: str
    metadata: dict[str, Any] = Field(default_factory=dict)


class DocumentSearch(BaseModel):
    workspace_id: str = "enterprise-demo"
    query: str
    k: int = Field(default=5, ge=1, le=20)


class TaskRun(BaseModel):
    workspace_id: str = "enterprise-demo"
    request: str
    approval_required: bool = False


class ToolCall(BaseModel):
    workspace_id: str = "enterprise-demo"
    tool_name: str
    arguments: dict[str, Any] = Field(default_factory=dict)


class ApprovalDecision(BaseModel):
    status: str = Field(pattern="^(approved|rejected)$")
