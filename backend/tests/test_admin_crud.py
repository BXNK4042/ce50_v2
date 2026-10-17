import io
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


@pytest.fixture(scope="module")
def admin_token():
    res = client.post("/auth/login", json={"username": "bank", "password": "123"})
    assert res.status_code == 200, f"Login failed: {res.text}"
    data = res.json()
    assert data["user"]["user_role"] == "superadmin"
    return data["token"]


def test_auth_rejections():
    # 1. Invalid credentials
    res = client.post("/auth/login", json={"username": "bank", "password": "wrongpassword"})
    assert res.status_code == 401

    # 2. Mutation without token
    res = client.post("/teachers", json={
        "teacher_firstname": "NoAuth",
        "teacher_lastname": "Test",
        "teacher_contact": "noauth@kmitl.ac.th"
    })
    assert res.status_code in (401, 403)


def test_cache_control_headers():
    for endpoint in ["/teachers", "/students", "/news", "/rooms"]:
        res = client.get(endpoint)
        assert res.status_code == 200
        cc = res.headers.get("Cache-Control", "")
        assert "no-store" in cc or "no-cache" in cc, f"Missing anti-cache header on {endpoint}"


def test_crud_teachers(admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    payload = {
        "teacher_firstname": "ครูทดสอบ",
        "teacher_lastname": "รอบตรวจ",
        "teacher_contact": "test_tch@kmitl.ac.th",
        "teacher_name_en": "Test Teacher",
        "teacher_advise_year": "1"
    }
    c_res = client.post("/teachers", json=payload, headers=headers)
    assert c_res.status_code == 200
    t_id = c_res.json()["teacher_id"]

    # Verify student_email or teacher in GET
    g_res = client.get("/teachers")
    assert any(t["teacher_id"] == t_id for t in g_res.json())

    # Update
    payload["teacher_firstname"] = "ครูทดสอบแก้ไข"
    u_res = client.put(f"/teachers/{t_id}", json=payload, headers=headers)
    assert u_res.status_code == 200

    # Delete
    d_res = client.delete(f"/teachers/{t_id}", headers=headers)
    assert d_res.status_code == 200


def test_crud_students(admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    s_id = "77777777"
    payload = {
        "student_id": s_id,
        "student_firstname": "นศทดสอบ",
        "student_lastname": "ระบบตรวจ",
        "student_lineage": "777",
        "student_email": "s777@kmitl.ac.th",
        "student_contact": "0812345677",
        "student_instagram": "test_ig",
        "student_role": "student"
    }
    c_res = client.post("/students", json=payload, headers=headers)
    assert c_res.status_code == 200

    # Verify GET includes email and instagram
    g_res = client.get("/students")
    matched = [s for s in g_res.json() if str(s["student_id"]) == s_id]
    assert len(matched) == 1
    assert matched[0]["student_email"] == "s777@kmitl.ac.th"
    assert matched[0]["student_instagram"] == "test_ig"

    # Update
    payload["student_firstname"] = "นศแก้ไข"
    u_res = client.put(f"/students/{s_id}", json=payload, headers=headers)
    assert u_res.status_code == 200

    # Delete
    d_res = client.delete(f"/students/{s_id}", headers=headers)
    assert d_res.status_code == 200


def test_crud_news_projects_companies_rooms_banners(admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}

    # 1. News
    n_res = client.post("/news", json={
        "news_title": "หัวข้อทดสอบ", "news_description": "เนื้อหา", "news_category": "ทั่วไป"
    }, headers=headers)
    assert n_res.status_code == 200
    n_id = n_res.json()["news_id"]
    client.delete(f"/news/{n_id}", headers=headers)

    # 2. Projects
    p_res = client.post("/projects", json={
        "project_name": "โปรเจกต์ทดสอบ", "project_description": "คำอธิบาย"
    }, headers=headers)
    assert p_res.status_code == 200
    p_id = p_res.json()["project_id"]
    client.delete(f"/projects/{p_id}", headers=headers)

    # 3. Companies
    co_res = client.post("/companys", json={
        "company_name": "บริษัททดสอบ", "company_location": "BKK", "company_email": "co@test.com"
    }, headers=headers)
    assert co_res.status_code == 200
    co_id = co_res.json()["company_id"]
    client.delete(f"/companys/{co_id}", headers=headers)

    # 4. Rooms
    r_res = client.post("/rooms", json={
        "room_name": "R-TEST", "room_description": "ห้องทดสอบ"
    }, headers=headers)
    assert r_res.status_code == 200
    r_id = r_res.json()["room_id"]
    client.delete(f"/rooms/{r_id}", headers=headers)

    # 5. Hero Banners
    b_res = client.post("/hero-banners", json={
        "generation": "TEST_GEN_QA", "banner_image": "/uploads/banners/test.png", "title": "QA Banner"
    }, headers=headers)
    assert b_res.status_code == 200
    b_id = b_res.json()["banner_id"]
    client.delete(f"/hero-banners/{b_id}", headers=headers)


def test_upload_security(admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}

    # Disallowed extension (.sh)
    bad_file = io.BytesIO(b"echo 'malicious'")
    res = client.post(
        "/upload",
        files={"file": ("exploit.sh", bad_file, "application/x-sh")},
        data={"module": "teachers"},
        headers=headers,
    )
    assert res.status_code == 400

    # Valid PNG image upload
    good_file = io.BytesIO(b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01")
    res = client.post(
        "/upload",
        files={"file": ("pixel.png", good_file, "image/png")},
        data={"module": "teachers"},
        headers=headers,
    )
    assert res.status_code == 200
    assert res.json()["url"].startswith("/uploads/teachers/")
