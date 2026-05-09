SENSITIVE_ACTION_TERMS = {
    "send", "delete", "purchase", "deploy", "publish", "email", "charge", "transfer", "webhook", "external"
}


def requires_human_approval(text: str) -> bool:
    terms = set(text.lower().replace('-', ' ').split())
    return bool(terms & SENSITIVE_ACTION_TERMS)


def safety_notes(text: str) -> list[str]:
    notes = []
    if requires_human_approval(text):
        notes.append("Human approval is required before irreversible or external actions.")
    if "policy" in text.lower() or "governance" in text.lower():
        notes.append("The final response should include source-grounded evidence and explicit assumptions.")
    return notes
