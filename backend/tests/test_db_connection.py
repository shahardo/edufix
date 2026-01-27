#!/usr/bin/env python3
"""
Test database connection and basic operations.
"""
import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.dirname(__file__))

from ..database import engine, get_db
from ..models import User, Base
from sqlalchemy.orm import sessionmaker

def test_db_connection():
    """Test database connection."""
    try:
        # Create database tables if they don't exist
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully")

        # Create session
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()

        # Test basic query
        users_count = db.query(User).count()
        print(f"Users in database: {users_count}")

        # Test user lookup
        manager = db.query(User).filter(User.username == "manager").first()
        if manager:
            print(f"Manager found: {manager.username}, role: {manager.role}")
        else:
            print("Manager not found")

        db.close()
        print("Database connection test completed successfully")

    except Exception as e:
        print(f"Database connection error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_db_connection()
