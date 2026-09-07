# CE50 Bug Audit

Audit date: 2026-09-08  
Scope: first-party FastAPI, seed script, SQLite schema, and Next.js frontend. Dependencies and uploaded content were not audited.

## Findings

### High: Backend only works when started from `backend/`

- **Locations:** `backend/main.py:23`, `backend/main.py:31`, `backend/main.py:38`, `backend/main.py:45`, `backend/main.py:52`, `backend/main.py:59`, `backend/main.py:66`, `backend/main.py:73`, `backend/main.py:80`
- **Impact:** Starting Uvicorn from the repository root fails during import because `StaticFiles(directory="uploads")` cannot find that relative directory. If an `uploads/` directory exists in another working directory, requests instead use that directory and a different `ce50.db` file, which can return wrong or empty data.
- **Evidence:** Running `.venv/bin/python -c 'from backend.main import app'` from the repository root raises `RuntimeError: Directory 'uploads' does not exist`.
- **Fix:** Derive the database and uploads paths from `Path(__file__).parent` and use those absolute paths for every connection and static mount.

### High: Deployed browsers call their own `localhost`

- **Locations:** `frontend/app/teachers/page.tsx:12,43`, `frontend/app/students/page.tsx:12,76`, `frontend/app/news/page.tsx:12,51`, `frontend/app/projects/page.tsx:12,54`, `frontend/app/rooms/page.tsx:11`, `frontend/app/internship/page.tsx:11`, `frontend/app/exam/page.tsx:11`, `frontend/app/class/page.tsx:11`, `frontend/next.config.ts:8-12`
- **Impact:** Every API and uploaded image URL is hard-coded to `http://localhost:8000`. In production, visitors' browsers try to contact port 8000 on their own machines, so pages have no data and images fail. The image allow-list also accepts only that origin.
- **Fix:** Use one configured public API origin, or proxy the API and uploads through the frontend's origin. Configure the matching remote image pattern for the deployed host.

### High: Student phone numbers and social handles are public without authorization

- **Locations:** `backend/main.py:43-48`, `frontend/app/students/page.tsx:101-115`
- **Impact:** `GET /students` is public and returns `SELECT *`, including every student's phone number and Instagram handle. The frontend renders both values in a modal. Any caller can collect this personal information directly from the API.
- **Fix:** Return only approved public fields from this endpoint. Keep contact details behind authorization, or obtain and enforce explicit publication consent.

### Medium: Re-running the documented seed command leaves duplicate partial data

- **Locations:** `README.md:29,32`, `backend/seed.py:7-9`, `backend/seed.py:147-157`
- **Impact:** Each seed function opens and commits its own connection. On a second run, duplicate rooms and teachers commit successfully before inserting an existing student ID fails. The database is left with duplicated early tables and unchanged later tables.
- **Fix:** Make the seed idempotent, or reject a non-empty database before writing. If it must be all-or-nothing, use one connection and transaction for `seedAll()`.

### Medium: Fresh setup seeds media metadata required by the UI as `NULL`

- **Locations:** `backend/seed.py:27-40`, `backend/seed.py:81-89`, `backend/seed.py:136-144`, `frontend/app/teachers/page.tsx:43`, `frontend/app/projects/page.tsx:54`, `frontend/app/news/page.tsx:51`
- **Impact:** The documented fresh database setup does not insert `teacher_name_en`, `project_image`, or `news_image`. The UI constructs image requests from these fields, yielding URLs such as `uploads/teachers/null_bg.webp` and `uploads/projects/null`, so fresh installations show broken media.
- **Fix:** Seed the corresponding media values, or render a fallback when optional media fields are absent. Mark fields required by the UI as `NOT NULL` if missing media is invalid.

### Medium: News carousel marks every slide active

- **Location:** `frontend/app/news/page.tsx:48-49`
- **Impact:** Bootstrap requires exactly one `.carousel-item.active`. With two or more news items, all slides are active, causing overlap and unreliable previous/next behavior.
- **Fix:** Use the map index and apply `active` only to the first item.

### Medium: Seed connections do not enforce foreign keys

- **Locations:** `docs/ce50_schema.txt:1`, `backend/seed.py:7-9`
- **Impact:** SQLite foreign-key enforcement is disabled by default and must be enabled on every connection. The schema script's `PRAGMA foreign_keys = ON` does not persist to connections opened by `seed.py`; invalid student, teacher, room, or project references can therefore be inserted.
- **Evidence:** `sqlite3 backend/ce50.db 'PRAGMA foreign_keys;'` returns `0`.
- **Fix:** Execute `PRAGMA foreign_keys = ON` immediately after opening each SQLite connection, including connections used by the API once writes are added.

## Validation Performed

- `npm run lint` completed successfully.
- `npm run build` completed successfully.
- Python source compilation completed successfully.
- Backend root-directory import failed as described in the first finding.
- FastAPI endpoint integration checks could not run because the local environment lacks the `httpx2` package required by its installed `starlette.testclient`.

## Recommended Checks

- Add a temporary-database integration check that initializes the schema, runs the seed, and verifies every endpoint and upload URL.
- Test a second seed run and invalid foreign-key inserts.
- Add an end-to-end production-origin check so browser API calls never resolve to `localhost`.
- Add privacy tests ensuring unauthenticated responses omit student contact details.
