import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import json
from backend.services.memory import store_memory
from backend.schemas import MemoryEntry


def load_entries(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

if __name__ == "__main__":
    data_path = "scripts/code_entries.json"
    entries = load_entries(data_path)
    count = 0

    for entry_data in entries:
        entry = MemoryEntry(**entry_data)
        try:
            store_memory(entry)
            count += 1
        except Exception as e:
            print(f"❌ Failed to store {entry.filename}: {str(e)}")

    print(f"✅ Indexed {count} snippets from {data_path}")
