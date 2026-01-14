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
from routers.auth import get_password_hash

# Import the app components separately to avoid full app import issues
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth

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

# Test database
TEST_DATABASE_URL = "sqlite:///./test.db"
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

def test_register_user():
    """Test user registration."""
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123",
        "full_name": "Test User",
        "role": "student",
        "language": "en"
    }
    response = client.post("/auth/register", json=user_data)
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "test@example.com"
    assert data["role"] == "student"

def test_register_duplicate_user():
    """Test registering user with existing username/email."""
    user_data = {
        "username": "testuser2",
        "email": "test2@example.com",
        "password": "testpass123",
        "full_name": "Test User 2",
        "role": "student"
    }
    # Register first user
    client.post("/auth/register", json=user_data)

    # Try to register again
    response = client.post("/auth/register", json=user_data)
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"]

def test_login_success():
    """Test successful login."""
    # Register user first
    user_data = {
        "username": "testuser3",
        "email": "test3@example.com",
        "password": "testpass123",
        "full_name": "Test User 3",
        "role": "student"
    }
    client.post("/auth/register", json=user_data)

    # Login
    response = client.post("/auth/token", data={
        "username": "testuser3",
        "password": "testpass123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_wrong_password():
    """Test login with wrong password."""
    # Register user first
    user_data = {
        "username": "testuser4",
        "email": "test4@example.com",
        "password": "testpass123",
        "full_name": "Test User 4",
        "role": "student"
    }
    client.post("/auth/register", json=user_data)

    # Login with wrong password
    response = client.post("/auth/token", data={
        "username": "testuser4",
        "password": "wrongpass"
    })
    assert response.status_code == 401
    assert "Incorrect username or password" in response.json()["detail"]

def test_get_current_user():
    """Test getting current user with token."""
    # Register and login
    user_data = {
        "username": "testuser5",
        "email": "test5@example.com",
        "password": "testpass123",
        "full_name": "Test User 5",
        "role": "student"
    }
    client.post("/auth/register", json=user_data)

    response = client.post("/auth/token", data={
        "username": "testuser5",
        "password": "testpass123"
    })
    token = response.json()["access_token"]

    # Get current user
    response = client.get("/auth/users/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser5"

@pytest.mark.skip(reason="bcrypt backend detection issue")
def test_password_hashing():
    """Test password hashing functionality."""
    password = "testpass123"
    hashed = get_password_hash(password)
    assert hashed != password
    # Note: verify_password test is covered in login tests

if __name__ == "__main__":
    pytest.main([__file__])
