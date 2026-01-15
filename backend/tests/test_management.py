import pytest
import sys
import os

# Add the parent directory to the path so we can import modules
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, get_db
from models import User, Class, Course, Unit, Lesson, Question, Mastery, Session as UserSession

# Import the app components separately to avoid full app import issues
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, management

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
app.include_router(management.router, prefix="/api/management", tags=["management"])

# Test database
TEST_DATABASE_URL = "sqlite:///./test_management.db"
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

@pytest.fixture
def manager_token():
    """Create a manager user and return their token."""
    # Register manager
    user_data = {
        "username": "manager_test",
        "email": "manager@test.com",
        "password": "testpass123",
        "full_name": "Test Manager",
        "role": "manager"
    }
    client.post("/auth/register", json=user_data)

    # Login and get token
    response = client.post("/auth/token", data={
        "username": "manager_test",
        "password": "testpass123"
    })
    return response.json()["access_token"]

@pytest.fixture
def teacher_token():
    """Create a teacher user and return their token."""
    # Register teacher
    user_data = {
        "username": "teacher_test",
        "email": "teacher@test.com",
        "password": "testpass123",
        "full_name": "Test Teacher",
        "role": "teacher"
    }
    client.post("/auth/register", json=user_data)

    # Login and get token
    response = client.post("/auth/token", data={
        "username": "teacher_test",
        "password": "testpass123"
    })
    return response.json()["access_token"]

@pytest.fixture
def student_token():
    """Create a student user and return their token."""
    # Register student
    user_data = {
        "username": "student_test",
        "email": "student@test.com",
        "password": "testpass123",
        "full_name": "Test Student",
        "role": "student"
    }
    client.post("/auth/register", json=user_data)

    # Login and get token
    response = client.post("/auth/token", data={
        "username": "student_test",
        "password": "testpass123"
    })
    return response.json()["access_token"]

def test_register_manager():
    """Test registering a manager user."""
    user_data = {
        "username": "test_manager",
        "email": "manager@example.com",
        "password": "testpass123",
        "full_name": "Test Manager",
        "role": "manager"
    }
    response = client.post("/auth/register", json=user_data)
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "test_manager"
    assert data["role"] == "manager"

def test_management_overview_access_denied_for_student(manager_token, student_token):
    """Test that students cannot access management overview."""
    response = client.get("/api/management/overview", headers={"Authorization": f"Bearer {student_token}"})
    assert response.status_code == 403
    assert "Only managers can access management overview" in response.json()["detail"]

def test_management_overview_access_denied_for_teacher(manager_token, teacher_token):
    """Test that teachers cannot access management overview."""
    response = client.get("/api/management/overview", headers={"Authorization": f"Bearer {teacher_token}"})
    assert response.status_code == 403
    assert "Only managers can access management overview" in response.json()["detail"]

def test_management_overview_success(manager_token):
    """Test successful access to management overview for managers."""
    response = client.get("/api/management/overview", headers={"Authorization": f"Bearer {manager_token}"})
    assert response.status_code == 200
    data = response.json()
    assert "total_teachers" in data
    assert "total_students" in data
    assert "total_classes" in data
    assert "total_lessons" in data
    assert "active_students_today" in data
    assert "average_mastery_score" in data

def test_get_teachers_access_denied_for_student(student_token):
    """Test that students cannot access teachers list."""
    response = client.get("/api/management/teachers", headers={"Authorization": f"Bearer {student_token}"})
    assert response.status_code == 403
    assert "Only managers can access teachers list" in response.json()["detail"]

def test_get_teachers_success(manager_token):
    """Test successful access to teachers list."""
    response = client.get("/api/management/teachers", headers={"Authorization": f"Bearer {manager_token}"})
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_get_students_access_denied_for_teacher(teacher_token):
    """Test that teachers cannot access students list."""
    response = client.get("/api/management/students", headers={"Authorization": f"Bearer {teacher_token}"})
    assert response.status_code == 403
    assert "Only managers can access students list" in response.json()["detail"]

def test_get_students_success(manager_token):
    """Test successful access to students list."""
    response = client.get("/api/management/students", headers={"Authorization": f"Bearer {manager_token}"})
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_get_classes_access_denied_for_student(student_token):
    """Test that students cannot access classes list."""
    response = client.get("/api/management/classes", headers={"Authorization": f"Bearer {student_token}"})
    assert response.status_code == 403
    assert "Only managers can access classes list" in response.json()["detail"]

