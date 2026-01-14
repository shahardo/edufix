import pytest
import sys
import os
import json

# Add the parent directory to the path so we can import modules
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, get_db
from models import User, Class, Course, Unit, Lesson, Question, UserAnswer, Mastery, Gamification  # Import all models to register them

# Import the app components separately to avoid full app import issues
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, content, practice

# Create a test app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router, prefix="/auth", tags=["authentication"])
app.include_router(content.router, prefix="/api", tags=["content"])
app.include_router(practice.router, prefix="/api/practice", tags=["practice"])

# Test database
TEST_DATABASE_URL = "sqlite:///./test_practice.db"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    """Override get_db for testing."""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(scope="function", autouse=True)
def test_db():
    """Create and drop test database."""
    # Ensure all tables are created
    Base.metadata.create_all(bind=engine)
    yield
    # Clean up after test
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def teacher_token():
    """Create a teacher user and class, return auth token."""
    # Create teacher user
    user_data = {
        "username": "teacher1",
        "email": "teacher@example.com",
        "password": "testpass123",
        "full_name": "Test Teacher",
        "role": "teacher"
    }
    client.post("/auth/register", json=user_data)

    # Login to get token
    response = client.post("/auth/token", data={
        "username": "teacher1",
        "password": "testpass123"
    })
    token = response.json()["access_token"]

    # Create a class using the API (simplified - in real test we'd need a classes router)
    db = TestingSessionLocal()
    test_class = Class(name="Chemistry 10B", subject="Chemistry", teacher_id=1)
    db.add(test_class)
    db.commit()
    db.close()

    return token

@pytest.fixture(scope="function")
def student_token():
    """Create a student user, return auth token."""
    # Create student user
    user_data = {
        "username": "student1",
        "email": "student@example.com",
        "password": "testpass123",
        "full_name": "Test Student",
        "role": "student",
        "class_id": 1
    }
    client.post("/auth/register", json=user_data)

    # Login to get token
    response = client.post("/auth/token", data={
        "username": "student1",
        "password": "testpass123"
    })
    token = response.json()["access_token"]

    return token

@pytest.fixture(scope="function")
def setup_test_data(teacher_token, student_token):
    """Set up test data: course, unit, lesson, and questions."""
    # Create course
    course_data = {
        "name": "Chemistry Basics",
        "description": "Introduction to chemistry",
        "subject": "Chemistry",
        "class_id": 1
    }
    course_response = client.post("/api/courses", json=course_data, headers={"Authorization": f"Bearer {teacher_token}"})
    course_id = course_response.json()["id"]

    # Create unit
    unit_data = {
        "name": "Atomic Structure",
        "course_id": course_id
    }
    unit_response = client.post("/api/units", json=unit_data, headers={"Authorization": f"Bearer {teacher_token}"})
    unit_id = unit_response.json()["id"]

    # Create lesson
    lesson_data = {
        "title": "Introduction to Atoms",
        "unit_id": unit_id
    }
    lesson_response = client.post("/api/lessons", json=lesson_data, headers={"Authorization": f"Bearer {teacher_token}"})
    lesson_id = lesson_response.json()["id"]

    # Create questions directly in database
    db = TestingSessionLocal()
    questions_data = [
        {
            "lesson_id": lesson_id,
            "question_text": "What is the atomic number of hydrogen?",
            "question_type": "mcq",
            "options": json.dumps(["1", "2", "3", "4"]),
            "correct_answer": "1",
            "difficulty": "easy",
            "subject": "Chemistry"
        },
        {
            "lesson_id": lesson_id,
            "question_text": "What is the chemical symbol for water?",
            "question_type": "short_answer",
            "options": None,
            "correct_answer": "H2O",
            "difficulty": "easy",
            "subject": "Chemistry"
        },
        {
            "lesson_id": lesson_id,
            "question_text": "What is the charge of an electron?",
            "question_type": "mcq",
            "options": json.dumps(["+1", "-1", "0", "+2"]),
            "correct_answer": "-1",
            "difficulty": "medium",
            "subject": "Chemistry"
        }
    ]

    question_ids = []
    for q_data in questions_data:
        question = Question(**q_data)
        db.add(question)
        db.commit()
        db.refresh(question)
        question_ids.append(question.id)

    db.close()

    return {
        "course_id": course_id,
        "unit_id": unit_id,
        "lesson_id": lesson_id,
        "question_ids": question_ids
    }

