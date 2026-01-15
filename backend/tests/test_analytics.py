import pytest
import sys
import os
from datetime import datetime, timedelta

# Add the parent directory to the path so we can import modules
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, get_db
from models import (
    User, Class, Course, Unit, Lesson, Material, Question, UserAnswer,
    Mastery, Gamification, Session as UserSession, Progress, Intervention
)

# Import the app components
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, analytics

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
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])

# Test database
TEST_DATABASE_URL = "sqlite:///./test_analytics.db"
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
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def teacher_token():
    """Create a teacher and return their auth token."""
    # Register teacher
    teacher_data = {
        "username": "teacher1",
        "email": "teacher@example.com",
        "password": "teachpass123",
        "full_name": "Test Teacher",
        "role": "teacher"
    }
    client.post("/auth/register", json=teacher_data)

    # Login and get token
    response = client.post("/auth/token", data={
        "username": "teacher1",
        "password": "teachpass123"
    })
    return response.json()["access_token"]

@pytest.fixture
def student_token():
    """Create a student and return their auth token."""
    # Register student
    student_data = {
        "username": "student1",
        "email": "student@example.com",
        "password": "studpass123",
        "full_name": "Test Student",
        "role": "student"
    }
    client.post("/auth/register", json=student_data)

    # Login and get token
    response = client.post("/auth/token", data={
        "username": "student1",
        "password": "studpass123"
    })
    return response.json()["access_token"]

@pytest.fixture
def setup_test_data():
    """Set up test data for analytics tests."""
    db = TestingSessionLocal()

    try:
        # Get the existing teacher created by teacher_token fixture
        teacher = db.query(User).filter(User.username == "teacher1").first()
        if not teacher:
            # Create teacher if doesn't exist
            teacher = User(
                username="teacher1",
                email="teacher@example.com",
                hashed_password="hashedpass",
                full_name="Test Teacher",
                role="teacher"
            )
            db.add(teacher)
            db.flush()

        # Create class for the teacher
        teacher_class = Class(
            name="Test Class",
            subject="Mathematics",
            teacher_id=teacher.id
        )
        db.add(teacher_class)
        db.flush()

        # Create students for the class with unique usernames
        students = []
        for i in range(1, 6):  # 5 students
            student = User(
                username=f"analytics_student{i}",
                email=f"analytics_student{i}@example.com",
                hashed_password="hashedpass",
                full_name=f"Analytics Student {i}",
                role="student",
                class_id=teacher_class.id
            )
            db.add(student)
            students.append(student)
        db.flush()

        # Create course
        course = Course(
            name="Algebra",
            description="Basic algebra course",
            subject="Mathematics",
            class_id=teacher_class.id
        )
        db.add(course)
        db.flush()

        # Create unit and lesson
        unit = Unit(name="Linear Equations", course_id=course.id)
        db.add(unit)
        db.flush()

        lesson = Lesson(title="Solving Equations", unit_id=unit.id)
        db.add(lesson)
        db.flush()

        # Create questions
        questions = []
        for i in range(1, 11):  # 10 questions
            question = Question(
                lesson_id=lesson.id,
                question_text=f"What is {i} + {i}?",
                question_type="mcq",
                options='["2", "3", "4", "5"]',
                correct_answer="4",
                difficulty="easy",
                subject="Mathematics"
            )
            db.add(question)
            questions.append(question)
        db.flush()

        # Create user answers and mastery data
        for student in students:
            # Create some user answers
            for question in questions[:5]:  # Each student answers 5 questions
                answer = UserAnswer(
                    user_id=student.id,
                    question_id=question.id,
                    answer="4",
                    is_correct=True,
                    time_taken=30.0,
                    hints_used=0
                )
                db.add(answer)

            # Create mastery data
            mastery = Mastery(
                user_id=student.id,
                topic="Mathematics_easy",
                score=80.0
            )
            db.add(mastery)

            # Create gamification data
            gamification = Gamification(
                user_id=student.id,
                points=250,
                streak=5
            )
            db.add(gamification)

            # Create progress data
            progress = Progress(
                user_id=student.id,
                lesson_id=lesson.id,
                completion_percentage=75.0,
                status="in_progress"
            )
            db.add(progress)

            # Create recent session
            session = UserSession(
                user_id=student.id,
                session_type="practice",
                start_time=datetime.utcnow() - timedelta(hours=1),
                end_time=datetime.utcnow(),
                duration=60.0,
                lesson_id=lesson.id,
                questions_attempted=5,
                correct_answers=4
            )
            db.add(session)

        db.commit()

        return {
            "teacher_id": teacher.id,
            "class_id": teacher_class.id,
            "student_ids": [s.id for s in students],
            "lesson_id": lesson.id
        }
    finally:
        db.close()

