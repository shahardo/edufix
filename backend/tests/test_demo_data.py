import pytest
import sys
import os
import json

# Add the parent directory to the path so we can import modules
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, engine
from models import (
    User, Class, Course, Unit, Lesson, Material, Question, UserAnswer,
    Mastery, Gamification, Session, Progress, Intervention
)

class TestDemoDataValidation:
    """Test that demo data was created correctly."""

    def test_user_counts(self):
        """Test that the correct number of users were created."""
        # Create session with the main database (not test database)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()

        try:
            teacher_count = db.query(User).filter(User.role == "teacher").count()
            student_count = db.query(User).filter(User.role == "student").count()
            total_users = db.query(User).count()

            assert teacher_count == 3, f"Expected 3 teachers, got {teacher_count}"
            assert student_count == 30, f"Expected 30 students, got {student_count}"
            assert total_users == 33, f"Expected 33 total users, got {total_users}"
        finally:
            db.close()

    def test_class_structure(self):
        """Test that classes were created correctly."""
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()

        try:
            class_count = db.query(Class).count()
            assert class_count >= 4, f"Expected at least 4 classes, got {class_count}"

            # Check that each class has a teacher
            classes = db.query(Class).limit(10).all()  # Check first 10 classes
            for class_obj in classes:
                assert class_obj.teacher is not None, f"Class {class_obj.name} has no teacher"
                assert class_obj.teacher.role == "teacher", f"Class teacher is not actually a teacher"

            # Check that we have the expected subjects (at least some of them)
            subjects = db.query(Class.subject).distinct().all()
            subjects = [s[0] for s in subjects]
            expected_subjects = ["Mathematics", "Physics", "Chemistry", "Biology"]
            # Check that at least some expected subjects exist
            assert len(set(subjects) & set(expected_subjects)) > 0, f"Expected to find some subjects from {expected_subjects}, got {subjects}"
        finally:
            db.close()

    def test_course_hierarchy(self):
        """Test the course-unit-lesson hierarchy."""
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()

        try:
            # Test course counts
            course_count = db.query(Course).count()
            assert course_count >= 10, f"Expected at least 10 courses, got {course_count}"

            # Test unit counts
            unit_count = db.query(Unit).count()
            assert unit_count >= 30, f"Expected at least 30 units, got {unit_count}"

            # Test lesson counts
            lesson_count = db.query(Lesson).count()
            assert lesson_count >= 300, f"Expected at least 300 lessons, got {lesson_count}"

            # Test relationships
            courses = db.query(Course).limit(5).all()
            for course in courses:
                assert len(course.units) > 0, f"Course {course.name} has no units"
                for unit in course.units:
                    assert len(unit.lessons) > 0, f"Unit {unit.name} has no lessons"
        finally:
            db.close()

    def test_material_distribution(self):
        """Test that materials are properly distributed."""
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()

        try:
            material_count = db.query(Material).count()
            assert material_count >= 600, f"Expected at least 600 materials, got {material_count}"

            # Check content types
            content_types = db.query(Material.content_type).distinct().all()
            content_types = [ct[0] for ct in content_types]
            expected_types = ["slide", "pdf", "video", "document"]
            assert set(content_types).issubset(set(expected_types)), f"Unexpected content types: {content_types}"

            # Check that each lesson has materials
            lessons_with_materials = db.query(Lesson).join(Material).distinct().count()
            total_lessons = db.query(Lesson).count()
            assert lessons_with_materials == total_lessons, "Some lessons have no materials"
        finally:
            db.close()

    def test_question_distribution(self):
        """Test question creation and distribution."""
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()

        try:
            question_count = db.query(Question).count()
            assert question_count >= 3000, f"Expected at least 3000 questions, got {question_count}"

            # Check question types
            question_types = db.query(Question.question_type).distinct().all()
            question_types = [qt[0] for qt in question_types]
            assert "mcq" in question_types, "Missing MCQ questions"
            assert "short_answer" in question_types, "Missing short answer questions"

            # Check difficulty distribution
            difficulties = db.query(Question.difficulty).distinct().all()
            difficulties = [d[0] for d in difficulties]
            expected_difficulties = ["easy", "medium", "hard"]
            assert set(difficulties) == set(expected_difficulties), f"Expected difficulties {expected_difficulties}, got {difficulties}"

            # Check subject distribution
            subjects = db.query(Question.subject).distinct().all()
            subjects = [s[0] for s in subjects]
            expected_subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"]
            assert set(subjects).issubset(set(expected_subjects)), f"Unexpected subjects: {subjects}"
        finally:
            db.close()

    def test_user_answers_and_mastery(self):
        """Test user answers and mastery data."""
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()

        try:
            # Test user answers
            answer_count = db.query(UserAnswer).count()
            assert answer_count > 0, "No user answers found"

            # Test mastery records
            mastery_count = db.query(Mastery).count()
            assert mastery_count > 0, "No mastery records found"

            # Check that mastery scores are reasonable
            masteries = db.query(Mastery).limit(10).all()
            for mastery in masteries:
                assert 0 <= mastery.score <= 100, f"Invalid mastery score: {mastery.score}"
        finally:
            db.close()

    def test_gamification_data(self):
        """Test gamification data creation."""
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()

        try:
            gamification_count = db.query(Gamification).count()
            student_count = db.query(User).filter(User.role == "student").count()
            assert gamification_count >= student_count, f"Expected at least {student_count} gamification records, got {gamification_count}"

            # Check gamification data
            gamifications = db.query(Gamification).limit(5).all()
            for gamification in gamifications:
                assert gamification.points >= 0, f"Negative points: {gamification.points}"
                assert gamification.streak >= 0, f"Negative streak: {gamification.streak}"
                # Check badges is valid JSON
                badges = json.loads(gamification.badges)
                assert isinstance(badges, list), f"Badges is not a list: {badges}"
        finally:
            db.close()

    def test_session_tracking(self):
        """Test session tracking data."""
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()

        try:
            session_count = db.query(Session).count()
            assert session_count > 0, "No sessions found"

            # Check session data
            sessions = db.query(Session).limit(10).all()
            for session in sessions:
                assert session.duration > 0, f"Invalid session duration: {session.duration}"
                assert session.questions_attempted >= 0, f"Negative questions attempted: {session.questions_attempted}"
                assert session.correct_answers >= 0, f"Negative correct answers: {session.correct_answers}"
                assert session.session_type in ["practice", "lesson", "homework"], f"Invalid session type: {session.session_type}"
        finally:
            db.close()

    def test_progress_tracking(self):
        """Test progress tracking data."""
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()

        try:
            progress_count = db.query(Progress).count()
            assert progress_count > 0, "No progress records found"

            # Check progress data
            progresses = db.query(Progress).limit(10).all()
            for progress in progresses:
                assert 0 <= progress.completion_percentage <= 100, f"Invalid completion percentage: {progress.completion_percentage}"
                assert progress.time_spent >= 0, f"Negative time spent: {progress.time_spent}"
                assert progress.status in ["not_started", "in_progress", "completed"], f"Invalid status: {progress.status}"
        finally:
            db.close()

    def test_intervention_system(self):
        """Test teacher intervention system."""
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()

        try:
            intervention_count = db.query(Intervention).count()
            assert intervention_count > 0, "No interventions found"

            # Check intervention data
            interventions = db.query(Intervention).limit(10).all()
            for intervention in interventions:
                assert intervention.intervention_type in ["remedial", "enrichment", "attention_needed"], f"Invalid intervention type: {intervention.intervention_type}"
                assert intervention.priority in ["low", "medium", "high"], f"Invalid priority: {intervention.priority}"
                assert intervention.status in ["pending", "in_progress", "resolved"], f"Invalid status: {intervention.status}"

                # Check relationships
                assert intervention.student is not None, "Intervention has no student"
                assert intervention.teacher is not None, "Intervention has no teacher"
                assert intervention.student.role == "student", "Intervention student is not actually a student"
                assert intervention.teacher.role == "teacher", "Intervention teacher is not actually a teacher"
        finally:
            db.close()

    def test_data_integrity(self):
        """Test overall data integrity and relationships."""
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()

        try:
            # Test that all foreign keys are valid
            # Check courses reference valid classes
            invalid_courses = db.query(Course).join(Class, Course.class_id == Class.id, isouter=True).filter(Class.id.is_(None)).count()
            assert invalid_courses == 0, f"Found {invalid_courses} courses with invalid class references"

            # Check units reference valid courses
            invalid_units = db.query(Unit).join(Course, Unit.course_id == Course.id, isouter=True).filter(Course.id.is_(None)).count()
            assert invalid_units == 0, f"Found {invalid_units} units with invalid course references"

            # Check lessons reference valid units
            invalid_lessons = db.query(Lesson).join(Unit, Lesson.unit_id == Unit.id, isouter=True).filter(Unit.id.is_(None)).count()
            assert invalid_lessons == 0, f"Found {invalid_lessons} lessons with invalid unit references"

            # Check materials reference valid lessons
            invalid_materials = db.query(Material).join(Lesson, Material.lesson_id == Lesson.id, isouter=True).filter(Lesson.id.is_(None)).count()
            assert invalid_materials == 0, f"Found {invalid_materials} materials with invalid lesson references"

            # Check questions reference valid lessons
            invalid_questions = db.query(Question).join(Lesson, Question.lesson_id == Lesson.id, isouter=True).filter(Lesson.id.is_(None)).count()
            assert invalid_questions == 0, f"Found {invalid_questions} questions with invalid lesson references"

            print("All data integrity checks passed!")

        finally:
            db.close()

    def test_performance_data(self):
        """Test that the demo data provides good performance test coverage."""
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()

        try:
            # Count various entities
            stats = {
                "users": db.query(User).count(),
                "classes": db.query(Class).count(),
                "courses": db.query(Course).count(),
                "units": db.query(Unit).count(),
                "lessons": db.query(Lesson).count(),
                "materials": db.query(Material).count(),
                "questions": db.query(Question).count(),
                "user_answers": db.query(UserAnswer).count(),
                "mastery_records": db.query(Mastery).count(),
                "gamification_records": db.query(Gamification).count(),
                "sessions": db.query(Session).count(),
                "progress_records": db.query(Progress).count(),
                "interventions": db.query(Intervention).count()
            }

            print("Demo Data Statistics:")
            for key, value in stats.items():
                print(f"  {key}: {value}")

            # Ensure we have substantial data for testing
            assert stats["users"] >= 30, "Need at least 30 users for meaningful testing"
            assert stats["lessons"] >= 300, "Need at least 300 lessons for meaningful testing"
            assert stats["questions"] >= 3000, "Need at least 3000 questions for meaningful testing"
            assert stats["user_answers"] >= 1000, "Need at least 1000 user answers for meaningful testing"

        finally:
            db.close()

if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