def test_get_classes_success(manager_token):
    """Test successful access to classes list."""
    response = client.get("/api/management/classes", headers={"Authorization": f"Bearer {manager_token}"})
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_get_lessons_access_denied_for_teacher(teacher_token):
    """Test that teachers cannot access lessons list."""
    response = client.get("/api/management/lessons", headers={"Authorization": f"Bearer {teacher_token}"})
    assert response.status_code == 403
    assert "Only managers can access lessons list" in response.json()["detail"]

def test_get_lessons_success(manager_token):
    """Test successful access to lessons list."""
    response = client.get("/api/management/lessons", headers={"Authorization": f"Bearer {manager_token}"})
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_management_data_with_demo_setup(manager_token):
    """Test management endpoints with some demo data."""
    # Create test data in the database
    db = TestingSessionLocal()

    # Create a teacher
    teacher = User(
        username="demo_teacher",
        email="demo@teacher.com",
        hashed_password="hashed",
        full_name="Demo Teacher",
        role="teacher"
    )
    db.add(teacher)
    db.commit()

    # Create a class
    class_obj = Class(
        name="Demo Chemistry",
        subject="Chemistry",
        teacher_id=teacher.id
    )
    db.add(class_obj)
    db.commit()

    # Create a student
    student = User(
        username="demo_student",
        email="demo@student.com",
        hashed_password="hashed",
        full_name="Demo Student",
        role="student",
        class_id=class_obj.id
    )
    db.add(student)
    db.commit()

    # Create a course
    course = Course(
        name="Chemistry Basics",
        description="Basic chemistry concepts",
        subject="Chemistry",
        class_id=class_obj.id
    )
    db.add(course)
    db.commit()

    # Create a unit
    unit = Unit(
        name="Atoms and Molecules",
        course_id=course.id
    )
    db.add(unit)
    db.commit()

    # Create a lesson
    lesson = Lesson(
        title="Introduction to Atoms",
        unit_id=unit.id
    )
    db.add(lesson)
    db.commit()

    # Create a question
    question = Question(
        lesson_id=lesson.id,
        question_text="What is an atom?",
        question_type="short_answer",
        correct_answer="An atom is the basic unit of matter",
        subject="Chemistry"
    )
    db.add(question)
    db.commit()

    # Create mastery data
    mastery = Mastery(
        user_id=student.id,
        topic="Chemistry",
        score=85.0
    )
    db.add(mastery)
    db.commit()

    db.close()

    # Test overview endpoint
    response = client.get("/api/management/overview", headers={"Authorization": f"Bearer {manager_token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["total_teachers"] == 1  # Only demo teacher (managers are not counted as teachers)
    assert data["total_students"] == 1  # demo student
    assert data["total_classes"] == 1   # demo class
    assert data["total_lessons"] == 1   # demo lesson

    # Test teachers endpoint
    response = client.get("/api/management/teachers", headers={"Authorization": f"Bearer {manager_token}"})
    assert response.status_code == 200
    teachers = response.json()
    assert len(teachers) == 1  # Only the demo teacher (not the manager)
    assert teachers[0]["username"] == "demo_teacher"
    assert teachers[0]["class_count"] == 1
    assert teachers[0]["student_count"] == 1

    # Test students endpoint
    response = client.get("/api/management/students", headers={"Authorization": f"Bearer {manager_token}"})
    assert response.status_code == 200
    students = response.json()
    assert len(students) == 1
    assert students[0]["username"] == "demo_student"
    assert students[0]["class_name"] == "Demo Chemistry"
    assert students[0]["teacher_name"] == "Demo Teacher"
    assert students[0]["mastery_score"] == 85.0

    # Test classes endpoint
    response = client.get("/api/management/classes", headers={"Authorization": f"Bearer {manager_token}"})
    assert response.status_code == 200
    classes = response.json()
    assert len(classes) == 1
    assert classes[0]["name"] == "Demo Chemistry"
    assert classes[0]["subject"] == "Chemistry"
    assert classes[0]["teacher_name"] == "Demo Teacher"
    assert classes[0]["student_count"] == 1
    assert classes[0]["course_count"] == 1

    # Test lessons endpoint
    response = client.get("/api/management/lessons", headers={"Authorization": f"Bearer {manager_token}"})
    assert response.status_code == 200
    lessons = response.json()
    assert len(lessons) == 1
    assert lessons[0]["title"] == "Introduction to Atoms"
    assert lessons[0]["unit_name"] == "Atoms and Molecules"
    assert lessons[0]["course_name"] == "Chemistry Basics"
    assert lessons[0]["class_name"] == "Demo Chemistry"
    assert lessons[0]["teacher_name"] == "Demo Teacher"
    assert lessons[0]["question_count"] == 1

if __name__ == "__main__":
    pytest.main([__file__])
