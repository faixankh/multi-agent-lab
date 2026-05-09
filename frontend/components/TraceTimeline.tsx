import { StatusBadge } from './Shell';

const fallbackEvents = [
  ['Task accepted', 'Workspace request received by orchestrator.', 'completed'],
  ['Plan generated', 'Bounded planner steps created.', 'completed'],
  ['Knowledge retrieved', 'Workspace documents ranked by local RAG retriever.', 'completed'],
  ['Tools executed', 'Tool calls executed through governed router.', 'completed'],
  ['Approval gate', 'Controlled action paused when approval is required.', 'waiting_approval'],
  ['Critic review', 'Grounding and consistency review completed.', 'completed']
] as const;

export function TraceTimeline({ events }: { events?: Array<{ type?: string; title?: string; payload?: Record<string, unknown> }> }) {
  const rows = events?.length
    ? events.map((event) => [event.title || event.type || 'Trace event', JSON.stringify(event.payload || {}, null, 0).slice(0, 180), event.type || 'recorded'] as const)
    : fallbackEvents;

  return (
    <div className="space-y-3">
      {rows.map(([title, detail, status], index) => (
        <div key={`${title}-${index}`} className="flex gap-4 rounded-2xl border border-line bg-white p-4 shadow-card">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-slate-50 text-sm font-semibold text-brand">{index + 1}</div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-semibold text-ink">{title}</h3>
              <StatusBadge status={status} />
            </div>
            <p className="mt-1 break-words text-sm leading-6 text-muted">{detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
