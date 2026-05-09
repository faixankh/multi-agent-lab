import { DashboardClient } from '@/components/DashboardClient';
import { PageHeader, Shell } from '@/components/Shell';

export default function DashboardPage() {
  return (
    <Shell>
      <PageHeader
        eyebrow="Operations dashboard"
        title="Live multi-agent control plane"
        description="Create workspaces, ingest knowledge, search RAG evidence, run governed agent tasks, inspect trace output, and decide approvals from one professional dashboard."
      />
      <DashboardClient />
    </Shell>
  );
}
