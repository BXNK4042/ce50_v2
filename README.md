# CE50

Next.js frontend with a FastAPI API and SQLite database.

## Requirements

- Python 3.10+
- Node.js 20.9+ and npm
- SQLite 3
- Optional: `tmux` and `opencode` for `scripts/dev.sh`

## Setup

Run from the project root after cloning:

```bash
# Backend environment
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi "uvicorn[standard]"

# Frontend dependencies
cd frontend
npm ci
cd ..

# Database
sqlite3 backend/ce50.db < docs/ce50_schema.txt
.venv/bin/python backend/seed.py
```

> Run the seed script only once per database. To reset it, delete `backend/ce50.db` and repeat the database commands.

## Run locally

Start the backend:

```bash
cd backend
../.venv/bin/python -m uvicorn main:app --reload --port 8000
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Set `API_URL` to the backend's public URL before building for deployment. It defaults to `http://localhost:8000` for local development.

- App: <http://localhost:3000>
- API: <http://localhost:8000>
- API docs: <http://localhost:8000/docs>

## Development script

After setup, contributors with `tmux` and `opencode` can start both services with:

```bash
./scripts/dev.sh
```

The script creates a tmux session named `ce50`. Stop it with `tmux kill-session -t ce50`.

## Checks

```bash
cd frontend
npm run lint
npm run build
```
