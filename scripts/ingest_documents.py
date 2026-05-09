import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import argparse
from pathlib import Path
from backend.app.db.repository import Repository

parser = argparse.ArgumentParser(description="Ingest text files into an AgentOS workspace")
parser.add_argument("--workspace", default="enterprise-demo")
parser.add_argument("paths", nargs="+")
args = parser.parse_args()

repo = Repository()
repo.upsert_workspace(args.workspace, args.workspace, "cli")
for item in args.paths:
    path = Path(item)
    content = path.read_text(encoding="utf-8")
    doc = repo.add_document(args.workspace, path.stem, content, {"source_path": str(path)})
    print(f"ingested {doc['id']} {path}")
