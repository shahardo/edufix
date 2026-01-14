import pytest
import sys
import os
from datetime import datetime, timedelta
import json

# Add the parent directory to the path so we can import modules
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from database import Base
from models import (
    User, Class, Course, Unit, Lesson, Material, Question, UserAnswer,
    Mastery, Gamification, Session, Progress, Intervention
)

# Test database
TEST_DATABASE_URL = "sqlite:///./test_phase1b.db"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function", autouse=True)
def test_db():
    """Create and drop test database."""
    Base.metadata.create_all(bind=engine)
    yield
    # Disable foreign key constraints for SQLite during teardown
    if "sqlite" in str(engine.url):
        with engine.connect() as conn:
            conn.execute(text("PRAGMA foreign_keys=OFF"))
            conn.commit()
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def db_session():
    """Provide a database session for testing."""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture(scope="function")
def sample_users(db_session, request):
    """Create sample users for testing."""
    # Use test name to make emails unique
    test_id = request.node.name.replace('[', '_').replace(']', '_').replace('::', '_')

    # Create teachers
    teachers = []
    for i in range(2):
        teacher = User(
            username=f"teacher{i+1}_{test_id}",
            email=f"teacher{i+1}_{test_id}@test.com",
            hashed_password="hashed_password",
            full_name=f"Teacher {i+1}",
            role="teacher",
            language="en"
        )
        db_session.add(teacher)
        teachers.append(teacher)

    # Create students
    students = []
    for i in range(5):
        student = User(
            username=f"student{i+1}_{test_id}",
            email=f"student{i+1}_{test_id}@test.com",
            hashed_password="hashed_password",
            full_name=f"Student {i+1}",
            role="student",
            language="en"
        )
        db_session.add(student)
        students.append(student)

    db_session.commit()

    # Refresh to get IDs
    for user in teachers + students:
        db_session.refresh(user)

    return {"teachers": teachers, "students": students}

@pytest.fixture(scope="function")
def sample_class(db_session, sample_users):
    """Create a sample class."""
    teacher = sample_users["teachers"][0]
    test_class = Class(
        name="Mathematics 101",
        subject="Mathematics",
        teacher_id=teacher.id
    )
    db_session.add(test_class)
    db_session.commit()
    db_session.refresh(test_class)
    return test_class

@pytest.fixture(scope="function")
def sample_course(db_session, sample_class):
    """Create a sample course."""
    course = Course(
        name="Algebra Fundamentals",
        description="Basic algebra concepts",
        subject="Mathematics",
        class_id=sample_class.id
    )
    db_session.add(course)
    db_session.commit()
    db_session.refresh(course)
    return course

@pytest.fixture(scope="function")
def sample_unit(db_session, sample_course):
    """Create a sample unit."""
    unit = Unit(
        name="Linear Equations",
        course_id=sample_course.id
    )
    db_session.add(unit)
    db_session.commit()
    db_session.refresh(unit)
    return unit

@pytest.fixture(scope="function")
def sample_lesson(db_session, sample_unit):
    """Create a sample lesson."""
    lesson = Lesson(
        title="Solving Linear Equations",
        unit_id=sample_unit.id
    )
    db_session.add(lesson)
    db_session.commit()
    db_session.refresh(lesson)
    return lesson

class TestUserModel:
    """Test User model CRUD operations."""

    def test_create_user(self, db_session):
        """Test creating a new user."""
        user = User(
            username="testuser",
            email="test@example.com",
            hashed_password="hashed_password",
            full_name="Test User",
            role="student",
            language="en"
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)

        assert user.id is not None
        assert user.username == "testuser"
        assert user.email == "test@example.com"
        assert user.role == "student"
        assert user.language == "en"
        assert user.created_at is not None

    def test_user_unique_constraints(self, db_session, sample_users):
        """Test unique constraints on username and email."""
        # Use the actual username from the fixture
        existing_username = sample_users["teachers"][0].username

        # Try to create user with existing username
        duplicate_user = User(
            username=existing_username,  # Already exists
            email="newemail@test.com",
            hashed_password="hashed_password",
            full_name="Duplicate User",
            role="student"
        )

        with pytest.raises(Exception):  # Should raise IntegrityError
            db_session.add(duplicate_user)
            db_session.commit()

    def test_user_class_relationship(self, db_session, sample_users, sample_class):
        """Test user-class relationship."""
        student = sample_users["students"][0]
        student.class_id = sample_class.id
        db_session.commit()

        # Refresh and check relationship
        db_session.refresh(student)
        assert student.student_class.id == sample_class.id
        assert student in sample_class.students

