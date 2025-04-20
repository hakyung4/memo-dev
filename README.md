memo-dev/
├── .env                            # Environment variables (DB, API keys)
├── README.md                       # Project overview and developer guide
│
├── frontend/                       # 🌐 Web frontend (Next.js + Tailwind)
│   ├── app/                        # Next.js App Router pages
│   ├── components/                 # Reusable React UI components
│   ├── lib/                        # Frontend API/client-side utilities
│   ├── hooks/                      # Custom React hooks
│   ├── public/                     # Static files (e.g. logo, images)
│   ├── styles/                     # Global/custom CSS
│   ├── tailwind.config.js          # Tailwind CSS config
│   ├── postcss.config.js           # PostCSS config
│   └── package.json                # Frontend dependencies and scripts
│
├── backend/                        # 🧠 API server (FastAPI)
│   ├── __init__.py                 # Marks backend as Python package
│   ├── main.py                     # FastAPI entry point
│   │
│   ├── api/                        # API routes
│   │   ├── __init__.py
│   │   └── routes/
│   │       ├── __init__.py
│   │       └── memory.py           # Endpoint for code recall, search, etc.
│   │
│   ├── services/                   # Core logic (AI, search, etc.)
│   │   ├── __init__.py
│   │   ├── embedding.py            # OpenAI embedding functions
│   │   └── memory.py               # Code memory, matching logic
│   │
│   ├── db/                         # DB integrations
│   │   ├── __init__.py
│   │   ├── pg.py                   # PostgreSQL session/engine
│   │   └── pinecone_db.py          # Pinecone upsert/query helpers
│   │
│   ├── models/                     # SQLAlchemy ORM models
│   │   └── __init__.py
│   │
│   ├── schemas/                    # Pydantic request/response models
│   │   └── __init__.py
│   │
│   ├── core/                       # Config and app-level utils
│   │   ├── __init__.py
│   │   └── config.py               # Loads env vars and global settings
│
├── vector-db/                      # 🧭 Pinecone index configuration
│   ├── pinecone_config.json        # Index settings (dim, metric, pods)
│   ├── schema.md                   # Docs: vector metadata schema
│   └── setup_index.py              # Script: create Pinecone index
│
├── scripts/                        # ⚙️ CLI scripts for ingestion/indexing
│   ├── __init__.py
│   ├── ingest_code.py              # Extract code snippets from repo
│   ├── embed_index.py              # Embed and push to Pinecone/DB
│   ├── weekly_digest.py            # GPT digest of recent changes
│   └── test_vector_search.py       # Run test semantic queries
│
├── shared/                         # 🔁 Reusable logic for backend/scripts
│   ├── __init__.py
│   ├── embedding.py                # OpenAI embed logic wrapper
│   ├── summarizer.py               # GPT-based summarization logic
│   └── file_utils.py               # File parsing, cleaning, diffing
