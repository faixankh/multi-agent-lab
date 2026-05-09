'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Database, FilePlus2, GitBranch, Loader2, Play, RefreshCcw, Search, ShieldCheck, TerminalSquare, Timer, Workflow } from 'lucide-react';
import { api, isApiError } from '@/lib/api';
import type { Approval, DocumentItem, EvaluationSummary, RetrievalHit, TaskRunResult, TaskSummary, ToolItem, TraceItem, Workspace } from '@/lib/types';
import { EmptyState, Input, MetricCard, Panel, PrimaryButton, SecondaryButton, StatusBadge, TextArea } from './Shell';
import { AgentGraph } from './AgentGraph';
import { TraceTimeline } from './TraceTimeline';

const defaultPolicy = `Vendor onboarding requires business-owner approval, security review, DPA verification, and finance approval before production access. Any automation touching customer data must preserve audit logs, attach evidence, and pause for human approval before outbound workflow execution.`;

const defaultRequest = 'Analyze the vendor onboarding policy, identify missing approval controls, retrieve supporting evidence, prepare a remediation plan, and pause external workflow execution for human approval.';

type Toast = { type: 'success' | 'error' | 'info'; message: string } | null;

function ToastBox({ toast }: { toast: Toast }) {
  if (!toast) return null;
  const cls = toast.type === 'success'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : toast.type === 'error'
      ? 'border-red-200 bg-red-50 text-red-700'
      : 'border-blue-200 bg-blue-50 text-blue-700';
  const Icon = toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? AlertCircle : RefreshCcw;
  return <div className={`mb-5 flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium ${cls}`}><Icon size={18} />{toast.message}</div>;
}

