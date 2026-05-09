import requests

BASE_URL = "http://127.0.0.1:8000"

payload = {
    "workspace_id": "enterprise-demo",
    "request": "Analyze the vendor onboarding policy and create an approval-first automation plan.",
    "approval_required": True,
}
response = requests.post(f"{BASE_URL}/api/v1/tasks/run", json=payload, timeout=30)
response.raise_for_status()
print(response.json())
