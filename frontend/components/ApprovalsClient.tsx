'use client';

import { useEffect, useState } from 'react';
import { Loader2, RefreshCcw, ShieldAlert } from 'lucide-react';
import { api, isApiError } from '@/lib/api';
import type { Approval } from '@/lib/types';
import { EmptyState, Input, Panel, PrimaryButton, SecondaryButton, StatusBadge } from './Shell';

export function ApprovalsClient() {
  const [workspaceId, setWorkspaceId] = useState('enterprise-demo');
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    setLoading('load');
    try {
      const response = await api.listApprovals(workspaceId);
      setApprovals(response.items);
      setMessage(null);
    } catch (error) {
      setMessage(isApiError(error));
    } finally {
      setLoading(null);
    }
  }

  useEffect(() => { load(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  async function decide(id: string, status: 'approved' | 'rejected') {
    setLoading(id);
    try {
      await api.decideApproval(id, status);
      setMessage(`Approval ${status}.`);
      await load();
    } catch (error) {
      setMessage(isApiError(error));
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      {message && <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">{message}</div>}
      <Panel title="Approval queue controls" description="Load and decide pending controlled actions for a workspace.">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <Input value={workspaceId} onChange={(e) => setWorkspaceId(e.target.value)} placeholder="workspace id" />
          <SecondaryButton onClick={load} disabled={!!loading}>{loading === 'load' ? <Loader2 className="mr-2 animate-spin" size={16} /> : <RefreshCcw className="mr-2" size={16} />}Refresh queue</SecondaryButton>
        </div>
      </Panel>

      <Panel title="Human approval gate" description="Every item here was created by backend orchestration, not hard-coded UI text.">
        {approvals.length ? <div className="space-y-4">{approvals.map((approval) => (
          <article key={approval.id} className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-amber-50 text-amber-700"><ShieldAlert size={20} /></div>
                <div>
                  <h3 className="font-semibold text-ink">{approval.id}</h3>
                  <p className="mt-1 text-sm text-muted">Task: {approval.task_id}</p>
                </div>
              </div>
              <StatusBadge status={approval.status} />
            </div>
            <p className="mt-4 rounded-2xl border border-line bg-slate-50 p-4 text-sm leading-6 text-muted">{approval.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400"><span>Created: {approval.created_at}</span>{approval.decided_at && <span>Decided: {approval.decided_at}</span>}</div>
            {approval.status === 'pending' && <div className="mt-5 flex flex-wrap gap-3"><PrimaryButton onClick={() => decide(approval.id, 'approved')} disabled={!!loading}>{loading === approval.id ? <Loader2 className="mr-2 animate-spin" size={16} /> : null}Approve</PrimaryButton><SecondaryButton onClick={() => decide(approval.id, 'rejected')} disabled={!!loading}>Reject</SecondaryButton></div>}
          </article>
        ))}</div> : <EmptyState title="No approval records" description="Run a dashboard task with approval required to create a pending approval record." icon="layers" />}
      </Panel>
    </div>
  );
}
