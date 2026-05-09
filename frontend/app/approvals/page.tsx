import { ApprovalsClient } from '@/components/ApprovalsClient';
import { PageHeader, Shell } from '@/components/Shell';

export default function ApprovalsPage() {
  return (
    <Shell>
      <PageHeader
        eyebrow="Human governance"
        title="Approval queue"
        description="Review controlled actions produced by the agent runtime and approve or reject them through the backend API."
      />
      <ApprovalsClient />
    </Shell>
  );
}