class TestContentModels:
    """Test content-related models."""

    def test_course_creation(self, db_session, sample_class):
        """Test creating courses."""
        course = Course(
            name="Test Course",
            description="Test description",
            subject="Test Subject",
            class_id=sample_class.id
        )
        db_session.add(course)
        db_session.commit()
        db_session.refresh(course)

        assert course.id is not None
        assert course.name == "Test Course"
        assert course.class_id == sample_class.id

    def test_unit_lesson_hierarchy(self, db_session, sample_course, sample_unit, sample_lesson):
        """Test the unit-lesson hierarchy."""
        # Verify relationships
        assert sample_unit.course_id == sample_course.id
        assert sample_lesson.unit_id == sample_unit.id

        # Test navigation
        assert sample_lesson.unit.course.name == "Algebra Fundamentals"

    def test_material_creation(self, db_session, sample_lesson):
        """Test creating materials."""
        material = Material(
            lesson_id=sample_lesson.id,
            name="Test Material",
            file_path="/uploads/test.pdf",
            content_type="pdf",
            language="en"
        )
        db_session.add(material)
        db_session.commit()
        db_session.refresh(material)

        assert material.id is not None
        assert material.lesson_id == sample_lesson.id
        assert material.content_type == "pdf"

class TestLearningModels:
    """Test learning-related models."""

    def test_question_creation(self, db_session, sample_lesson):
        """Test creating questions."""
        question = Question(
            lesson_id=sample_lesson.id,
            question_text="What is 2 + 2?",
            question_type="mcq",
            options=json.dumps(["3", "4", "5", "6"]),
            correct_answer="4",
            difficulty="easy",
            subject="Mathematics"
        )
        db_session.add(question)
        db_session.commit()
        db_session.refresh(question)

        assert question.id is not None
        assert question.question_type == "mcq"
        assert question.difficulty == "easy"
        assert question.subject == "Mathematics"

    def test_user_answer_creation(self, db_session, sample_users, sample_lesson):
        """Test creating user answers."""
        student = sample_users["students"][0]

        # First create a question
        question = Question(
            lesson_id=sample_lesson.id,
            question_text="Test question?",
            question_type="short_answer",
            correct_answer="test answer",
            difficulty="easy",
            subject="Test"
        )
        db_session.add(question)
        db_session.commit()

        # Create answer
        answer = UserAnswer(
            user_id=student.id,
            question_id=question.id,
            answer="test answer",
            is_correct=True,
            time_taken=45.5,
            hints_used=0
        )
        db_session.add(answer)
        db_session.commit()
        db_session.refresh(answer)

        assert answer.id is not None
        assert answer.is_correct == True
        assert answer.time_taken == 45.5

    def test_mastery_tracking(self, db_session, sample_users):
        """Test mastery score tracking."""
        student = sample_users["students"][0]

        mastery = Mastery(
            user_id=student.id,
            topic="Mathematics",
            score=85.5
        )
        db_session.add(mastery)
        db_session.commit()
        db_session.refresh(mastery)

        assert mastery.id is not None
        assert mastery.topic == "Mathematics"
        assert mastery.score == 85.5
        assert mastery.updated_at is not None

    def test_gamification_data(self, db_session, sample_users):
        """Test gamification data."""
        student = sample_users["students"][0]

        gamification = Gamification(
            user_id=student.id,
            points=150,
            badges=json.dumps(["Beginner", "Quick Learner"]),
            streak=5
        )
        db_session.add(gamification)
        db_session.commit()
        db_session.refresh(gamification)

        assert gamification.id is not None
        assert gamification.points == 150
        assert gamification.streak == 5

class TestAnalyticsModels:
    """Test analytics models."""

    def test_session_tracking(self, db_session, sample_users, sample_lesson):
        """Test session tracking."""
        student = sample_users["students"][0]

        start_time = datetime.utcnow()
        end_time = start_time + timedelta(minutes=45)

        session = Session(
            user_id=student.id,
            session_type="practice",
            start_time=start_time,
            end_time=end_time,
            duration=45.0,
            lesson_id=sample_lesson.id,
            questions_attempted=10,
            correct_answers=8
        )
        db_session.add(session)
        db_session.commit()
        db_session.refresh(session)

        assert session.id is not None
        assert session.session_type == "practice"
        assert session.duration == 45.0
        assert session.questions_attempted == 10
        assert session.correct_answers == 8

    def test_progress_tracking(self, db_session, sample_users, sample_lesson):
        """Test progress tracking."""
        student = sample_users["students"][0]

        progress = Progress(
            user_id=student.id,
            lesson_id=sample_lesson.id,
            completion_percentage=75.5,
            time_spent=120.0,
            status="in_progress"
        )
        db_session.add(progress)
        db_session.commit()
        db_session.refresh(progress)

        assert progress.id is not None
        assert progress.completion_percentage == 75.5
        assert progress.status == "in_progress"
        assert progress.last_accessed is not None

    def test_intervention_creation(self, db_session, sample_users, sample_lesson):
        """Test teacher interventions."""
        student = sample_users["students"][0]
        teacher = sample_users["teachers"][0]

        intervention = Intervention(
            student_id=student.id,
            teacher_id=teacher.id,
            intervention_type="remedial",
            description="Student needs help with basic concepts",
            lesson_id=sample_lesson.id,
            priority="high",
            status="pending"
        )
        db_session.add(intervention)
        db_session.commit()
        db_session.refresh(intervention)

        assert intervention.id is not None
        assert intervention.intervention_type == "remedial"
        assert intervention.priority == "high"
        assert intervention.status == "pending"
        assert intervention.created_at is not None

    def test_intervention_resolution(self, db_session, sample_users, sample_lesson):
        """Test intervention resolution."""
        student = sample_users["students"][0]
        teacher = sample_users["teachers"][0]

        intervention = Intervention(
            student_id=student.id,
            teacher_id=teacher.id,
            intervention_type="attention_needed",
            description="Student showing signs of disengagement",
            priority="medium",
            status="pending"
        )
        db_session.add(intervention)
        db_session.commit()

        # Resolve the intervention
        intervention.status = "resolved"
        intervention.resolved_at = datetime.utcnow()
        db_session.commit()

        assert intervention.status == "resolved"
        assert intervention.resolved_at is not None

