import pytest
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, get_db
from main import app
from models import User
from routers.auth import get_password_hash

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

@pytest.fixture(scope="function")
def test_db():
    """Create and drop test database."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_register_user(test_db):
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

def test_register_duplicate_user(test_db):
    """Test registering user with existing username/email."""
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123",
        "full_name": "Test User",
        "role": "student"
    }
    # Register first user
    client.post("/auth/register", json=user_data)

    # Try to register again
    response = client.post("/auth/register", json=user_data)
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"]

def test_login_success(test_db):
    """Test successful login."""
    # Register user first
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123",
        "full_name": "Test User",
        "role": "student"
    }
    client.post("/auth/register", json=user_data)

    # Login
    response = client.post("/auth/token", data={
        "username": "testuser",
        "password": "testpass123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_wrong_password(test_db):
    """Test login with wrong password."""
    # Register user first
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123",
        "full_name": "Test User",
        "role": "student"
    }
    client.post("/auth/register", json=user_data)

    # Login with wrong password
    response = client.post("/auth/token", data={
        "username": "testuser",
        "password": "wrongpass"
    })
    assert response.status_code == 401
    assert "Incorrect username or password" in response.json()["detail"]

def test_get_current_user(test_db):
    """Test getting current user with token."""
    # Register and login
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123",
        "full_name": "Test User",
        "role": "student"
    }
    client.post("/auth/register", json=user_data)

    response = client.post("/auth/token", data={
        "username": "testuser",
        "password": "testpass123"
    })
    token = response.json()["access_token"]

    # Get current user
    response = client.get("/auth/users/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"

@pytest.mark.skip(reason="bcrypt backend detection issue")
def test_password_hashing():
    """Test password hashing functionality."""
    password = "testpass123"
    hashed = get_password_hash(password)
    assert hashed != password
    # Note: verify_password test is covered in login tests

if __name__ == "__main__":
    pytest.main([__file__])
