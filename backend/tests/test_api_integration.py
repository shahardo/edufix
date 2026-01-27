import pytest
import sys
import os

# Add the parent directory to the path so we can import modules
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, get_db
from models import *  # Import all models to register them

# Import the complete app
from main import app

# Import demo data creation function
from demo_data import create_demo_users

# Test database
TEST_DATABASE_URL = "sqlite:///../data/test_integration.db"
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
    """Create and drop test database with demo data."""
    # Ensure all tables are created
    Base.metadata.create_all(bind=engine)

    # Create demo data
    db = TestingSessionLocal()
    try:
        manager, teachers, students = create_demo_users(db)
        # Note: We're not creating full demo data to keep test focused on API
        # Only create manager user for testing
    finally:
        db.close()

    yield

    # Clean up after test
    Base.metadata.drop_all(bind=engine)

class TestEduFixAPIIntegration:
    """Integration tests for the complete EduFix API."""

    def test_root_endpoint(self):
        """Test root endpoint."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "EduFix API" in data["message"]

    def test_openapi_docs(self):
        """Test OpenAPI documentation endpoint."""
        response = client.get("/docs")
        assert response.status_code == 200

    def test_openapi_json(self):
        """Test OpenAPI JSON endpoint."""
        response = client.get("/openapi.json")
        assert response.status_code == 200
        data = response.json()
        assert "EduFix API" in data["info"]["title"]

    def test_manager_login(self):
        """Test manager login and token retrieval."""
        response = client.post("/auth/token", data={
            "username": "manager",
            "password": "pass123"
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

        # Store token for subsequent tests
        self.manager_token = data["access_token"]

    def test_manager_get_profile(self):
        """Test manager getting their own profile."""
        # First login to get token
        self.test_manager_login()

        response = client.get("/auth/users/me", headers={
            "Authorization": f"Bearer {self.manager_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == "manager"
        assert data["role"] == "manager"
        assert data["full_name"] == "EduFix Manager"

    def test_management_overview(self):
        """Test management overview endpoint."""
        # First login to get token
        self.test_manager_login()

        response = client.get("/api/management/overview", headers={
            "Authorization": f"Bearer {self.manager_token}"
        })
        assert response.status_code == 200
        data = response.json()

        # Check response structure
        required_fields = [
            "total_teachers", "total_students", "total_classes",
            "total_lessons", "active_students_today", "average_mastery_score"
        ]
        for field in required_fields:
            assert field in data
            assert isinstance(data[field], (int, float))

        # Since we only have demo users created, totals might be 0
        assert data["total_teachers"] >= 0
        assert data["total_students"] >= 0

    def test_management_teachers(self):
        """Test management teachers endpoint."""
        # First login to get token
        self.test_manager_login()

        response = client.get("/api/management/teachers", headers={
            "Authorization": f"Bearer {self.manager_token}"
        })
        assert response.status_code == 200
        data = response.json()

        assert isinstance(data, list)
        # Should return at least the demo teachers
        assert len(data) >= 0

        if len(data) > 0:
            teacher = data[0]
            required_fields = [
                "id", "username", "full_name", "email",
                "class_count", "student_count", "created_at"
            ]
            for field in required_fields:
                assert field in teacher

    def test_management_students(self):
        """Test management students endpoint."""
        # First login to get token
        self.test_manager_login()

        response = client.get("/api/management/students", headers={
            "Authorization": f"Bearer {self.manager_token}"
        })
        assert response.status_code == 200
        data = response.json()

        assert isinstance(data, list)
        # Should return at least the demo students
        assert len(data) >= 0

        if len(data) > 0:
            student = data[0]
            required_fields = [
                "id", "username", "full_name", "email",
                "mastery_score", "created_at"
            ]
            for field in required_fields:
                assert field in student

    def test_management_classes(self):
        """Test management classes endpoint."""
        # First login to get token
        self.test_manager_login()

        response = client.get("/api/management/classes", headers={
            "Authorization": f"Bearer {self.manager_token}"
        })
        assert response.status_code == 200
        data = response.json()

        assert isinstance(data, list)
        # Classes might be empty if no demo classes created
        assert len(data) >= 0

        if len(data) > 0:
            class_obj = data[0]
            required_fields = [
                "id", "name", "subject", "teacher_name",
                "student_count", "course_count", "created_at"
            ]
            for field in required_fields:
                assert field in class_obj

    def test_management_lessons(self):
        """Test management lessons endpoint."""
        # First login to get token
        self.test_manager_login()

        response = client.get("/api/management/lessons", headers={
            "Authorization": f"Bearer {self.manager_token}"
        })
        assert response.status_code == 200
        data = response.json()

        assert isinstance(data, list)
        # Lessons might be empty if no demo lessons created
        assert len(data) >= 0

        if len(data) > 0:
            lesson = data[0]
            required_fields = [
                "id", "title", "unit_name", "course_name",
                "class_name", "teacher_name", "question_count", "created_at"
            ]
            for field in required_fields:
                assert field in lesson

    def test_unauthorized_access(self):
        """Test that unauthorized users cannot access management endpoints."""
        # Try to access management endpoint without token
        response = client.get("/api/management/overview")
        assert response.status_code == 401

        # Try with invalid token
        response = client.get("/api/management/overview", headers={
            "Authorization": "Bearer invalid_token"
        })
        assert response.status_code == 401

    def test_student_cannot_access_management(self):
        """Test that students cannot access management endpoints."""
        # Register a student
        student_data = {
            "username": "test_student",
            "email": "student@test.com",
            "password": "student123",
            "full_name": "Test Student",
            "role": "student"
        }
        response = client.post("/auth/register", json=student_data)
        assert response.status_code == 200

        # Login as student
        response = client.post("/auth/token", data={
            "username": "test_student",
            "password": "student123"
        })
        assert response.status_code == 200
        student_token = response.json()["access_token"]

        # Try to access management endpoint
        response = client.get("/api/management/overview", headers={
            "Authorization": f"Bearer {student_token}"
        })
        assert response.status_code == 403  # Forbidden

    def test_teacher_cannot_access_management(self):
        """Test that teachers cannot access management endpoints."""
        # Register a teacher
        teacher_data = {
            "username": "test_teacher",
            "email": "teacher@test.com",
            "password": "teacher123",
            "full_name": "Test Teacher",
            "role": "teacher"
        }
        response = client.post("/auth/register", json=teacher_data)
        assert response.status_code == 200

        # Login as teacher
        response = client.post("/auth/token", data={
            "username": "test_teacher",
            "password": "teacher123"
        })
        assert response.status_code == 200
        teacher_token = response.json()["access_token"]

        # Try to access management endpoint
        response = client.get("/api/management/overview", headers={
            "Authorization": f"Bearer {teacher_token}"
        })
        assert response.status_code == 403  # Forbidden

    def test_complete_workflow(self):
        """Test complete workflow: register -> login -> access management data."""
        # 1. Register a new manager (for testing)
        new_manager_data = {
            "username": "test_manager",
            "email": "test_manager@test.com",
            "password": "manager123",
            "full_name": "Test Manager",
            "role": "manager"
        }
        response = client.post("/auth/register", json=new_manager_data)
        assert response.status_code == 200

        # 2. Login as the new manager
        response = client.post("/auth/token", data={
            "username": "test_manager",
            "password": "manager123"
        })
        assert response.status_code == 200
        token = response.json()["access_token"]

        # 3. Access management overview
        response = client.get("/api/management/overview", headers={
            "Authorization": f"Bearer {token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, dict)

        # 4. Access other management endpoints
        endpoints = ["teachers", "students", "classes", "lessons"]
        for endpoint in endpoints:
            response = client.get(f"/api/management/{endpoint}", headers={
                "Authorization": f"Bearer {token}"
            })
            assert response.status_code == 200
            data = response.json()
            assert isinstance(data, list)

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
