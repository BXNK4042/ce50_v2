import pytest
from quiz_data import QUIZ_QUESTIONS, ROLES_METADATA, ROLE_MAX_SCORES, evaluate_quiz


def test_quiz_questions_structure():
    assert len(QUIZ_QUESTIONS) == 30
    for q in QUIZ_QUESTIONS:
        assert "id" in q
        assert "question" in q
        assert "options" in q
        assert "is_multiple" in q
        assert isinstance(q["options"], list)
        assert len(q["options"]) > 0


def test_quiz_evaluation_ordering():
    answers = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 1,
        "5": 0,
        "6": 0,
        "7": 0,
        "8": 0,
        "9": 0,
        "10": 0,
        "29": [0, 1],
        "30": [0, 1, 2],
    }
    result = evaluate_quiz(answers)
    all_roles = result["all_roles"]
    assert len(all_roles) > 0

    for i in range(len(all_roles) - 1):
        curr = all_roles[i]
        nxt = all_roles[i + 1]
        assert (
            curr["match_percentage"] >= nxt["match_percentage"]
        ), f"Role {curr['title']} ({curr['match_percentage']}%) should be >= {nxt['title']} ({nxt['match_percentage']}%)"


def test_quiz_evaluation_tie_breaker():
    answers = {str(i): 0 for i in range(1, 29)}
    answers["29"] = [0]
    answers["30"] = [0]

    result = evaluate_quiz(answers)
    all_roles = result["all_roles"]

    for i in range(len(all_roles) - 1):
        curr = all_roles[i]
        nxt = all_roles[i + 1]
        if curr["match_percentage"] == nxt["match_percentage"]:
            assert (
                curr["score"] >= nxt["score"]
            ), f"Tie breaker failed: {curr['title']} (score {curr['score']}) should be >= {nxt['title']} (score {nxt['score']})"


def test_quiz_evaluation_empty_answers():
    result = evaluate_quiz({})
    assert result["success"] is True
    assert result["total_questions"] == 30
    assert result["answered_count"] == 0
    assert len(result["top_roles"]) == 3
    assert len(result["all_roles"]) == len(ROLES_METADATA)

    for role in result["all_roles"]:
        assert role["score"] == 0
        assert role["match_percentage"] == 0
