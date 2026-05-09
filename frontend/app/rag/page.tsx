import { RagConsole } from '@/components/RagConsole';
import { PageHeader, Shell } from '@/components/Shell';

export default function RagPage() {
  return (
    <Shell>
      <PageHeader
        eyebrow="Knowledge workspace"
        title="Document ingestion and retrieval"
        description="Add workspace documents, query the retrieval layer, and inspect scored evidence before the agent uses it."
      />
      <RagConsole />
    </Shell>
  );
}