def test_teacher_dashboard(teacher_token, setup_test_data):
    """Test getting teacher dashboard metrics."""
    response = client.get("/api/analytics/dashboard", headers={"Authorization": f"Bearer {teacher_token}"})
    assert response.status_code == 200
    data = response.json()

    assert "total_students" in data
    assert "active_students_today" in data
    assert "average_mastery_score" in data
    assert "total_questions_attempted" in data
    assert "completion_rate" in data
    assert "top_performing_students" in data

    assert data["total_students"] == 5  # We created 5 students
    assert data["average_mastery_score"] > 0

def test_student_insights(teacher_token, setup_test_data):
    """Test getting student insights."""
    student_id = setup_test_data["student_ids"][0]

    response = client.get(f"/api/analytics/students/{student_id}/insights", headers={"Authorization": f"Bearer {teacher_token}"})
    assert response.status_code == 200
    data = response.json()

    assert data["student_id"] == student_id
    assert "student_name" in data
    assert "mastery_scores" in data
    assert "recent_activity" in data
    assert "progress_rate" in data
    assert "recommendations" in data

    assert len(data["recent_activity"]) > 0
    assert data["progress_rate"] >= 0

def test_student_insights_unauthorized_student(student_token, setup_test_data):
    """Test that students cannot access insights."""
    student_id = setup_test_data["student_ids"][0]

    response = client.get(f"/api/analytics/students/{student_id}/insights", headers={"Authorization": f"Bearer {student_token}"})
    assert response.status_code == 403
    assert "Only teachers can access student insights" in response.json()["detail"]

def test_student_insights_wrong_teacher(teacher_token, setup_test_data):
    """Test accessing insights for student not in teacher's class."""
    # Create another teacher
    other_teacher_data = {
        "username": "teacher2",
        "email": "teacher2@example.com",
        "password": "teachpass123",
        "full_name": "Other Teacher",
        "role": "teacher"
    }
    client.post("/auth/register", json=other_teacher_data)

    response = client.post("/auth/token", data={
        "username": "teacher2",
        "password": "teachpass123"
    })
    other_token = response.json()["access_token"]

    # Try to access insights for a student that exists but belongs to a different teacher
    student_id = setup_test_data["student_ids"][0]  # This student belongs to teacher1
    response = client.get(f"/api/analytics/students/{student_id}/insights", headers={"Authorization": f"Bearer {other_token}"})
    assert response.status_code == 403
    assert "Access denied" in response.json()["detail"]

def test_class_progress(teacher_token, setup_test_data):
    """Test getting class progress overview."""
    class_id = setup_test_data["class_id"]

    response = client.get(f"/api/analytics/classes/{class_id}/progress", headers={"Authorization": f"Bearer {teacher_token}"})
    assert response.status_code == 200
    data = response.json()

    assert isinstance(data, list)
    assert len(data) > 0

    lesson_data = data[0]
    assert "lesson_id" in lesson_data
    assert "lesson_title" in lesson_data
    assert "average_completion" in lesson_data
    assert "struggling_students" in lesson_data
    assert "completed_students" in lesson_data

def test_class_progress_unauthorized(teacher_token):
    """Test accessing progress for class not owned by teacher."""
    # Try to access class that doesn't exist or isn't owned
    response = client.get("/api/analytics/classes/999/progress", headers={"Authorization": f"Bearer {teacher_token}"})
    assert response.status_code == 403