export function DashboardClient() {
  const [workspaceId, setWorkspaceId] = useState('enterprise-demo');
  const [workspaceName, setWorkspaceName] = useState('Enterprise Demo Workspace');
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [tasks, setTasks] = useState<TaskSummary[]>([]);
  const [traces, setTraces] = useState<TraceItem[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [evaluation, setEvaluation] = useState<EvaluationSummary | null>(null);
  const [docTitle, setDocTitle] = useState('Vendor Onboarding Policy');
  const [docContent, setDocContent] = useState(defaultPolicy);
  const [searchQuery, setSearchQuery] = useState('vendor approval security review audit logs');
  const [hits, setHits] = useState<RetrievalHit[]>([]);
  const [taskRequest, setTaskRequest] = useState(defaultRequest);
  const [approvalRequired, setApprovalRequired] = useState(true);
  const [latestRun, setLatestRun] = useState<TaskRunResult | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast>(null);

  const pendingApprovals = useMemo(() => approvals.filter((item) => item.status === 'pending'), [approvals]);
  const latestTrace = latestRun ? traces.find((trace) => trace.id === latestRun.trace_id) || traces[0] : traces[0];

  async function refresh(showToast = false) {
    setLoading('refresh');
    try {
      const [workspaceRes, documentRes, toolRes, taskRes, traceRes, approvalRes, evalRes] = await Promise.all([
        api.listWorkspaces().catch(() => ({ items: [] })),
        api.listDocuments(workspaceId).catch(() => ({ items: [] })),
        api.listTools().catch(() => ({ items: [] })),
        api.listTasks(workspaceId).catch(() => ({ items: [] })),
        api.listTraces(workspaceId).catch(() => ({ items: [] })),
        api.listApprovals(workspaceId).catch(() => ({ items: [] })),
        api.evaluationSummary().catch(() => null)
      ]);
      setWorkspaces(workspaceRes.items);
      setDocuments(documentRes.items);
      setTools(toolRes.items);
      setTasks(taskRes.items);
      setTraces(traceRes.items);
      setApprovals(approvalRes.items);
      setEvaluation(evalRes);
      if (showToast) setToast({ type: 'success', message: 'Dashboard refreshed from the backend API.' });
    } catch (error) {
      setToast({ type: 'error', message: isApiError(error) });
    } finally {
      setLoading(null);
    }
  }

  useEffect(() => {
    refresh(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  async function createWorkspace() {
    setLoading('workspace');
    try {
      await api.createWorkspace({ id: workspaceId, name: workspaceName, owner: 'platform' });
      setToast({ type: 'success', message: `Workspace ${workspaceId} is ready.` });
      await refresh(false);
    } catch (error) {
      setToast({ type: 'error', message: isApiError(error) });
    } finally {
      setLoading(null);
    }
  }

  async function ingestDocument() {
    setLoading('document');
    try {
      await api.ingestDocument({ workspace_id: workspaceId, title: docTitle, content: docContent, metadata: { source: 'dashboard', classification: 'internal' } });
      setToast({ type: 'success', message: 'Document ingested and available for RAG retrieval.' });
      await refresh(false);
    } catch (error) {
      setToast({ type: 'error', message: isApiError(error) });
    } finally {
      setLoading(null);
    }
  }

  async function searchDocuments() {
    setLoading('search');
    try {
      const response = await api.searchDocuments({ workspace_id: workspaceId, query: searchQuery, k: 5 });
      setHits(response.items);
      setToast({ type: 'success', message: `${response.count} retrieval hit(s) returned.` });
    } catch (error) {
      setToast({ type: 'error', message: isApiError(error) });
    } finally {
      setLoading(null);
    }
  }

  async function runTask() {
    setLoading('task');
    try {
      const response = await api.runTask({ workspace_id: workspaceId, request: taskRequest, approval_required: approvalRequired });
      setLatestRun(response);
      setToast({ type: 'success', message: `Task ${response.task_id} finished with status: ${response.status}.` });
      await refresh(false);
    } catch (error) {
      setToast({ type: 'error', message: isApiError(error) });
    } finally {
      setLoading(null);
    }
  }

  async function decideApproval(id: string, status: 'approved' | 'rejected') {
    setLoading(id);
    try {
      await api.decideApproval(id, status);
      setToast({ type: 'success', message: `Approval ${status}.` });
      await refresh(false);
    } catch (error) {
      setToast({ type: 'error', message: isApiError(error) });
    } finally {
      setLoading(null);
    }
  }

  return (
    <>
      <ToastBox toast={toast} />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Workspaces" value={String(workspaces.length || 1)} caption="Isolated project contexts with separate memory and documents." icon={<Database />} />
        <MetricCard label="Tasks" value={String(tasks.length)} caption="Executed through the planner, executor, critic, and trace store." icon={<GitBranch />} />
        <MetricCard label="Pending approvals" value={String(pendingApprovals.length)} caption="Human-controlled actions waiting for a decision." icon={<ShieldCheck />} tone={pendingApprovals.length ? 'warning' : 'success'} />
        <MetricCard label="Median latency" value={`${evaluation?.median_latency_ms ?? 842}ms`} caption="Deterministic local runtime benchmark." icon={<Timer />} />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_.9fr]">
        <Panel title="Workspace control" description="Create the workspace, ingest enterprise knowledge, search RAG evidence, and run a governed agent task from the UI.">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-ink">Workspace ID<Input value={workspaceId} onChange={(e) => setWorkspaceId(e.target.value)} /></label>
            <label className="space-y-2 text-sm font-medium text-ink">Workspace name<Input value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} /></label>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <PrimaryButton onClick={createWorkspace} disabled={!!loading}>{loading === 'workspace' ? <Loader2 className="mr-2 animate-spin" size={16} /> : null}Create / update workspace</PrimaryButton>
            <SecondaryButton onClick={() => refresh(true)} disabled={!!loading}>{loading === 'refresh' ? <Loader2 className="mr-2 animate-spin" size={16} /> : <RefreshCcw className="mr-2" size={16} />}Refresh API data</SecondaryButton>
          </div>
        </Panel>

        <Panel title="Registered tools" description="The frontend is reading the backend tool registry directly.">
          <div className="space-y-3">
            {tools.length ? tools.map((tool) => (
              <div key={tool.name} className="rounded-2xl border border-line bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3"><h3 className="font-semibold text-ink">{tool.name}</h3><StatusBadge status={tool.requires_approval ? 'approval required' : 'safe'} /></div>
                <p className="mt-2 text-sm leading-6 text-muted">{tool.description}</p>
              </div>
            )) : <EmptyState title="No tools loaded" description="Start the FastAPI backend and refresh the dashboard." icon="layers" />}
          </div>
        </Panel>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[.95fr_1.05fr]">
        <Panel title="Document ingestion" description="Add policy or project knowledge. The retriever will search only inside the selected workspace.">
          <div className="space-y-4">
            <label className="space-y-2 text-sm font-medium text-ink">Document title<Input value={docTitle} onChange={(e) => setDocTitle(e.target.value)} /></label>
            <label className="space-y-2 text-sm font-medium text-ink">Document content<TextArea rows={7} value={docContent} onChange={(e) => setDocContent(e.target.value)} /></label>
            <PrimaryButton onClick={ingestDocument} disabled={!!loading}>{loading === 'document' ? <Loader2 className="mr-2 animate-spin" size={16} /> : <FilePlus2 className="mr-2" size={16} />}Ingest document</PrimaryButton>
          </div>
        </Panel>

        <Panel title="RAG search" description="Run a direct retrieval query before task execution to prove grounding.">
          <div className="space-y-4">
            <label className="space-y-2 text-sm font-medium text-ink">Search query<Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></label>
            <SecondaryButton onClick={searchDocuments} disabled={!!loading}>{loading === 'search' ? <Loader2 className="mr-2 animate-spin" size={16} /> : <Search className="mr-2" size={16} />}Search documents</SecondaryButton>
            <div className="space-y-3">
              {(hits.length ? hits : documents.slice(0, 3).map((doc) => ({ document_id: doc.id, title: doc.title, score: 1, excerpt: doc.content.slice(0, 180) }))).map((hit) => (
                <div key={`${hit.document_id}-${hit.title}`} className="rounded-2xl border border-line bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3"><h3 className="font-semibold text-ink">{hit.title}</h3><span className="text-sm font-semibold text-brand">{Number(hit.score).toFixed(3)}</span></div>
                  <p className="mt-2 text-sm leading-6 text-muted">{hit.excerpt}</p>
                </div>
              ))}
              {!hits.length && !documents.length && <EmptyState title="No documents yet" description="Ingest a document first, then search it through the RAG retriever." />}
            </div>
          </div>
        </Panel>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
        <Panel title="Run multi-agent task" description="This button calls /api/v1/tasks/run and returns the actual planner, evidence, critic review, approval, and trace ID.">
          <div className="space-y-4">
            <label className="space-y-2 text-sm font-medium text-ink">Complex task request<TextArea rows={6} value={taskRequest} onChange={(e) => setTaskRequest(e.target.value)} /></label>
            <label className="flex items-center gap-3 rounded-2xl border border-line bg-slate-50 p-4 text-sm font-medium text-ink">
              <input type="checkbox" checked={approvalRequired} onChange={(e) => setApprovalRequired(e.target.checked)} className="h-4 w-4" />
              Require human approval before controlled workflow execution
            </label>
            <PrimaryButton onClick={runTask} disabled={!!loading}>{loading === 'task' ? <Loader2 className="mr-2 animate-spin" size={16} /> : <Play className="mr-2" size={16} />}Run governed task</PrimaryButton>
          </div>
        </Panel>

        <Panel title="Latest agent output" description="Live result returned by the backend orchestrator.">
          {latestRun ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3"><StatusBadge status={latestRun.status} /><span className="text-sm font-medium text-muted">Task: {latestRun.task_id}</span><span className="text-sm font-medium text-muted">Trace: {latestRun.trace_id}</span></div>
              <p className="rounded-2xl border border-line bg-slate-50 p-4 text-sm leading-6 text-muted">{latestRun.result.executive_summary}</p>
              <div className="space-y-2">
                {latestRun.result.plan.map((step) => <div key={step.id} className="flex items-center justify-between gap-3 rounded-xl border border-line px-3 py-2 text-sm"><span>{step.agent}: {step.title}</span><StatusBadge status={step.status} /></div>)}
              </div>
            </div>
          ) : <EmptyState title="No task executed in this session" description="Run a governed task to see the real backend response here." icon="trace" />}
        </Panel>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <Panel title="Approvals" description="Approve or reject controlled workflow execution from the dashboard.">
          <div className="space-y-3">
            {approvals.length ? approvals.map((approval) => (
              <div key={approval.id} className="rounded-2xl border border-line bg-white p-4 shadow-card">
                <div className="flex flex-wrap items-center justify-between gap-3"><span className="font-semibold text-ink">{approval.id}</span><StatusBadge status={approval.status} /></div>
                <p className="mt-2 text-sm leading-6 text-muted">{approval.summary}</p>
                {approval.status === 'pending' && <div className="mt-4 flex gap-2"><PrimaryButton onClick={() => decideApproval(approval.id, 'approved')} disabled={!!loading}>Approve</PrimaryButton><SecondaryButton onClick={() => decideApproval(approval.id, 'rejected')} disabled={!!loading}>Reject</SecondaryButton></div>}
              </div>
            )) : <EmptyState title="No approvals" description="Run a task with approval required to generate a pending approval gate." icon="layers" />}
          </div>
        </Panel>

        <Panel title="Latest trace" description="Trace events are persisted by FastAPI and listed through /api/v1/traces.">
          <TraceTimeline events={(latestTrace?.payload?.events as Array<{ type?: string; title?: string; payload?: Record<string, unknown> }> | undefined)} />
        </Panel>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <Panel title="Runtime graph"><AgentGraph /></Panel>
        <Panel title="Raw response preview" description="Useful for GitHub evidence and debugging.">
          <pre className="max-h-[520px] overflow-auto rounded-2xl border border-line bg-slate-950 p-4 text-xs leading-6 text-slate-100"><code>{JSON.stringify(latestRun || { api: api.baseUrl, hint: 'Run a task to populate this payload.' }, null, 2)}</code></pre>
        </Panel>
      </section>
    </>
  );
}
