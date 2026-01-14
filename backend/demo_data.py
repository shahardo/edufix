#!/usr/bin/env python3
"""
Demo data generation script for EduFix Phase 1B.
Generates fake demo data for testing and development.
"""

from faker import Faker
from sqlalchemy.orm import sessionmaker
import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.dirname(__file__))

from database import engine, get_db
from models import (
    User, Class, Course, Unit, Lesson, Material, Question,
    UserAnswer, Mastery, Gamification, Session, Progress, Intervention
)
from passlib.context import CryptContext
import random
from datetime import datetime, timedelta

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

fake = Faker(['en_US', 'he_IL'])
fake.seed_instance(42)  # For reproducible results

def hash_password(password: str) -> str:
    """Hash a password."""
    return pwd_context.hash(password)

def create_demo_users(db):
    """Create demo users (teachers and students)."""
    print("Creating demo users...")

    # Check if users already exist
    existing_users = db.query(User).count()
    if existing_users > 0:
        print(f"Users already exist ({existing_users} found), skipping user creation")
        teachers = db.query(User).filter(User.role == "teacher").all()
        students = db.query(User).filter(User.role == "student").all()
        return teachers, students

    # Create teachers
    teachers = []
    for i in range(3):
        teacher = User(
            username=f"teacher{i+1}",
            email=f"teacher{i+1}@edufix.edu",
            hashed_password=hash_password("password123"),
            full_name=fake.name(),
            role="teacher",
            language=random.choice(["en", "he"])
        )
        db.add(teacher)
        teachers.append(teacher)

    # Create students
    students = []
    for i in range(30):
        student = User(
            username=f"student{i+1}",
            email=f"student{i+1}@edufix.edu",
            hashed_password=hash_password("password123"),
            full_name=fake.name(),
            role="student",
            language=random.choice(["en", "he"])
        )
        db.add(student)
        students.append(student)

    db.commit()
    print(f"Created {len(teachers)} teachers and {len(students)} students")
    return teachers, students

def create_demo_classes(db, teachers, students):
    """Create demo classes."""
    print("Creating demo classes...")

    classes = []
    subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "History", "Literature"]

    for i, teacher in enumerate(teachers):
        # Create 1-2 classes per teacher
        num_classes = random.randint(1, 2)
        for j in range(num_classes):
            class_obj = Class(
                name=f"{subjects[(i*2+j) % len(subjects)]} Class {j+1}",
                subject=subjects[(i*2+j) % len(subjects)],
                teacher_id=teacher.id
            )
            db.add(class_obj)
            classes.append(class_obj)

    db.commit()

    # Assign students to classes
    for student in students:
        # Each student belongs to 1-2 classes
        student_classes = random.sample(classes, random.randint(1, min(2, len(classes))))
        for class_obj in student_classes:
            student.class_id = class_obj.id
            break  # For now, assign to first class only

    db.commit()
    print(f"Created {len(classes)} classes")
    return classes

def create_demo_courses(db, classes):
    """Create demo courses."""
    print("Creating demo courses...")

    courses = []
    for class_obj in classes:
        # Create 2-4 courses per class
        num_courses = random.randint(2, 4)
        for i in range(num_courses):
            course = Course(
                name=f"{class_obj.subject} Course {i+1}",
                description=fake.text(max_nb_chars=200),
                subject=class_obj.subject,
                class_id=class_obj.id
            )
            db.add(course)
            courses.append(course)

    db.commit()
    print(f"Created {len(courses)} courses")
    return courses

def create_demo_units_and_lessons(db, courses):
    """Create demo units and lessons."""
    print("Creating demo units and lessons...")

    lessons = []
    for course in courses:
        # Create 3-6 units per course
        num_units = random.randint(3, 6)
        for i in range(num_units):
            unit = Unit(
                name=f"Unit {i+1}: {fake.words(nb=2, ext_word_list=['Fundamentals', 'Advanced', 'Applications', 'Theory', 'Practice'])}",
                course_id=course.id
            )
            db.add(unit)
            db.commit()  # Commit to get unit.id

            # Create 4-8 lessons per unit
            num_lessons = random.randint(4, 8)
            for j in range(num_lessons):
                lesson = Lesson(
                    title=f"Lesson {j+1}: {fake.sentence(nb_words=4)}",
                    unit_id=unit.id
                )
                db.add(lesson)
                lessons.append(lesson)

    db.commit()
    print(f"Created units and {len(lessons)} lessons")
    return lessons

def create_demo_materials(db, lessons):
    """Create demo materials."""
    print("Creating demo materials...")

    materials = []
    content_types = ["slide", "pdf", "video", "document"]

    for lesson in lessons:
        # Create 1-3 materials per lesson
        num_materials = random.randint(1, 3)
        for i in range(num_materials):
            material = Material(
                lesson_id=lesson.id,
                name=f"{lesson.title} - Material {i+1}",
                file_path=f"uploads/demo/{lesson.id}/material_{i+1}.{random.choice(['pdf', 'pptx', 'docx', 'mp4'])}",
                content_type=random.choice(content_types),
                language=random.choice(["en", "he"])
            )
            db.add(material)
            materials.append(material)

    db.commit()
    print(f"Created {len(materials)} materials")
    return materials

def create_demo_questions(db, lessons):
    """Create demo questions."""
    print("Creating demo questions...")

    questions = []
    subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"]

    for lesson in lessons:
        # Create 5-15 questions per lesson
        num_questions = random.randint(5, 15)
        for i in range(num_questions):
            question_type = random.choice(["mcq", "short_answer"])
            options = None
            correct_answer = fake.sentence(nb_words=3)

            if question_type == "mcq":
                options = '["' + '","'.join([fake.word() for _ in range(4)]) + '"]'
                correct_answer = fake.word()

            question = Question(
                lesson_id=lesson.id,
                question_text=fake.sentence(nb_words=10) + "?",
                question_type=question_type,
                options=options,
                correct_answer=correct_answer,
                difficulty=random.choice(["easy", "medium", "hard"]),
                subject=random.choice(subjects)
            )
            db.add(question)
            questions.append(question)

    db.commit()
    print(f"Created {len(questions)} questions")
    return questions

