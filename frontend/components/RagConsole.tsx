'use client';

import { useEffect, useState } from 'react';
import { FilePlus2, Loader2, Search } from 'lucide-react';
import { api, isApiError } from '@/lib/api';
import type { DocumentItem, RetrievalHit } from '@/lib/types';
import { EmptyState, Input, Panel, PrimaryButton, SecondaryButton, TextArea } from './Shell';

export function RagConsole() {
  const [workspaceId, setWorkspaceId] = useState('enterprise-demo');
  const [title, setTitle] = useState('AI Governance Standard');
  const [content, setContent] = useState('AI systems must include traceability, user approval for high-impact actions, grounding evidence, and periodic evaluation against tool accuracy, retrieval precision, latency, and unsupported-claim rate.');
  const [query, setQuery] = useState('traceability approval grounding evidence evaluation');
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [hits, setHits] = useState<RetrievalHit[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function refresh() {
    try {
      const response = await api.listDocuments(workspaceId);
      setDocuments(response.items);
    } catch (error) {
      setMessage(isApiError(error));
    }
  }

  useEffect(() => { refresh(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  async function ingest() {
    setLoading('ingest');
    try {
      await api.createWorkspace({ id: workspaceId, name: workspaceId, owner: 'platform' });
      await api.ingestDocument({ workspace_id: workspaceId, title, content, metadata: { source: 'rag-console' } });
      setMessage('Document ingested successfully.');
      await refresh();
    } catch (error) {
      setMessage(isApiError(error));
    } finally {
      setLoading(null);
    }
  }

  async function search() {
    setLoading('search');
    try {
      const response = await api.searchDocuments({ workspace_id: workspaceId, query, k: 8 });
      setHits(response.items);
      setMessage(`${response.count} result(s) returned by the retriever.`);
    } catch (error) {
      setMessage(isApiError(error));
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      {message && <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">{message}</div>}
      <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <Panel title="Ingest document" description="Add workspace-specific documents that the agent can retrieve during planning and execution.">
          <div className="space-y-4">
            <label className="space-y-2 text-sm font-medium text-ink">Workspace ID<Input value={workspaceId} onChange={(e) => setWorkspaceId(e.target.value)} /></label>
            <label className="space-y-2 text-sm font-medium text-ink">Title<Input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
            <label className="space-y-2 text-sm font-medium text-ink">Content<TextArea rows={8} value={content} onChange={(e) => setContent(e.target.value)} /></label>
            <PrimaryButton onClick={ingest} disabled={!!loading}>{loading === 'ingest' ? <Loader2 className="mr-2 animate-spin" size={16} /> : <FilePlus2 className="mr-2" size={16} />}Ingest document</PrimaryButton>
          </div>
        </Panel>

        <Panel title="Search evidence" description="Query the local retrieval layer and inspect scored excerpts before running a task.">
          <div className="space-y-4">
            <label className="space-y-2 text-sm font-medium text-ink">Retrieval query<Input value={query} onChange={(e) => setQuery(e.target.value)} /></label>
            <SecondaryButton onClick={search} disabled={!!loading}>{loading === 'search' ? <Loader2 className="mr-2 animate-spin" size={16} /> : <Search className="mr-2" size={16} />}Search RAG index</SecondaryButton>
            <div className="space-y-3">
              {hits.length ? hits.map((hit) => (
                <div key={`${hit.document_id}-${hit.score}`} className="rounded-2xl border border-line bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3"><h3 className="font-semibold text-ink">{hit.title}</h3><span className="text-sm font-semibold text-brand">score {hit.score.toFixed(3)}</span></div>
                  <p className="mt-2 text-sm leading-6 text-muted">{hit.excerpt}</p>
                </div>
              )) : <EmptyState title="No retrieval results yet" description="Run a search after ingesting a document." />}
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Indexed documents" description="Documents currently stored in the selected workspace.">
        {documents.length ? <div className="grid gap-3 md:grid-cols-2">{documents.map((doc) => (
          <article key={doc.id} className="rounded-2xl border border-line bg-white p-4 shadow-card">
            <h3 className="font-semibold text-ink">{doc.title}</h3>
            <p className="mt-2 line-clamp-4 text-sm leading-6 text-muted">{doc.content}</p>
            <p className="mt-3 text-xs font-medium text-slate-400">{doc.id}</p>
          </article>
        ))}</div> : <EmptyState title="No indexed documents" description="Use the ingestion form above to create searchable knowledge." />}
      </Panel>
    </div>
  );
}
