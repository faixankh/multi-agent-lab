'use client';

import { useEffect, useState } from 'react';
import { Loader2, RefreshCcw } from 'lucide-react';
import { api, isApiError } from '@/lib/api';
import type { TraceItem } from '@/lib/types';
import { EmptyState, Input, Panel, SecondaryButton, StatusBadge } from './Shell';
import { TraceTimeline } from './TraceTimeline';

export function TraceInspectorClient() {
  const [workspaceId, setWorkspaceId] = useState('enterprise-demo');
  const [traces, setTraces] = useState<TraceItem[]>([]);
  const [selected, setSelected] = useState<TraceItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const response = await api.listTraces(workspaceId);
      setTraces(response.items);
      setSelected(response.items[0] || null);
      setMessage(null);
    } catch (error) {
      setMessage(isApiError(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  const events = selected?.payload?.events as Array<{ type?: string; title?: string; payload?: Record<string, unknown> }> | undefined;
  const status = (selected?.payload?.status as string | undefined) || 'recorded';

  return (
    <div className="space-y-6">
      {message && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{message}</div>}
      <Panel title="Trace controls" description="Load traces from a workspace and inspect the persisted event stream.">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <Input value={workspaceId} onChange={(e) => setWorkspaceId(e.target.value)} placeholder="workspace id" />
          <SecondaryButton onClick={load} disabled={loading}>{loading ? <Loader2 className="mr-2 animate-spin" size={16} /> : <RefreshCcw className="mr-2" size={16} />}Refresh traces</SecondaryButton>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
        <Panel title="Trace list">
          {traces.length ? <div className="space-y-3">{traces.map((trace) => (
            <button key={trace.id} onClick={() => setSelected(trace)} className={`w-full rounded-2xl border p-4 text-left transition ${selected?.id === trace.id ? 'border-blue-300 bg-blue-50' : 'border-line bg-white hover:bg-slate-50'}`}>
              <div className="flex items-center justify-between gap-3"><span className="font-semibold text-ink">{trace.id}</span><StatusBadge status={(trace.payload?.status as string) || 'recorded'} /></div>
              <p className="mt-2 text-sm text-muted">Task: {trace.task_id}</p>
              <p className="mt-1 text-xs text-slate-400">{trace.created_at}</p>
            </button>
          ))}</div> : <EmptyState title="No traces yet" description="Run a task from the dashboard to generate an execution trace." icon="trace" />}
        </Panel>
        <Panel title="Execution timeline" description={selected ? `Selected trace ${selected.id}` : undefined}>
          <div className="mb-4"><StatusBadge status={status} /></div>
          <TraceTimeline events={events} />
        </Panel>
      </div>

      <Panel title="Structured trace payload">
        {selected ? <pre className="max-h-[680px] overflow-auto rounded-2xl border border-line bg-slate-950 p-4 text-xs leading-6 text-slate-100"><code>{JSON.stringify(selected.payload, null, 2)}</code></pre> : <EmptyState title="No trace selected" description="Select a trace from the list above." icon="trace" />}
      </Panel>
    </div>
  );
}