def create_demo_user_answers_and_mastery(db, questions, students):
    """Create demo user answers and mastery data."""
    print("Creating demo user answers and mastery...")

    for student in students:
        # Each student answers some questions
        num_answers = random.randint(20, 100)
        answered_questions = random.sample(questions, min(num_answers, len(questions)))

        for question in answered_questions:
            is_correct = random.choice([True, False])
            time_taken = random.uniform(30, 300)  # 30 seconds to 5 minutes

            answer = UserAnswer(
                user_id=student.id,
                question_id=question.id,
                answer=fake.sentence(nb_words=5) if not is_correct else question.correct_answer,
                is_correct=is_correct,
                time_taken=time_taken,
                hints_used=random.randint(0, 3)
            )
            db.add(answer)

        # Create mastery records
        topics = set(q.subject for q in answered_questions)
        for topic in topics:
            topic_questions = [q for q in answered_questions if q.subject == topic]
            correct_count = sum(1 for q in topic_questions if random.choice([True, False]))
            score = (correct_count / len(topic_questions)) * 100 if topic_questions else 0

            mastery = Mastery(
                user_id=student.id,
                topic=topic,
                score=min(100, score + random.uniform(-10, 10))  # Add some variation
            )
            db.add(mastery)

    db.commit()
    print("Created user answers and mastery data")

def create_demo_gamification(db, students):
    """Create demo gamification data."""
    print("Creating demo gamification data...")

    # Check if gamification data already exists
    existing_gamification = db.query(Gamification).count()
    if existing_gamification > 0:
        print(f"Gamification data already exists ({existing_gamification} records found), skipping gamification creation")
        return

    for student in students:
        gamification = Gamification(
            user_id=student.id,
            points=random.randint(100, 2000),
            badges='["Beginner", "Consistent Learner", "Question Master"]',
            streak=random.randint(0, 30)
        )
        db.add(gamification)

    db.commit()
    print("Created gamification data")

def create_demo_sessions(db, students, lessons):
    """Create demo session data."""
    print("Creating demo session data...")

    session_types = ["practice", "lesson", "homework"]

    for student in students:
        # Create 5-20 sessions per student
        num_sessions = random.randint(5, 20)
        for i in range(num_sessions):
            start_time = fake.date_time_between(start_date="-30d", end_date="now")
            duration = random.uniform(15, 120)  # 15 minutes to 2 hours
            end_time = start_time + timedelta(minutes=duration)

            lesson_id = random.choice(lessons).id if random.choice([True, False]) else None

            session = Session(
                user_id=student.id,
                session_type=random.choice(session_types),
                start_time=start_time,
                end_time=end_time,
                duration=duration,
                lesson_id=lesson_id,
                questions_attempted=random.randint(0, 20),
                correct_answers=random.randint(0, 20)
            )
            db.add(session)

    db.commit()
    print("Created session data")

def create_demo_progress(db, students, lessons):
    """Create demo progress data."""
    print("Creating demo progress data...")

    for student in students:
        # Each student has progress for some lessons
        student_lessons = random.sample(lessons, random.randint(5, min(20, len(lessons))))

        for lesson in student_lessons:
            progress = Progress(
                user_id=student.id,
                lesson_id=lesson.id,
                completion_percentage=random.uniform(0, 100),
                time_spent=random.uniform(10, 300),  # 10 minutes to 5 hours
                status=random.choice(["not_started", "in_progress", "completed"])
            )
            db.add(progress)

    db.commit()
    print("Created progress data")

def create_demo_interventions(db, students, teachers, lessons):
    """Create demo intervention data."""
    print("Creating demo intervention data...")

    intervention_types = ["remedial", "enrichment", "attention_needed"]
    priorities = ["low", "medium", "high"]
    statuses = ["pending", "in_progress", "resolved"]

    # Create 10-20 interventions
    num_interventions = random.randint(10, 20)
    for i in range(num_interventions):
        student = random.choice(students)
        teacher = random.choice(teachers)
        lesson = random.choice(lessons) if random.choice([True, False]) else None

        intervention = Intervention(
            student_id=student.id,
            teacher_id=teacher.id,
            intervention_type=random.choice(intervention_types),
            description=fake.sentence(nb_words=15),
            lesson_id=lesson.id if lesson else None,
            priority=random.choice(priorities),
            status=random.choice(statuses)
        )

        # Set resolved_at if status is resolved
        if intervention.status == "resolved":
            intervention.resolved_at = fake.date_time_between(start_date="-14d", end_date="now")

        db.add(intervention)

    db.commit()
    print("Created intervention data")

def main():
    """Main function to generate all demo data."""
    print("Starting demo data generation...")

    # Create database session
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    try:
        # Create demo data in order
        teachers, students = create_demo_users(db)
        classes = create_demo_classes(db, teachers, students)
        courses = create_demo_courses(db, classes)
        lessons = create_demo_units_and_lessons(db, courses)
        materials = create_demo_materials(db, lessons)
        questions = create_demo_questions(db, lessons)

        create_demo_user_answers_and_mastery(db, questions, students)
        create_demo_gamification(db, students)
        create_demo_sessions(db, students, lessons)
        create_demo_progress(db, students, lessons)
        create_demo_interventions(db, students, teachers, lessons)

        print("Demo data generation completed successfully!")

    except Exception as e:
        print(f"Error generating demo data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
