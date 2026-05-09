export type Workspace = {
  id: string;
  name: string;
  owner: string;
  created_at: string;
};

export type DocumentItem = {
  id: string;
  workspace_id: string;
  title: string;
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type RetrievalHit = {
  document_id: string;
  title: string;
  score: number;
  excerpt: string;
};

export type ToolItem = {
  name: string;
  description: string;
  requires_approval: boolean;
};

export type Approval = {
  id: string;
  task_id: string;
  workspace_id: string;
  status: 'pending' | 'approved' | 'rejected';
  summary: string;
  created_at: string;
  decided_at?: string | null;
};

export type TaskSummary = {
  id: string;
  workspace_id: string;
  request: string;
  status: string;
  result: Record<string, unknown>;
  approval_required: boolean;
  created_at: string;
  updated_at: string;
};

export type TraceItem = {
  id: string;
  task_id: string;
  workspace_id: string;
  payload: Record<string, unknown>;
  created_at: string;
};

export type EvaluationSummary = {
  task_success_rate: number;
  tool_call_accuracy: number;
  retrieval_precision_at_5: number;
  hallucination_flag_rate: number;
  median_latency_ms: number;
  estimated_cost_per_task_usd: number;
  evaluation_scope?: string;
};

export type TaskRunResult = {
  task_id: string;
  status: string;
  trace_id: string;
  result: {
    executive_summary: string;
    request: string;
    plan: Array<{ id: string; title: string; status: string; agent: string }>;
    evidence: RetrievalHit[];
    workflow_payloads: Array<Record<string, unknown>>;
    risk_review: {
      pass_review: boolean;
      risk_level: string;
      findings: string[];
      recommended_action: string;
    };
    recommended_next_actions: string[];
    approval?: Approval;
    trace_id: string;
  };
};
