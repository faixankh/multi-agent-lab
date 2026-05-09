# Deployment

## Docker Compose

```bash
docker compose up --build
```

## Production deployment checklist

1. Create production `.env` from `snippets/env/production.env.example`.
2. Configure a domain and reverse proxy with TLS.
3. Replace SQLite with PostgreSQL for multi-user deployment.
4. Replace local vector retrieval with Qdrant, FAISS, Chroma, or pgvector.
5. Set `AGENTOS_ALLOW_EXTERNAL_HTTP=false` until outbound domains are approved.
6. Configure CI/CD environment secrets.
7. Run backend and frontend builds in GitHub Actions.
8. Configure log forwarding and backups.

## NGINX

Use `deployment/nginx/agentos.conf` as a base reverse-proxy configuration.

## Kubernetes

Use `deployment/kubernetes/agentos-api.yaml` as a minimal API deployment starting point.
