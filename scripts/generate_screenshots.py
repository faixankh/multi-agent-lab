from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "results" / "screenshots"
OUT.mkdir(parents=True, exist_ok=True)

try:
    FONT = ImageFont.truetype("DejaVuSans.ttf", 24)
    FONT_SM = ImageFont.truetype("DejaVuSans.ttf", 18)
    FONT_LG = ImageFont.truetype("DejaVuSans-Bold.ttf", 44)
    FONT_MD = ImageFont.truetype("DejaVuSans-Bold.ttf", 26)
except Exception:
    FONT = FONT_SM = FONT_LG = FONT_MD = ImageFont.load_default()

INK = (15, 23, 42)
MUTED = (100, 116, 139)
LINE = (219, 228, 239)
BRAND = (37, 99, 235)
SOFT = (241, 245, 249)
WHITE = (255, 255, 255)
SUCCESS = (5, 150, 105)
WARNING = (217, 119, 6)


def draw_wrapped(draw, pos, text, fill=MUTED, font=FONT_SM, width=54, line_height=28):
    x, y = pos
    words = str(text).replace("\n", " \n ").split()
    line = ""
    for word in words:
        if word == "\n":
            draw.text((x, y), line, fill=fill, font=font)
            y += line_height
            line = ""
            continue
        candidate = f"{line} {word}".strip()
        if len(candidate) > width:
            draw.text((x, y), line, fill=fill, font=font)
            y += line_height
            line = word
        else:
            line = candidate
    if line:
        draw.text((x, y), line, fill=fill, font=font)


