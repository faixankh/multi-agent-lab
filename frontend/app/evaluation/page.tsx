import { EvaluationClient } from '@/components/EvaluationClient';
import { PageHeader, Shell } from '@/components/Shell';

export default function EvaluationPage() {
  return (
    <Shell>
      <PageHeader
        eyebrow="Evaluation"
        title="Agent performance and safety metrics"
        description="Monitor task success, tool-call accuracy, retrieval precision, grounding quality, cost, and latency through live backend metrics."
      />
      <EvaluationClient />
    </Shell>
  );
}
