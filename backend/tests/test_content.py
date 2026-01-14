import pytest
import sys
import os

# Add the parent directory to the path so we can import modules
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, get_db
from models import User, Class, Course, Unit, Lesson, Material, Question, UserAnswer, Mastery, Gamification  # Import all models to register them

# Import the app components separately to avoid full app import issues
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, content

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

# Test database
TEST_DATABASE_URL = "sqlite:///./test_content.db"
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

    # Create a class using the API
    class_data = {
        "name": "Chemistry 10B",
        "subject": "Chemistry"
    }
    # For now, we'll create the class directly in the database since we don't have a classes endpoint
    # This is a temporary solution until we implement the classes router
    db = TestingSessionLocal()
    test_class = Class(name="Chemistry 10B", subject="Chemistry", teacher_id=1)
    db.add(test_class)
    db.commit()
    db.close()

    return token

def test_create_course(teacher_token):
    """Test creating a course."""
    course_data = {
        "name": "Chemistry Basics",
        "description": "Introduction to chemistry",
        "subject": "Chemistry",
        "class_id": 1
    }
    response = client.post("/api/courses", json=course_data, headers={"Authorization": f"Bearer {teacher_token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Chemistry Basics"
    assert data["subject"] == "Chemistry"

def test_get_courses(teacher_token):
    """Test getting courses."""
    # First create a course
    course_data = {
        "name": "Chemistry Basics",
        "description": "Introduction to chemistry",
        "subject": "Chemistry",
        "class_id": 1
    }
    client.post("/api/courses", json=course_data, headers={"Authorization": f"Bearer {teacher_token}"})

    response = client.get("/api/courses", headers={"Authorization": f"Bearer {teacher_token}"})
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Chemistry Basics"

def test_create_unit(teacher_token):
    """Test creating a unit."""
    # First create a course
    course_data = {
        "name": "Chemistry Basics",
        "description": "Introduction to chemistry",
        "subject": "Chemistry",
        "class_id": 1
    }
    course_response = client.post("/api/courses", json=course_data, headers={"Authorization": f"Bearer {teacher_token}"})
    course_id = course_response.json()["id"]

    unit_data = {
        "name": "Atomic Structure",
        "course_id": course_id
    }
    response = client.post("/api/units", json=unit_data, headers={"Authorization": f"Bearer {teacher_token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Atomic Structure"

def test_create_lesson(teacher_token):
    """Test creating a lesson."""
    # Create course and unit first
    course_data = {
        "name": "Chemistry Basics",
        "description": "Introduction to chemistry",
        "subject": "Chemistry",
        "class_id": 1
    }
    course_response = client.post("/api/courses", json=course_data, headers={"Authorization": f"Bearer {teacher_token}"})
    course_id = course_response.json()["id"]

    unit_data = {
        "name": "Atomic Structure",
        "course_id": course_id
    }
    unit_response = client.post("/api/units", json=unit_data, headers={"Authorization": f"Bearer {teacher_token}"})
    unit_id = unit_response.json()["id"]

    lesson_data = {
        "title": "Introduction to Atoms",
        "unit_id": unit_id
    }
    response = client.post("/api/lessons", json=lesson_data, headers={"Authorization": f"Bearer {teacher_token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Introduction to Atoms"

def test_create_and_get_lessons(teacher_token):
    """Test creating and retrieving lessons."""
    # Create course and unit first
    course_data = {
        "name": "Chemistry Basics",
        "description": "Introduction to chemistry",
        "subject": "Chemistry",
        "class_id": 1
    }
    course_response = client.post("/api/courses", json=course_data, headers={"Authorization": f"Bearer {teacher_token}"})
    course_id = course_response.json()["id"]

    unit_data = {
        "name": "Atomic Structure",
        "course_id": course_id
    }
    unit_response = client.post("/api/units", json=unit_data, headers={"Authorization": f"Bearer {teacher_token}"})
    unit_id = unit_response.json()["id"]

    # Create two lessons
    lesson_data1 = {
        "title": "Introduction to Atoms",
        "unit_id": unit_id
    }
    lesson_data2 = {
        "title": "Electron Configuration",
        "unit_id": unit_id
    }
    client.post("/api/lessons", json=lesson_data1, headers={"Authorization": f"Bearer {teacher_token}"})
    client.post("/api/lessons", json=lesson_data2, headers={"Authorization": f"Bearer {teacher_token}"})

    # Test getting lessons
    response = client.get(f"/api/lessons?unit_id={unit_id}", headers={"Authorization": f"Bearer {teacher_token}"})
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["title"] == "Introduction to Atoms"
    assert data[1]["title"] == "Electron Configuration"

if __name__ == "__main__":
    pytest.main([__file__])
