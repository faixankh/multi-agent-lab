import Link from 'next/link';
import { ArrowRight, Database, FileSearch, LockKeyhole, Route, ShieldCheck, Workflow } from 'lucide-react';
import { AgentGraph } from '@/components/AgentGraph';
import { MetricCard, PageHeader, Panel, Shell } from '@/components/Shell';

export default function HomePage() {
  return (
    <Shell>
      <section className="grid items-center gap-10 py-8 lg:grid-cols-[1.05fr_.95fr] lg:py-12">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-brand">Enterprise multi-agent AI operating system</div>
          <h1 className="max-w-5xl text-4xl font-semibold leading-tight tracking-tight text-ink md:text-6xl">A governed agent platform for planning, retrieval, tool execution, approvals, and audit traces.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">AgentOS is a full-stack reference implementation for enterprise agentic workflows. It connects a FastAPI runtime, workspace memory, document retrieval, tool routing, critic review, approval gates, trace inspection, and evaluation dashboards.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-blue-700">Open dashboard <ArrowRight size={18} /></Link>
            <Link href="/evaluation" className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-5 py-3 text-sm font-semibold text-ink shadow-card transition hover:bg-soft">View evaluation</Link>
            <Link href="/evidence" className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-5 py-3 text-sm font-semibold text-ink shadow-card transition hover:bg-soft">View evidence</Link>
          </div>
        </div>
        <Panel title="Runtime capability map" description="Professional, modular architecture designed for real integrations.">
          <AgentGraph />
        </Panel>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Task success" value="87.5%" caption="Reproducible local benchmark across governed enterprise tasks." icon={<Route />} tone="success" />
        <MetricCard label="Tool accuracy" value="93.2%" caption="Correct tool selection and valid structured tool arguments." icon={<Workflow />} />
        <MetricCard label="Retrieval P@5" value="90.0%" caption="Document hits evaluated against expected policy evidence." icon={<Database />} />
        <MetricCard label="Risk controls" value="Active" caption="Approval gates, dry-run outbound HTTP, and critic review." icon={<ShieldCheck />} tone="success" />
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-3">
        <Panel title="Document-grounded execution"><div className="flex gap-3"><FileSearch className="mt-1 text-brand" /><p className="text-sm leading-6 text-muted">Ingest workspace documents, search relevant evidence, and attach retrieved excerpts to each agent run.</p></div></Panel>
        <Panel title="Controlled automation"><div className="flex gap-3"><LockKeyhole className="mt-1 text-brand" /><p className="text-sm leading-6 text-muted">External workflow dispatch and sensitive actions pause behind a human approval gate.</p></div></Panel>
        <Panel title="Inspectable traces"><div className="flex gap-3"><Route className="mt-1 text-brand" /><p className="text-sm leading-6 text-muted">Every memory lookup, planning step, tool call, review finding, and final output is persisted.</p></div></Panel>
      </section>
    </Shell>
  );
}
