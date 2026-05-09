from pathlib import Path


class LocalObjectStorage:
    def __init__(self, root: str = "storage/local"):
        self.root = Path(root)
        self.root.mkdir(parents=True, exist_ok=True)

    def put_text(self, key: str, content: str) -> dict:
        path = self.root / key
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        return {"key": key, "uri": str(path), "bytes": len(content.encode("utf-8"))}

    def get_text(self, key: str) -> str:
        return (self.root / key).read_text(encoding="utf-8")
