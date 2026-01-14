from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))
from database import Base

class User(Base):
    """User model for students and teachers."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, nullable=False)  # "student" or "teacher"
    language = Column(String, default="en")  # "en" or "he"
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=True)  # For students
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    student_class = relationship("Class", back_populates="students", foreign_keys=[class_id])
    teacher_classes = relationship("Class", back_populates="teacher", foreign_keys="Class.teacher_id")

class Class(Base):
    """Class model."""
    __tablename__ = "classes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    teacher = relationship("User", back_populates="teacher_classes", foreign_keys=[teacher_id])
    students = relationship("User", back_populates="student_class", foreign_keys="User.class_id")

class Course(Base):
    """Course model."""
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    subject = Column(String, nullable=False)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    class_ = relationship("Class", backref="courses")

class Unit(Base):
    """Unit within a course."""
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    course = relationship("Course", backref="units")
    lessons = relationship("Lesson", backref="unit")

class Lesson(Base):
    """Lesson model."""
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    unit_id = Column(Integer, ForeignKey("units.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    materials = relationship("Material", backref="lesson")
    questions = relationship("Question", backref="lesson")

class Material(Base):
    """Teaching material (slides, PDFs, etc.)."""
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)  # Path to uploaded file
    content_type = Column(String, nullable=False)  # "slide", "pdf", "video", etc.
    language = Column(String, default="en")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Question(Base):
    """Question for practice."""
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    question_text = Column(Text, nullable=False)
    question_type = Column(String, nullable=False)  # "mcq", "short_answer", etc.
    options = Column(Text)  # JSON string for multiple choice
    correct_answer = Column(Text, nullable=False)
    difficulty = Column(String, default="medium")  # "easy", "medium", "hard"
    subject = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class UserAnswer(Base):
    """User answers to questions."""
    __tablename__ = "user_answers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    answer = Column(Text, nullable=False)
    is_correct = Column(Boolean, nullable=False)
    time_taken = Column(Float)  # seconds
    hints_used = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", backref="answers")
    question = relationship("Question", backref="answers")

class Mastery(Base):
    """Mastery scores per topic."""
    __tablename__ = "masteries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    topic = Column(String, nullable=False)
    score = Column(Float, nullable=False)  # 0-100
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", backref="masteries")

class Gamification(Base):
    """Gamification data."""
    __tablename__ = "gamifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    points = Column(Integer, default=0)
    badges = Column(Text)  # JSON string
    streak = Column(Integer, default=0)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

class Session(Base):
    """User session tracking for analytics."""
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    session_type = Column(String, nullable=False)  # "practice", "lesson", "homework"
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True))
    duration = Column(Float)  # minutes
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    questions_attempted = Column(Integer, default=0)
    correct_answers = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", backref="sessions")
    lesson = relationship("Lesson", backref="sessions")

class Progress(Base):
    """Student progress tracking."""
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    completion_percentage = Column(Float, default=0.0)  # 0-100
    time_spent = Column(Float, default=0.0)  # minutes
    last_accessed = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="not_started")  # "not_started", "in_progress", "completed"

    # Relationships
    user = relationship("User", backref="progress")
    lesson = relationship("Lesson", backref="progress")

class Intervention(Base):
    """Teacher interventions and recommendations."""
    __tablename__ = "interventions"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    intervention_type = Column(String, nullable=False)  # "remedial", "enrichment", "attention_needed"
    description = Column(Text, nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    priority = Column(String, default="medium")  # "low", "medium", "high"
    status = Column(String, default="pending")  # "pending", "in_progress", "resolved"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    resolved_at = Column(DateTime(timezone=True))

    # Relationships
    student = relationship("User", foreign_keys=[student_id], backref="student_interventions")
    teacher = relationship("User", foreign_keys=[teacher_id], backref="teacher_interventions")
    lesson = relationship("Lesson", backref="interventions")
