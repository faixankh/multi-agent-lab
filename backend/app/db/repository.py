import json
import uuid
from datetime import datetime, timezone
from typing import Any
from backend.app.db.session import db_connection


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def new_id(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:14]}"


class Repository:
    def upsert_workspace(self, workspace_id: str, name: str, owner: str = "platform") -> dict[str, Any]:
        now = utc_now()
        with db_connection() as conn:
            conn.execute(
                "INSERT OR REPLACE INTO workspaces(id, name, owner, created_at) VALUES (?, ?, ?, COALESCE((SELECT created_at FROM workspaces WHERE id=?), ?))",
                (workspace_id, name, owner, workspace_id, now),
            )
        return {"id": workspace_id, "name": name, "owner": owner, "created_at": now}


    def list_workspaces(self) -> list[dict[str, Any]]:
        with db_connection() as conn:
            rows = conn.execute("SELECT * FROM workspaces ORDER BY created_at DESC").fetchall()
        return [dict(row) for row in rows]

    def add_document(self, workspace_id: str, title: str, content: str, metadata: dict[str, Any] | None = None) -> dict[str, Any]:
        doc_id = new_id("doc")
        now = utc_now()
        with db_connection() as conn:
            conn.execute(
                "INSERT INTO documents(id, workspace_id, title, content, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?)",
                (doc_id, workspace_id, title, content, json.dumps(metadata or {}), now),
            )
        return {"id": doc_id, "workspace_id": workspace_id, "title": title, "content": content, "metadata": metadata or {}, "created_at": now}

    def list_documents(self, workspace_id: str) -> list[dict[str, Any]]:
        with db_connection() as conn:
            rows = conn.execute("SELECT * FROM documents WHERE workspace_id=? ORDER BY created_at DESC", (workspace_id,)).fetchall()
        return [dict(row) | {"metadata": json.loads(row["metadata"])} for row in rows]

    def add_memory(self, workspace_id: str, kind: str, content: str, importance: float = 0.5) -> dict[str, Any]:
        memory_id = new_id("mem")
        now = utc_now()
        with db_connection() as conn:
            conn.execute(
                "INSERT INTO memories(id, workspace_id, kind, content, importance, created_at) VALUES (?, ?, ?, ?, ?, ?)",
                (memory_id, workspace_id, kind, content, importance, now),
            )
        return {"id": memory_id, "workspace_id": workspace_id, "kind": kind, "content": content, "importance": importance, "created_at": now}

    def list_memories(self, workspace_id: str) -> list[dict[str, Any]]:
        with db_connection() as conn:
            rows = conn.execute("SELECT * FROM memories WHERE workspace_id=? ORDER BY importance DESC, created_at DESC", (workspace_id,)).fetchall()
        return [dict(row) for row in rows]

    def create_task(self, workspace_id: str, request: str, approval_required: bool) -> dict[str, Any]:
        task_id = new_id("task")
        now = utc_now()
        with db_connection() as conn:
            conn.execute(
                "INSERT INTO tasks(id, workspace_id, request, status, result, approval_required, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (task_id, workspace_id, request, "created", "{}", int(approval_required), now, now),
            )
        return {"id": task_id, "workspace_id": workspace_id, "request": request, "status": "created", "approval_required": approval_required, "created_at": now, "updated_at": now}

    def update_task(self, task_id: str, status: str, result: dict[str, Any]) -> None:
        with db_connection() as conn:
            conn.execute("UPDATE tasks SET status=?, result=?, updated_at=? WHERE id=?", (status, json.dumps(result), utc_now(), task_id))


    def list_tasks(self, workspace_id: str, limit: int = 20) -> list[dict[str, Any]]:
        with db_connection() as conn:
            rows = conn.execute("SELECT * FROM tasks WHERE workspace_id=? ORDER BY created_at DESC LIMIT ?", (workspace_id, limit)).fetchall()
        items = []
        for row in rows:
            data = dict(row)
            data["result"] = json.loads(data["result"])
            data["approval_required"] = bool(data["approval_required"])
            items.append(data)
        return items

    def get_task(self, task_id: str) -> dict[str, Any] | None:
        with db_connection() as conn:
            row = conn.execute("SELECT * FROM tasks WHERE id=?", (task_id,)).fetchone()
        if not row:
            return None
        data = dict(row)
        data["result"] = json.loads(data["result"])
        data["approval_required"] = bool(data["approval_required"])
        return data

    def save_trace(self, task_id: str, workspace_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        trace_id = new_id("trace")
        now = utc_now()
        with db_connection() as conn:
            conn.execute("INSERT INTO traces(id, task_id, workspace_id, payload, created_at) VALUES (?, ?, ?, ?, ?)", (trace_id, task_id, workspace_id, json.dumps(payload), now))
        return {"id": trace_id, "task_id": task_id, "workspace_id": workspace_id, "payload": payload, "created_at": now}

    def get_trace(self, trace_id: str) -> dict[str, Any] | None:
        with db_connection() as conn:
            row = conn.execute("SELECT * FROM traces WHERE id=?", (trace_id,)).fetchone()
        if not row:
            return None
        data = dict(row)
        data["payload"] = json.loads(data["payload"])
        return data

    def list_traces(self, workspace_id: str, limit: int = 20) -> list[dict[str, Any]]:
        with db_connection() as conn:
            rows = conn.execute("SELECT * FROM traces WHERE workspace_id=? ORDER BY created_at DESC LIMIT ?", (workspace_id, limit)).fetchall()
        return [dict(row) | {"payload": json.loads(row["payload"])} for row in rows]

    def create_approval(self, task_id: str, workspace_id: str, summary: str) -> dict[str, Any]:
        approval_id = new_id("approval")
        now = utc_now()
        with db_connection() as conn:
            conn.execute("INSERT INTO approvals(id, task_id, workspace_id, status, summary, created_at, decided_at) VALUES (?, ?, ?, ?, ?, ?, NULL)", (approval_id, task_id, workspace_id, "pending", summary, now))
        return {"id": approval_id, "task_id": task_id, "workspace_id": workspace_id, "status": "pending", "summary": summary, "created_at": now}

    def decide_approval(self, approval_id: str, status: str) -> dict[str, Any] | None:
        now = utc_now()
        with db_connection() as conn:
            conn.execute("UPDATE approvals SET status=?, decided_at=? WHERE id=?", (status, now, approval_id))
            row = conn.execute("SELECT * FROM approvals WHERE id=?", (approval_id,)).fetchone()
        return dict(row) if row else None

    def list_approvals(self, workspace_id: str) -> list[dict[str, Any]]:
        with db_connection() as conn:
            rows = conn.execute("SELECT * FROM approvals WHERE workspace_id=? ORDER BY created_at DESC", (workspace_id,)).fetchall()
        return [dict(row) for row in rows]
