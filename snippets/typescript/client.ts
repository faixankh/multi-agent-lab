type AgentTaskRequest = {
  workspace_id: string;
  request: string;
  approval_required: boolean;
};

export async function runAgentTask(payload: AgentTaskRequest) {
  const response = await fetch('http://127.0.0.1:8000/api/v1/tasks/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`AgentOS API failed: ${response.status}`);
  return response.json();
}