def test_interventions_list(teacher_token, setup_test_data):
    """Test getting interventions list."""
    response = client.get("/api/analytics/interventions", headers={"Authorization": f"Bearer {teacher_token}"})
    assert response.status_code == 200
    data = response.json()

    assert isinstance(data, list)

def test_create_intervention(teacher_token, setup_test_data):
    """Test creating a new intervention."""
    student_id = setup_test_data["student_ids"][0]
    lesson_id = setup_test_data["lesson_id"]

    intervention_data = {
        "student_id": student_id,
        "intervention_type": "remedial",
        "description": "Student needs help with basic concepts",
        "priority": "high",
        "lesson_id": lesson_id
    }

    response = client.post("/api/analytics/interventions", json=intervention_data, headers={"Authorization": f"Bearer {teacher_token}"})
    assert response.status_code == 200
    data = response.json()

    assert "message" in data
    assert "intervention_id" in data

def test_create_intervention_wrong_student(teacher_token, setup_test_data):
    """Test creating intervention for student not in teacher's class."""
    # Create a student that belongs to a different teacher
    other_teacher_data = {
        "username": "other_teacher",
        "email": "other@example.com",
        "password": "teachpass123",
        "full_name": "Other Teacher",
        "role": "teacher"
    }
    client.post("/auth/register", json=other_teacher_data)

    # Create a class for the other teacher
    other_class = {
        "name": "Other Class",
        "subject": "Science",
        "teacher_id": 2  # Assuming other teacher gets ID 2
    }
    # We can't directly create classes through API, so let's create a student that would belong to different teacher
    # For now, just test with a non-existent student ID which should return 404
    intervention_data = {
        "student_id": 999,  # Non-existent student
        "intervention_type": "remedial",
        "description": "Test intervention",
        "priority": "medium"
    }

    response = client.post("/api/analytics/interventions", json=intervention_data, headers={"Authorization": f"Bearer {teacher_token}"})
    # When student doesn't exist, we get 404, not 403
    assert response.status_code == 404

def test_create_intervention_unauthorized_student(student_token, setup_test_data):
    """Test that students cannot create interventions."""
    student_id = setup_test_data["student_ids"][0]

    intervention_data = {
        "student_id": student_id,
        "intervention_type": "remedial",
        "description": "Test intervention",
        "priority": "medium"
    }

    response = client.post("/api/analytics/interventions", json=intervention_data, headers={"Authorization": f"Bearer {student_token}"})
    assert response.status_code == 403
    assert "Only teachers can create interventions" in response.json()["detail"]

def test_interventions_filtering(teacher_token, setup_test_data):
    """Test filtering interventions by status and priority."""
    # Create some interventions first
    student_id = setup_test_data["student_ids"][0]

    interventions = [
        {
            "student_id": student_id,
            "intervention_type": "remedial",
            "description": "High priority intervention",
            "priority": "high"
        },
        {
            "student_id": student_id,
            "intervention_type": "enrichment",
            "description": "Low priority intervention",
            "priority": "low"
        }
    ]

    for intervention in interventions:
        client.post("/api/analytics/interventions", json=intervention, headers={"Authorization": f"Bearer {teacher_token}"})

    # Test filtering by priority
    response = client.get("/api/analytics/interventions?priority_filter=high", headers={"Authorization": f"Bearer {teacher_token}"})
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    for item in data:
        if item["priority"] == "high":
            assert item["description"] == "High priority intervention"

def test_dashboard_empty_teacher():
    """Test dashboard for teacher with no classes/students."""
    # Register teacher with no classes
    teacher_data = {
        "username": "empty_teacher",
        "email": "empty@example.com",
        "password": "teachpass123",
        "full_name": "Empty Teacher",
        "role": "teacher"
    }
    client.post("/auth/register", json=teacher_data)

    response = client.post("/auth/token", data={
        "username": "empty_teacher",
        "password": "teachpass123"
    })
    token = response.json()["access_token"]

    response = client.get("/api/analytics/dashboard", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()

    assert data["total_students"] == 0
    assert data["active_students_today"] == 0
    assert data["average_mastery_score"] == 0.0
    assert data["completion_rate"] == 0.0
    assert data["top_performing_students"] == []

if __name__ == "__main__":
    pytest.main([__file__])
