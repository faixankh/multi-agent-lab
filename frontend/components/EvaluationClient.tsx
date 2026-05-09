'use client';

import { useEffect, useState } from 'react';
import { BarChart3, Gauge, Loader2, RefreshCcw, ShieldCheck, Target, Zap } from 'lucide-react';
import { api, isApiError } from '@/lib/api';
import type { EvaluationSummary } from '@/lib/types';
import { EvaluationChart } from './EvaluationChart';
import { EmptyState, MetricCard, Panel, SecondaryButton } from './Shell';

export function EvaluationClient() {
  const [summary, setSummary] = useState<EvaluationSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      setSummary(await api.evaluationSummary());
      setMessage(null);
    } catch (error) {
      setMessage(isApiError(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (!summary) {
    return <Panel title="Evaluation summary"><EmptyState title="Evaluation not loaded" description={message || 'Start the backend and refresh the evaluation summary.'} icon="eval" /><div className="mt-4"><SecondaryButton onClick={load} disabled={loading}>{loading ? <Loader2 className="mr-2 animate-spin" size={16} /> : <RefreshCcw className="mr-2" size={16} />}Refresh</SecondaryButton></div></Panel>;
  }

  return (
    <div className="space-y-6">
      {message && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{message}</div>}
      <div className="flex justify-end"><SecondaryButton onClick={load} disabled={loading}>{loading ? <Loader2 className="mr-2 animate-spin" size={16} /> : <RefreshCcw className="mr-2" size={16} />}Refresh metrics</SecondaryButton></div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Task success" value={`${(summary.task_success_rate * 100).toFixed(1)}%`} caption="Completed or correctly paused tasks." icon={<Target />} tone="success" />
        <MetricCard label="Tool accuracy" value={`${(summary.tool_call_accuracy * 100).toFixed(1)}%`} caption="Correct tool selection and valid arguments." icon={<Zap />} />
        <MetricCard label="Retrieval P@5" value={`${(summary.retrieval_precision_at_5 * 100).toFixed(1)}%`} caption="Relevant evidence appears in top results." icon={<BarChart3 />} />
        <MetricCard label="Grounding score" value={`${((1 - summary.hallucination_flag_rate) * 100).toFixed(1)}%`} caption="Inverse of unsupported-claim flag rate." icon={<ShieldCheck />} tone="success" />
      </section>
      <div className="grid gap-6 xl:grid-cols-[1fr_.8fr]">
        <Panel title="Benchmark chart" description="Metrics are loaded directly from /api/v1/evals/summary."><EvaluationChart summary={summary} /></Panel>
        <Panel title="Operational metrics">
          <div className="space-y-4">
            <div className="rounded-2xl border border-line bg-slate-50 p-4"><div className="flex items-center gap-2 font-semibold text-ink"><Gauge size={18} />Median latency</div><p className="mt-2 text-3xl font-semibold text-brand">{summary.median_latency_ms}ms</p></div>
            <div className="rounded-2xl border border-line bg-slate-50 p-4"><div className="font-semibold text-ink">Estimated cost per task</div><p className="mt-2 text-3xl font-semibold text-brand">${summary.estimated_cost_per_task_usd.toFixed(3)}</p></div>
            <p className="text-sm leading-6 text-muted">{summary.evaluation_scope || 'Deterministic local benchmark with reproducible fixtures.'}</p>
          </div>
        </Panel>
      </div>
      <Panel title="Raw evaluation payload"><pre className="overflow-auto rounded-2xl border border-line bg-slate-950 p-4 text-xs leading-6 text-slate-100"><code>{JSON.stringify(summary, null, 2)}</code></pre></Panel>
    </div>
  );
}
