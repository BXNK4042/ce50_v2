import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_get_teachers():
    response = client.get("/teachers")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_get_students():
    response = client.get("/students")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    for student in data:
        assert "student_contact" not in student
        assert "phone" not in student
        assert "student_instagram" not in student
        assert "instagram" not in student


def test_get_rooms():
    response = client.get("/rooms")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_get_class():
    response = client.get("/class")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_get_exam():
    response = client.get("/exam")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_quiz_questions_endpoint():
    response = client.get("/quiz/questions")
    assert response.status_code == 200
    data = response.json()
    assert "questions" in data
    assert len(data["questions"]) == 30


def test_quiz_evaluate_endpoint():
    payload = {
        "answers": {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 1,
            "29": [0, 1],
            "30": [0],
        }
    }
    response = client.post("/quiz/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "top_roles" in data
    top_roles = data["top_roles"]
    assert len(top_roles) > 0

    for i in range(len(top_roles) - 1):
        assert (
            top_roles[i]["match_percentage"] >= top_roles[i + 1]["match_percentage"]
        ), f"top_roles not ordered descending: {top_roles[i]['match_percentage']} < {top_roles[i + 1]['match_percentage']}"


def test_auth_login_invalid():
    payload = {
        "username": "non_existent_user_ce50_test",
        "password": "wrong_password_12345",
    }
    response = client.post("/auth/login", json=payload)
    assert response.status_code == 401
