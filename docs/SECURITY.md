# Security and Governance

This project includes practical security controls suitable for a portfolio-grade enterprise AI system.

## Included controls

- API key guard for write endpoints.
- Workspace isolation for documents, traces, and memory.
- Human approval gate for external workflow dispatch.
- Outbound HTTP disabled by default.
- Tool registry boundary instead of arbitrary tool execution.
- Structured traces for audit review.
- Critic agent checks for missing retrieval evidence and governance risk.
- Environment-based configuration.

## Production hardening checklist

- Store API keys in a cloud secret manager.
- Replace wildcard CORS with approved domains.
- Move SQLite to PostgreSQL with backups and migration management.
- Enable tenant-level authorization and RBAC.
- Put the API behind NGINX or a cloud load balancer.
- Use signed URLs for object storage files.
- Add rate limits and request body size limits.
- Add SIEM forwarding for traces and security events.
- Use allow-listed external tool domains only.