def test_get_next_question(setup_test_data, student_token):
    """Test getting the next question for practice."""
    test_data = setup_test_data

    response = client.get(f"/api/practice/questions/next?lesson_id={test_data['lesson_id']}",
                         headers={"Authorization": f"Bearer {student_token}"})
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "question_text" in data
    assert "question_type" in data
    assert "difficulty" in data
    assert "subject" in data
    assert data["subject"] == "Chemistry"

def test_submit_correct_answer(setup_test_data, student_token):
    """Test submitting a correct answer."""
    test_data = setup_test_data
    question_id = test_data["question_ids"][0]  # First question: atomic number of hydrogen

    answer_data = {
        "answer": "1",
        "time_taken": 30.5,
        "hints_used": 0
    }

    response = client.post(f"/api/practice/questions/{question_id}/answer",
                          json=answer_data,
                          headers={"Authorization": f"Bearer {student_token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["is_correct"] == True
    assert data["correct_answer"] == "1"
    assert data["points_earned"] == 15  # 10 + 5 bonus for quick answer
    assert "explanation" in data

def test_submit_incorrect_answer(setup_test_data, student_token):
    """Test submitting an incorrect answer."""
    test_data = setup_test_data
    question_id = test_data["question_ids"][0]  # First question: atomic number of hydrogen

    answer_data = {
        "answer": "2",  # Wrong answer
        "time_taken": 120.0,
        "hints_used": 1
    }

    response = client.post(f"/api/practice/questions/{question_id}/answer",
                          json=answer_data,
                          headers={"Authorization": f"Bearer {student_token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["is_correct"] == False
    assert data["correct_answer"] == "1"
    assert data["points_earned"] == 0
    assert "explanation" in data

def test_get_hint(setup_test_data, student_token):
    """Test getting a hint for a question."""
    test_data = setup_test_data
    question_id = test_data["question_ids"][0]

    response = client.get(f"/api/practice/questions/{question_id}/hints?hint_level=1",
                         headers={"Authorization": f"Bearer {student_token}"})
    assert response.status_code == 200
    data = response.json()
    assert "hint" in data
    assert data["hint_level"] == 1
    assert data["total_hints"] == 3
    assert isinstance(data["hint"], str)

def test_get_mastery_scores(student_token):
    """Test getting mastery scores."""
    response = client.get("/api/practice/mastery",
                         headers={"Authorization": f"Bearer {student_token}"})
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_get_gamification_data(student_token):
    """Test getting gamification data."""
    response = client.get("/api/practice/gamification",
                         headers={"Authorization": f"Bearer {student_token}"})
    assert response.status_code == 200
    data = response.json()
    assert "points" in data
    assert "badges" in data
    assert "streak" in data
    assert data["points"] == 0  # No points earned yet
    assert data["streak"] == 0

def test_teacher_cannot_access_practice(teacher_token):
    """Test that teachers cannot access practice endpoints."""
    response = client.get("/api/practice/questions/next",
                         headers={"Authorization": f"Bearer {teacher_token}"})
    assert response.status_code == 403
    assert "Only students can access practice questions" in response.json()["detail"]

def test_invalid_hint_level(setup_test_data, student_token):
    """Test requesting an invalid hint level."""
    test_data = setup_test_data
    question_id = test_data["question_ids"][0]

    response = client.get(f"/api/practice/questions/{question_id}/hints?hint_level=5",
                         headers={"Authorization": f"Bearer {student_token}"})
    assert response.status_code == 400
    assert "Invalid hint level" in response.json()["detail"]

if __name__ == "__main__":
    pytest.main([__file__])