class TestModelRelationships:
    """Test complex model relationships."""

    def test_complete_content_hierarchy(self, db_session, sample_users, sample_class):
        """Test the complete content hierarchy from class to material."""
        teacher = sample_users["teachers"][0]

        # Create course
        course = Course(
            name="Physics 101",
            description="Introduction to Physics",
            subject="Physics",
            class_id=sample_class.id
        )
        db_session.add(course)
        db_session.commit()

        # Create unit
        unit = Unit(name="Mechanics", course_id=course.id)
        db_session.add(unit)
        db_session.commit()

        # Create lesson
        lesson = Lesson(title="Newton's Laws", unit_id=unit.id)
        db_session.add(lesson)
        db_session.commit()

        # Create material
        material = Material(
            lesson_id=lesson.id,
            name="Newton's Laws Slides",
            file_path="/uploads/newton_slides.pdf",
            content_type="slide",
            language="en"
        )
        db_session.add(material)
        db_session.commit()

        # Test the complete hierarchy navigation
        assert material.lesson.title == "Newton's Laws"
        assert material.lesson.unit.name == "Mechanics"
        assert material.lesson.unit.course.name == "Physics 101"
        assert material.lesson.unit.course.class_.name == "Mathematics 101"  # Note: class is a reserved word

    def test_learning_analytics_integration(self, db_session, sample_users, sample_lesson):
        """Test integration between learning and analytics models."""
        student = sample_users["students"][0]

        # Create question
        question = Question(
            lesson_id=sample_lesson.id,
            question_text="Test question?",
            question_type="mcq",
            options=json.dumps(["A", "B", "C", "D"]),
            correct_answer="A",
            difficulty="medium",
            subject="Mathematics"
        )
        db_session.add(question)
        db_session.commit()

        # Create user answer
        answer = UserAnswer(
            user_id=student.id,
            question_id=question.id,
            answer="A",
            is_correct=True,
            time_taken=60.0,
            hints_used=1
        )
        db_session.add(answer)
        db_session.commit()

        # Create session
        session = Session(
            user_id=student.id,
            session_type="practice",
            start_time=datetime.utcnow() - timedelta(minutes=30),
            end_time=datetime.utcnow(),
            duration=30.0,
            lesson_id=sample_lesson.id,
            questions_attempted=5,
            correct_answers=4
        )
        db_session.add(session)
        db_session.commit()

        # Create progress
        progress = Progress(
            user_id=student.id,
            lesson_id=sample_lesson.id,
            completion_percentage=80.0,
            time_spent=1800.0,  # 30 minutes
            status="in_progress"
        )
        db_session.add(progress)
        db_session.commit()

        # Verify all relationships work
        assert answer.user.id == student.id
        assert answer.question.lesson.id == sample_lesson.id
        assert session.user.id == student.id
        assert progress.user.id == student.id
        assert progress.lesson.id == sample_lesson.id

class TestDataValidation:
    """Test data validation and constraints."""

    def test_required_fields(self, db_session):
        """Test that required fields cannot be null."""
        # Try to create user without required fields
        with pytest.raises(Exception):
            user = User()  # Missing all required fields
            db_session.add(user)
            db_session.commit()

    def test_foreign_key_constraints(self, db_session):
        """Test foreign key constraints."""
        # Enable foreign key constraints for SQLite
        if "sqlite" in str(db_session.bind.url):
            db_session.execute(text("PRAGMA foreign_keys=ON"))

        # Try to create course with invalid class_id
        with pytest.raises(Exception):
            course = Course(
                name="Invalid Course",
                subject="Test",
                class_id=99999  # Non-existent class ID
            )
            db_session.add(course)
            db_session.commit()

    def test_enum_like_fields(self, db_session, sample_users, sample_lesson):
        """Test fields that should have specific values."""
        student = sample_users["students"][0]

        # Test valid intervention types
        valid_types = ["remedial", "enrichment", "attention_needed"]
        for intervention_type in valid_types:
            intervention = Intervention(
                student_id=student.id,
                teacher_id=sample_users["teachers"][0].id,
                intervention_type=intervention_type,
                description=f"Test {intervention_type}",
                priority="medium",
                status="pending"
            )
            db_session.add(intervention)
            db_session.commit()

        # Verify all were created
        interventions = db_session.query(Intervention).filter(
            Intervention.student_id == student.id
        ).all()
        assert len(interventions) == len(valid_types)

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
