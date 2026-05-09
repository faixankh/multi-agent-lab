import { BarChart3, FileText, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { MetricCard, PageHeader, Panel, Shell } from '@/components/Shell';

const charts = [
  ['Evaluation scorecard', '/evidence/01_evaluation_scorecard.png'],
  ['Task success by category', '/evidence/02_task_success_by_category.png'],
  ['Retrieval precision curve', '/evidence/03_retrieval_precision_curve.png'],
  ['Latency and cost profile', '/evidence/04_latency_cost_profile.png'],
  ['Tool routing matrix', '/evidence/06_tool_routing_confusion_matrix.png'],
  ['Ablation study', '/evidence/08_ablation_study.png'],
  ['Capability radar', '/evidence/09_capability_radar.png']
];

const infographics = [
  ['Enterprise architecture', '/evidence/01_enterprise_architecture_infographic.png'],
  ['Agent execution lifecycle', '/evidence/02_agent_execution_lifecycle.png'],
  ['Governance matrix', '/evidence/03_governance_safety_matrix.png'],
  ['RAG grounding pipeline', '/evidence/04_rag_grounding_pipeline.png']
];

const screenshots = [
  ['Landing page', '/evidence/01_landing_page.png'],
  ['Dashboard', '/evidence/02_dashboard.png'],
  ['Trace inspector', '/evidence/03_trace_inspector.png'],
  ['RAG workspace', '/evidence/04_rag_workspace.png'],
  ['Approval queue', '/evidence/05_human_approval.png'],
  ['Evaluation dashboard', '/evidence/06_evaluation_dashboard.png'],
  ['Evidence wall', '/evidence/08_evidence_wall.png'],
  ['Operational topology', '/evidence/09_operational_topology.png']
];

function EvidenceImage({ title, src }: { title: string; src: string }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      <img src={src} alt={title} className="h-auto w-full bg-slate-50" />
      <figcaption className="border-t border-line px-4 py-3 text-sm font-semibold text-ink">{title}</figcaption>
    </figure>
  );
}

export default function EvidencePage() {
  return (
    <Shell>
      <PageHeader
        eyebrow="Evidence package"
        title="Results, charts, screenshots, and reproducible proof"
        description="A GitHub-ready evidence wall for the complete AgentOS project: benchmark graphs, UI screenshots, architecture infographics, governance visuals, trace artifacts, CSV files, and reproduction reports."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Chart assets" value="9" caption="Benchmark, retrieval, latency, cost, confusion matrix, failure, and ablation graphs." icon={<BarChart3 />} />
        <MetricCard label="Infographics" value="4" caption="Architecture, lifecycle, governance, and RAG grounding visuals." icon={<ImageIcon />} />
        <MetricCard label="Screenshots" value="11" caption="Landing, dashboard, traces, RAG, approvals, evaluation, API, and evidence screens." icon={<ImageIcon />} tone="success" />
        <MetricCard label="Reports" value="3" caption="Evidence report, reproducibility checklist, and GitHub showcase summary." icon={<FileText />} tone="success" />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <Panel title="Primary evidence wall" description="Use this image near the top of the GitHub README or project results section.">
          <img src="/evidence/08_evidence_wall.png" alt="AgentOS evidence wall" className="w-full rounded-2xl border border-line" />
        </Panel>
        <Panel title="Why this matters" description="The evidence package demonstrates that the repository has runnable code, measurable outputs, UI proof, trace proof, and reproducible result generation.">
          <div className="space-y-3 text-sm leading-6 text-muted">
            <p><strong className="text-ink">Runtime proof:</strong> backend routes, seeded demo, task execution, trace persistence, and approval decisions.</p>
            <p><strong className="text-ink">Evaluation proof:</strong> CSV and JSON metrics, chart images, retrieval curves, tool-routing matrix, and ablation results.</p>
            <p><strong className="text-ink">Presentation proof:</strong> dashboard screenshots, architecture infographics, lifecycle diagrams, and GitHub-ready reports.</p>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
              <div className="flex items-center gap-2 font-semibold"><ShieldCheck size={18} /> Deterministic local evidence</div>
              <p className="mt-2 text-sm leading-6">The assets can be regenerated with <code>python scripts/generate_evidence_assets.py</code>.</p>
            </div>
          </div>
        </Panel>
      </section>

      <Panel title="Benchmark charts" description="Evidence generated from deterministic local benchmark data." >
        <div className="grid gap-5 md:grid-cols-2">
          {charts.map(([title, src]) => <EvidenceImage key={src} title={title} src={src} />)}
        </div>
      </Panel>

      <Panel title="Architecture and governance infographics" description="High-level visuals for reviewers who need to understand the system fast.">
        <div className="grid gap-5 md:grid-cols-2">
          {infographics.map(([title, src]) => <EvidenceImage key={src} title={title} src={src} />)}
        </div>
      </Panel>

      <Panel title="UI and product screenshots" description="Screenshots that prove the repository includes a full dashboard experience, not just backend code.">
        <div className="grid gap-5 md:grid-cols-2">
          {screenshots.map(([title, src]) => <EvidenceImage key={src} title={title} src={src} />)}
        </div>
      </Panel>
    </Shell>
  );
}
