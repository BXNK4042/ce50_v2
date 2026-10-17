# CE50 Admin CRUD Comprehensive Test Suite

## 1. Authentication & RBAC Test Cases

| ID | Description | Input / Precondition | Expected Result |
|---|---|---|---|
| TC-AUTH-01 | Valid Superadmin Login | `POST /auth/login` with `{"username": "bank", "password": "123"}` | HTTP 200, JWT token returned, `user_role == "superadmin"` |
| TC-AUTH-02 | Invalid Password Login | `POST /auth/login` with wrong credentials | HTTP 401 Unauthorized |
| TC-AUTH-03 | Mutation Without Token | `POST /teachers` or `DELETE /teachers/{id}` with no Authorization header | HTTP 401/403 Forbidden |
| TC-AUTH-04 | Token Expiration / Malformed | `POST /news` with Bearer `invalid-token-string` | HTTP 401 Unauthorized |

## 2. Full Roundtrip CRUD Lifecycle (All 10 Tabs)

Run sequence: **Create (POST) -> Read (GET) -> Update (PUT) -> Verify (GET) -> Delete (DELETE)**

| ID | Tab / Entity | Endpoint | Key Fields Verified |
|---|---|---|---|
| TC-CRUD-01 | Teachers | `/teachers` | `teacher_firstname`, `teacher_lastname`, `teacher_contact`, `teacher_name_en`, `teacher_image` |
| TC-CRUD-02 | Students | `/students` | `student_id`, `student_firstname`, `student_lastname`, `student_email`, `student_instagram`, `student_image`, `student_lineage` |
| TC-CRUD-03 | News | `/news` | `news_title`, `news_description`, `news_category`, `news_image` |
| TC-CRUD-04 | Projects | `/projects` | `project_name`, `project_description`, `project_image`, `project_pdf` |
| TC-CRUD-05 | Companies | `/companys` | `company_name`, `company_location`, `company_email`, `company_image` |
| TC-CRUD-06 | Internships | `/internship` | `student_id`, `company_id`, `internship_title`, `internship_description` |
| TC-CRUD-07 | Class Schedules | `/class` | `teacher_id`, `class_name`, `room_id`, `generation`, `semester`, `class_day` |
| TC-CRUD-08 | Exam Schedules | `/exam` | `subject_name`, `exam_date`, `exam_start_time`, `exam_end_time`, `room_name`, `exam_final` |
| TC-CRUD-09 | Rooms | `/rooms` | `room_name`, `room_description`, `room_image` |
| TC-CRUD-10 | Hero Banners | `/hero-banners` | `generation`, `banner_image`, `title` |

## 3. Cache Busting & Data Freshness (Regresion Checks)

| ID | Description | Procedure | Acceptance Criteria |
|---|---|---|---|
| TC-CACHE-01 | Anti-Cache Response Headers | Inspect headers on `GET /teachers`, `GET /students`, `GET /news` | `Cache-Control` header MUST include `no-store, no-cache, must-revalidate` |
| TC-CACHE-02 | UI Re-fetch Cache Busting | Trigger `loadData()` after edit | URL requested MUST include timestamp parameter `?_t=<timestamp>` with `{ cache: "no-store" }` |
| TC-CACHE-03 | Optimistic State Sync | Update an entity in admin UI | React state immediately mirrors updated values before or alongside network re-fetch |

## 4. Relational Integrity & Schema Edge Cases

| ID | Description | Input / Scenario | Acceptance Criteria |
|---|---|---|---|
| TC-REL-01 | Non-Existent Foreign Key (Internship) | Create internship with `student_id` or `company_id` that does not exist in DB | Rejects with Foreign Key / Integrity violation; does not corrupt state |
| TC-REL-02 | Duplicate Unique Key (Banner) | Create hero banner with duplicate `generation` value | Rejects with HTTP 400 (`Banner for generation already exists`) |
| TC-REL-03 | Student Edit Cascade | Update `student_id` of existing student who has internship records | Changes cascade cleanly or handles reference safely |
| TC-REL-04 | Type Coercion Safety | Submit integer fields (`teacher_id`, `room_id`) as strings from form inputs | Successfully coerced by backend model or rejected cleanly without 500 |

## 5. File & Media Uploads

| ID | Description | Input | Acceptance Criteria |
|---|---|---|---|
| TC-UPL-01 | Valid Image Upload | Valid PNG/JPEG/WebP <= 5MB to `/upload` with module `teachers` | HTTP 200, saved under `backend/uploads/teachers/`, returns relative `/uploads/...` URL |
| TC-UPL-02 | Disallowed File Extension | Upload `.exe`, `.sh`, `.php` file | HTTP 400 rejection (extension whitelist enforced) |
| TC-UPL-03 | File Size Limit Image | Upload image > 5MB | HTTP 400 rejection (TC_TCH_004) |
| TC-UPL-04 | File Size Limit PDF | Upload PDF > 25MB | HTTP 400 rejection |
| TC-UPL-05 | Media Path Resolution | Check resolved URL in admin table | Never prefixes double `/api/uploads/` or `/uploads//uploads/`; resolves correctly to `/uploads/...` |

## 6. Admin UI Component & Modal Verification

| ID | Description | Target Tab | Acceptance Criteria |
|---|---|---|---|
| TC-UI-01 | Optional Fields Pre-fill | Students tab | Clicking "Edit" pre-fills `student_email` and `student_instagram` in modal (not blank) |
| TC-UI-02 | Media Thumbnail Rendering | Teachers, Students, News, Projects, Companies, Rooms, Banners | Displays thumbnail image with 404 fallback handler (never displays bare "-" when asset exists) |
| TC-UI-03 | Relational Label Lookup | Internships & Class tabs | Displays resolved human names (e.g. Student Name, Company Name, Room Name) instead of raw IDs |
| TC-UI-04 | Banners Tab Key Sync | Banners tab | `activeTab === "banners"` correctly queries and updates `/hero-banners` endpoint |
