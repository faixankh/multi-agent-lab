'use client';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { EvaluationSummary } from '@/lib/types';

const fallback = {
  task_success_rate: 0.875,
  tool_call_accuracy: 0.932,
  retrieval_precision_at_5: 0.9,
  hallucination_flag_rate: 0.143,
  median_latency_ms: 842,
  estimated_cost_per_task_usd: 0.018
};

export function EvaluationChart({ summary = fallback }: { summary?: EvaluationSummary }) {
  const data = [
    { name: 'Task success', value: Number((summary.task_success_rate * 100).toFixed(1)) },
    { name: 'Tool accuracy', value: Number((summary.tool_call_accuracy * 100).toFixed(1)) },
    { name: 'Retrieval P@5', value: Number((summary.retrieval_precision_at_5 * 100).toFixed(1)) },
    { name: 'Grounding', value: Number(((1 - summary.hallucination_flag_rate) * 100).toFixed(1)) }
  ];

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
          <YAxis stroke="#64748b" tick={{ fontSize: 12 }} domain={[0, 100]} />
          <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #dbe4ef', borderRadius: 14, color: '#0f172a' }} />
          <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
