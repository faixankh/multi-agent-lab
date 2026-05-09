import type {
  Approval,
  DocumentItem,
  EvaluationSummary,
  RetrievalHit,
  TaskRunResult,
  TaskSummary,
  ToolItem,
  TraceItem,
  Workspace
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  baseUrl: API_BASE,

  health: () => request<{ status: string; service: string; version: string }>('/health'),

  createWorkspace: (payload: { id: string; name: string; owner?: string }) =>
    request<Workspace>('/api/v1/workspaces', { method: 'POST', body: JSON.stringify(payload) }),

  listWorkspaces: () => request<{ items: Workspace[] }>('/api/v1/workspaces'),

  ingestDocument: (payload: { workspace_id: string; title: string; content: string; metadata?: Record<string, unknown> }) =>
    request<DocumentItem>('/api/v1/documents/ingest', { method: 'POST', body: JSON.stringify(payload) }),

  listDocuments: (workspaceId: string) => request<{ items: DocumentItem[] }>(`/api/v1/documents/${workspaceId}`),

  searchDocuments: (payload: { workspace_id: string; query: string; k?: number }) =>
    request<{ items: RetrievalHit[]; count: number; workspace_id: string; query: string }>('/api/v1/documents/search', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  runTask: (payload: { workspace_id: string; request: string; approval_required: boolean }) =>
    request<TaskRunResult>('/api/v1/tasks/run', { method: 'POST', body: JSON.stringify(payload) }),

  listTasks: (workspaceId: string) => request<{ items: TaskSummary[] }>(`/api/v1/tasks?workspace_id=${encodeURIComponent(workspaceId)}`),

  listTraces: (workspaceId: string) => request<{ items: TraceItem[] }>(`/api/v1/traces?workspace_id=${encodeURIComponent(workspaceId)}`),

  getTrace: (traceId: string) => request<TraceItem>(`/api/v1/traces/${traceId}`),

  listApprovals: (workspaceId: string) => request<{ items: Approval[] }>(`/api/v1/approvals?workspace_id=${encodeURIComponent(workspaceId)}`),

  decideApproval: (approvalId: string, status: 'approved' | 'rejected') =>
    request<Approval>(`/api/v1/approvals/${approvalId}/decision`, { method: 'POST', body: JSON.stringify({ status }) }),

  listTools: () => request<{ items: ToolItem[] }>('/api/v1/tools'),

  callTool: (payload: { workspace_id: string; tool_name: string; arguments: Record<string, unknown> }) =>
    request<{ name: string; ok: boolean; output: Record<string, unknown>; error?: string }>('/api/v1/tools/call', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  evaluationSummary: () => request<EvaluationSummary>('/api/v1/evals/summary')
};

export function isApiError(error: unknown) {
  return error instanceof Error ? error.message : 'Unexpected error';
}