def card(draw, xy, title, body, value=None, tone=BRAND):
    x1, y1, x2, y2 = xy
    draw.rounded_rectangle(xy, radius=22, fill=WHITE, outline=LINE, width=2)
    draw.rounded_rectangle((x1 + 24, y1 + 24, x1 + 70, y1 + 70), radius=14, fill=(239, 246, 255), outline=(191, 219, 254))
    draw.text((x1 + 92, y1 + 24), title, fill=INK, font=FONT_MD)
    if value:
        draw.text((x1 + 28, y1 + 94), value, fill=tone, font=FONT_LG)
        draw_wrapped(draw, (x1 + 28, y1 + 152), body, width=max(28, (x2-x1)//14))
    else:
        draw_wrapped(draw, (x1 + 28, y1 + 94), body, width=max(42, (x2-x1)//14))


def page(name, title, subtitle, cards):
    img = Image.new("RGB", (1600, 1000), (247, 249, 252))
    draw = ImageDraw.Draw(img)
    for x in range(0, 1600, 44):
        draw.line((x, 0, x, 1000), fill=(236, 242, 249))
    for y in range(0, 1000, 44):
        draw.line((0, y, 1600, y), fill=(236, 242, 249))
    draw.rounded_rectangle((64, 42, 1536, 122), radius=24, fill=WHITE, outline=LINE, width=2)
    draw.rounded_rectangle((96, 62, 136, 102), radius=12, fill=(239, 246, 255), outline=(191, 219, 254))
    draw.text((154, 69), "AgentOS Enterprise Platform", fill=INK, font=FONT_MD)
    draw.rounded_rectangle((1238, 64, 1498, 102), radius=14, fill=(236, 253, 245), outline=(167, 243, 208))
    draw.text((1260, 71), "Governed runtime", fill=SUCCESS, font=FONT_SM)
    draw.text((90, 180), title, fill=INK, font=FONT_LG)
    draw_wrapped(draw, (92, 244), subtitle, fill=MUTED, font=FONT, width=92, line_height=34)
    for args in cards:
        card(draw, *args)
    img.save(OUT / name)

page("01_landing_page.png", "Governed agent platform for enterprise execution", "Planning, retrieval, tool routing, approval gates, evaluation metrics, and auditable traces in a clean white dashboard.", [
    ((90, 340, 450, 520), "Task success", "Reproducible local benchmark", "87.5%", SUCCESS),
    ((480, 340, 840, 520), "Tool accuracy", "Correct tool and argument routing", "93.2%", BRAND),
    ((870, 340, 1230, 520), "Retrieval P@5", "Relevant evidence in top hits", "90.0%", BRAND),
    ((1260, 340, 1520, 520), "Risk controls", "Approval, dry-run HTTP, critic review", "Active", SUCCESS),
    ((90, 600, 720, 880), "Runtime map", "Planner → Memory → Retriever → Tool Router → Executor → Critic → Approval → Trace", None, BRAND),
    ((760, 600, 1520, 880), "Enterprise output", "Structured result with retrieved evidence, workflow payload, approval record, risk review, and recommended actions.", None, BRAND),
])
page("02_dashboard.png", "Live multi-agent control plane", "A functional dashboard that creates workspaces, ingests documents, runs agent tasks, manages approvals, and reads backend traces.", [
    ((90, 330, 450, 510), "Workspaces", "Isolated memory and documents", "1", BRAND),
    ((480, 330, 840, 510), "Tasks", "Trace-backed executions", "6", BRAND),
    ((870, 330, 1230, 510), "Approvals", "Pending human decisions", "2", WARNING),
    ((1260, 330, 1520, 510), "Latency", "Local deterministic runtime", "842ms", BRAND),
    ((90, 580, 760, 890), "Control console", "Create workspace, ingest policy documents, query RAG evidence, and run governed multi-agent tasks.", None, BRAND),
    ((800, 580, 1520, 890), "Latest trace", "Task accepted → Plan generated → Knowledge retrieved → Tools executed → Approval gate → Critic review", None, BRAND),
])
page("03_trace_inspector.png", "Execution trace inspector", "Review persisted multi-agent events and raw JSON payloads for every task execution.", [
    ((90, 320, 720, 870), "Trace events", "Memory loaded\nPlan created\nDocument evidence retrieved\nTool result captured\nCritic review completed\nApproval record created", None, BRAND),
    ((760, 320, 1520, 870), "Structured payload", "task_id, trace_id, workspace_id, status, agent events, tool results, risk review, approval decision, and final result.", None, BRAND),
])
page("04_rag_workspace.png", "Document ingestion and retrieval", "Ingest policy knowledge, run workspace-isolated retrieval, and inspect scored evidence excerpts.", [
    ((90, 320, 720, 870), "Indexed knowledge", "Vendor Onboarding Policy\nAI Governance Standard\nWorkflow Automation Control Procedure", None, BRAND),
    ((760, 320, 1520, 870), "Retrieved evidence", "Top hit: Vendor Onboarding Policy, score 0.91. Excerpts are attached to the final trace for critic verification.", None, BRAND),
])
page("05_human_approval.png", "Human approval queue", "Controlled workflow execution pauses until a human approves or rejects the backend approval record.", [
    ((90, 320, 1520, 780), "Pending controlled action", "External workflow dispatch requires review. The agent prepares the remediation workflow payload, but execution remains paused until an authorized user decides.", None, WARNING),
])
page("06_evaluation_dashboard.png", "Evaluation and safety metrics", "Live metrics for task success, tool accuracy, retrieval precision, grounding quality, latency, and cost.", [
    ((90, 330, 450, 510), "Task success", "Completed or correctly paused tasks", "87.5%", SUCCESS),
    ((480, 330, 840, 510), "Tool accuracy", "Correct tool and arguments", "93.2%", BRAND),
    ((870, 330, 1230, 510), "Retrieval P@5", "Relevant evidence in top five", "90.0%", BRAND),
    ((1260, 330, 1520, 510), "Grounding", "Inverse unsupported-claim rate", "85.7%", SUCCESS),
    ((90, 590, 1520, 870), "Benchmark chart", "Bar chart area for task success, tool accuracy, retrieval precision, and grounding score.", None, BRAND),
])
page("07_api_docs.png", "OpenAPI endpoint coverage", "FastAPI exposes workspace, document, task, trace, approval, tool, and evaluation endpoints for real integration.", [
    ((90, 320, 1520, 870), "API endpoints", "POST /api/v1/workspaces\nPOST /api/v1/documents/ingest\nPOST /api/v1/documents/search\nPOST /api/v1/tasks/run\nGET /api/v1/traces\nPOST /api/v1/approvals/{approval_id}/decision\nGET /api/v1/evals/summary", None, BRAND),
])
print(f"screenshots written to {OUT}")
