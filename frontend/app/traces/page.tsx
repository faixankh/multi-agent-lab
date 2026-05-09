import { TraceInspectorClient } from '@/components/TraceInspectorClient';
import { PageHeader, Shell } from '@/components/Shell';

export default function TracesPage() {
  return (
    <Shell>
      <PageHeader
        eyebrow="Auditability"
        title="Execution trace inspector"
        description="Browse persisted traces, select an execution, and review the complete multi-agent event timeline and structured payload."
      />
      <TraceInspectorClient />
    </Shell>
  );
}
