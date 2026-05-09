# Database Schema

The default repository uses SQLite for local execution. The repository boundary is intentionally small so PostgreSQL can be introduced with minimal changes.

## Tables

| Table | Purpose |
|---|---|
| workspaces | Tenant/project boundary. |
| documents | Source material for RAG. |
| memories | Episodic and preference memory. |
| tasks | User requests and final result status. |
| traces | Full execution trace payload. |
| approvals | Human approval records. |

## Production migration guidance

- Use PostgreSQL for concurrent users.
- Add foreign keys and indexes on `workspace_id`, `task_id`, and `created_at`.
- Encrypt sensitive document payloads at rest.
- Move large objects into S3/GCS/Azure Blob and store object URIs.
