from fastapi import APIRouter, Depends, HTTPException
from backend.app.api.schemas import ApprovalDecision, DocumentIngest, DocumentSearch, TaskRun, ToolCall, WorkspaceCreate
from backend.app.agents.evaluator import EvaluationEngine
from backend.app.agents.orchestrator import AgentOrchestrator
from backend.app.agents.rag import LocalRagRetriever
from backend.app.core.security import optional_api_key
from backend.app.db.repository import Repository
from backend.app.tools.registry import ToolRegistry

router = APIRouter(prefix="/api/v1")
repo = Repository()


@router.post("/workspaces", dependencies=[Depends(optional_api_key)])
def create_workspace(payload: WorkspaceCreate):
    return repo.upsert_workspace(payload.id, payload.name, payload.owner)


@router.get("/workspaces")
def list_workspaces():
    return {"items": repo.list_workspaces()}


@router.post("/documents/ingest", dependencies=[Depends(optional_api_key)])
def ingest_document(payload: DocumentIngest):
    repo.upsert_workspace(payload.workspace_id, payload.workspace_id, "platform")
    return repo.add_document(payload.workspace_id, payload.title, payload.content, payload.metadata)


@router.get("/documents/{workspace_id}")
def list_documents(workspace_id: str):
    return {"items": repo.list_documents(workspace_id)}


@router.post("/documents/search")
def search_documents(payload: DocumentSearch):
    retriever = LocalRagRetriever(repo)
    hits = [hit.__dict__ for hit in retriever.search(payload.workspace_id, payload.query, payload.k)]
    return {"items": hits, "count": len(hits), "workspace_id": payload.workspace_id, "query": payload.query}


@router.post("/tasks/run", dependencies=[Depends(optional_api_key)])
def run_task(payload: TaskRun):
    repo.upsert_workspace(payload.workspace_id, payload.workspace_id, "platform")
    orchestrator = AgentOrchestrator(repo)
    return orchestrator.run(payload.workspace_id, payload.request, payload.approval_required)


@router.get("/tasks")
def list_tasks(workspace_id: str = "enterprise-demo", limit: int = 20):
    return {"items": repo.list_tasks(workspace_id, limit)}


@router.get("/tasks/{task_id}")
def get_task(task_id: str):
    task = repo.get_task(task_id)
    if not task:
        raise HTTPException(404, "Task not found")
    return task


@router.get("/traces/{trace_id}")
def get_trace(trace_id: str):
    trace = repo.get_trace(trace_id)
    if not trace:
        raise HTTPException(404, "Trace not found")
    return trace


@router.get("/traces")
def list_traces(workspace_id: str = "enterprise-demo", limit: int = 20):
    return {"items": repo.list_traces(workspace_id, limit)}


@router.get("/tools")
def list_tools():
    orchestrator = AgentOrchestrator(repo)
    return {"items": orchestrator.registry.list_tools()}


@router.post("/tools/call", dependencies=[Depends(optional_api_key)])
def call_tool(payload: ToolCall):
    repo.upsert_workspace(payload.workspace_id, payload.workspace_id, "platform")
    registry = ToolRegistry(LocalRagRetriever(repo))
    try:
        tool = registry.get(payload.tool_name)
    except KeyError:
        raise HTTPException(404, "Tool not found")
    args = dict(payload.arguments)
    args.setdefault("workspace_id", payload.workspace_id)
    result = tool.run(**args)
    return result.__dict__


@router.get("/approvals")
def list_approvals(workspace_id: str = "enterprise-demo"):
    return {"items": repo.list_approvals(workspace_id)}


@router.post("/approvals/{approval_id}/decision", dependencies=[Depends(optional_api_key)])
def decide_approval(approval_id: str, payload: ApprovalDecision):
    approval = repo.decide_approval(approval_id, payload.status)
    if not approval:
        raise HTTPException(404, "Approval not found")
    return approval


@router.get("/evals/summary")
def evaluation_summary():
    return EvaluationEngine().summarize()
