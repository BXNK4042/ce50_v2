# CE50

Next.js frontend with a FastAPI backend and SQLite database.

## Requirements

- Python 3.10+
- Node.js 20.9+ and npm
- SQLite 3
- Optional: `tmux` for `scripts/dev.sh`

## Setup

Run these commands from the project root after cloning the repository.

### Environment configuration

Create your local environment file from the example:

```bash
cp .env.example .env
```

Set your values for `JWT_SECRET` and optional keys like `GNEWS_API_KEY`.

### Backend setup

Create a virtual environment and install dependencies:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

### Frontend setup

Install dependencies:

```bash
cd frontend
npm ci
cd ..
```

### Database setup

Load the database schema and seed initial data:

```bash
sqlite3 backend/ce50.db < docs/ce50_schema.txt
.venv/bin/python backend/seed.py
```

Run the seed script only once per database. To start fresh, delete `backend/ce50.db` and run the two commands above again.

## Run the application

You can run services separately in different terminals or together with the development script.

### Run services separately

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

- App: <http://localhost:3000>
- API: <http://localhost:8000>
- API docs: <http://localhost:8000/docs>

### Run with the development script

If you have `tmux` installed, start the backend and frontend in a shared session:

```bash
./scripts/dev.sh
```

Stop the session at any time with:

```bash
tmux kill-session -t ce50
```

## Testing and checks

### Backend tests

Run backend unit and API tests with pytest:

```bash
.venv/bin/pytest
```

### Frontend tests and checks

Run frontend unit tests, linting, and build checks:

```bash
cd frontend
npm test
npm run lint
npm run build
```
