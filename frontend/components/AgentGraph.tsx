import { BrainCircuit, CheckCircle2, Database, GitBranch, Network, Route, Search, ShieldCheck } from 'lucide-react';

const nodes = [
  { name: 'Planner', detail: 'Task decomposition', icon: BrainCircuit },
  { name: 'Memory', detail: 'Relevant history', icon: Database },
  { name: 'Retriever', detail: 'Grounded evidence', icon: Search },
  { name: 'Tool Router', detail: 'API/tool choice', icon: Route },
  { name: 'Executor', detail: 'Structured action', icon: Network },
  { name: 'Critic', detail: 'Risk review', icon: ShieldCheck },
  { name: 'Approval', detail: 'Human control', icon: CheckCircle2 },
  { name: 'Trace Store', detail: 'Audit record', icon: GitBranch }
];

export function AgentGraph() {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {nodes.map((node, index) => {
        const Icon = node.icon;
        return (
          <div key={node.name} className="rounded-2xl border border-line bg-white p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-brand"><Icon size={18} /></div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Stage {String(index + 1).padStart(2, '0')}</div>
                <div className="font-semibold text-ink">{node.name}</div>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">{node.detail}</p>
          </div>
        );
      })}
    </div>
  );
}
