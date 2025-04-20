import os
import json
from datetime import datetime

SUPPORTED_EXTENSIONS = {".py", ".js", ".ts", ".jsx", ".tsx", ".html", ".css"}
MAX_METADATA_TEXT_CHARS = 4000  # Stay well under Pinecone's 40KB metadata limit

EXCLUDE_DIRS = {"venv", "node_modules", ".git", "__pycache__", "site-packages", "dist", "build", ".next"}

def collect_code_files(directory: str):
    entries = []

    for root, dirs, files in os.walk(directory):
        # Skip vendor/dev folders
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]

        for file in files:
            ext = os.path.splitext(file)[1]
            if ext in SUPPORTED_EXTENSIONS:
                path = os.path.join(root, file)
                relpath = os.path.relpath(path, directory)

                try:
                    with open(path, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()

                        if len(content) > MAX_METADATA_TEXT_CHARS:
                            print(f"⚠️ Truncating: {relpath} (was {len(content)} chars)")
                            content = content[:MAX_METADATA_TEXT_CHARS]

                        entries.append({
                            "id": None,
                            "project": os.path.basename(directory),
                            "filename": relpath,
                            "text": content,
                            "timestamp": datetime.utcnow().isoformat()
                        })

                except Exception as e:
                    print(f"❌ Skipped {relpath}: {e}")

    return entries

def save_to_json(entries, output_path):
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(entries, f, indent=2)

if __name__ == "__main__":
    project_dir = input("📂 Path to your project folder: ").strip()
    output_path = "scripts/code_entries.json"

    entries = collect_code_files(project_dir)
    save_to_json(entries, output_path)

    print(f"\n✅ Saved {len(entries)} clean code snippets to {output_path}")
