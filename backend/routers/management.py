from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from database import get_db
from models import User, Class, Course, Unit, Lesson, Mastery, Session as UserSession
from routers.auth import get_current_user

router = APIRouter()

# Pydantic models
class TeacherSummary(BaseModel):
    id: int
    username: str
    full_name: str
    email: str
    class_count: int
    student_count: int
    created_at: str

class StudentSummary(BaseModel):
    id: int
    username: str
    full_name: str
    email: str
    class_name: Optional[str]
    teacher_name: Optional[str]
    mastery_score: float
    created_at: str

class ClassSummary(BaseModel):
    id: int
    name: str
    subject: str
    teacher_name: str
    student_count: int
    course_count: int
    created_at: str

class LessonSummary(BaseModel):
    id: int
    title: str
    unit_name: str
    course_name: str
    class_name: str
    teacher_name: str
    question_count: int
    created_at: str

class ManagementOverview(BaseModel):
    total_teachers: int
    total_students: int
    total_classes: int
    total_lessons: int
    active_students_today: int
    average_mastery_score: float

# Management endpoints
@router.get(
    "/overview",
    response_model=ManagementOverview,
    summary="Get Management Overview",
    description="""
    Retrieve comprehensive overview statistics for the entire platform including:

    - **Total Teachers**: Number of teachers in the system
    - **Total Students**: Number of students in the system
    - **Total Classes**: Number of classes created
    - **Total Lessons**: Number of lessons available
    - **Active Students Today**: Students who had learning sessions today
    - **Average Mastery Score**: Overall platform performance across all topics

    **Note**: Only managers can access this endpoint.
    """,
    responses={
        200: {"description": "Management overview retrieved successfully"},
        403: {"description": "Access denied - Only managers can view overview"}
    }
)
def get_management_overview(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get comprehensive overview for managers."""
    if current_user.role != "manager":
        raise HTTPException(status_code=403, detail="Only managers can access management overview")

    # Get basic counts
    total_teachers = db.query(func.count(User.id)).filter(User.role == "teacher").scalar()
    total_students = db.query(func.count(User.id)).filter(User.role == "student").scalar()
    total_classes = db.query(func.count(Class.id)).scalar()
    total_lessons = db.query(func.count(Lesson.id)).scalar()

    # Active students today
    from datetime import datetime, timedelta
    today = datetime.utcnow().date()
    student_ids_subquery = db.query(User.id).filter(User.role == "student").subquery()
    active_students_today = db.query(func.count(func.distinct(UserSession.user_id))).filter(
        UserSession.user_id.in_(student_ids_subquery),
        func.date(UserSession.start_time) == today
    ).scalar()

    # Average mastery score across all students
    avg_mastery = db.query(func.avg(Mastery.score)).filter(
        Mastery.user_id.in_(student_ids_subquery)
    ).scalar() or 0.0

    return ManagementOverview(
        total_teachers=total_teachers,
        total_students=total_students,
        total_classes=total_classes,
        total_lessons=total_lessons,
        active_students_today=active_students_today,
        average_mastery_score=round(avg_mastery, 1)
    )

@router.get(
    "/teachers",
    response_model=List[TeacherSummary],
    summary="List All Teachers",
    description="""
    Retrieve a list of all teachers with their statistics including:

    - **Basic Info**: Username, full name, email
    - **Class Count**: Number of classes they teach
    - **Student Count**: Total number of students in their classes

    **Note**: Only managers can access this endpoint.
    """,
    responses={
        200: {"description": "Teachers list retrieved successfully"},
        403: {"description": "Access denied - Only managers can view teachers"}
    }
)
def get_all_teachers(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get list of all teachers with their statistics."""
    if current_user.role != "manager":
        raise HTTPException(status_code=403, detail="Only managers can access teachers list")

    teachers = db.query(User).filter(User.role == "teacher").all()
    result = []

    for teacher in teachers:
        # Count classes taught by this teacher
        class_count = db.query(func.count(Class.id)).filter(Class.teacher_id == teacher.id).scalar()

        # Count students in those classes
        teacher_class_ids = [c.id for c in db.query(Class.id).filter(Class.teacher_id == teacher.id).all()]
        student_count = db.query(func.count(User.id)).filter(User.class_id.in_(teacher_class_ids)).scalar() if teacher_class_ids else 0

        result.append(TeacherSummary(
            id=teacher.id,
            username=teacher.username,
            full_name=teacher.full_name,
            email=teacher.email,
            class_count=class_count,
            student_count=student_count,
            created_at=teacher.created_at.isoformat()
        ))

    return result

@router.get(
    "/students",
    response_model=List[StudentSummary],
    summary="List All Students",
    description="""
    Retrieve a list of all students with their class assignments and performance:

    - **Basic Info**: Username, full name, email
    - **Class & Teacher**: Their assigned class and teacher
    - **Mastery Score**: Average performance across all topics

    **Note**: Only managers can access this endpoint.
    """,
    responses={
        200: {"description": "Students list retrieved successfully"},
        403: {"description": "Access denied - Only managers can view students"}
    }
)
def get_all_students(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get list of all students with their assignments and performance."""
    if current_user.role != "manager":
        raise HTTPException(status_code=403, detail="Only managers can access students list")

    students = db.query(User).filter(User.role == "student").all()
    result = []

    for student in students:
        # Get class and teacher info
        class_name = None
        teacher_name = None
        if student.student_class:
            class_name = student.student_class.name
            teacher_name = student.student_class.teacher.full_name

        # Get average mastery score
        avg_mastery = db.query(func.avg(Mastery.score)).filter(
            Mastery.user_id == student.id
        ).scalar() or 0.0

        result.append(StudentSummary(
            id=student.id,
            username=student.username,
            full_name=student.full_name,
            email=student.email,
            class_name=class_name,
            teacher_name=teacher_name,
            mastery_score=round(avg_mastery, 1),
            created_at=student.created_at.isoformat()
        ))

    return result

@router.get(
    "/classes",
    response_model=List[ClassSummary],
    summary="List All Classes",
    description="""
    Retrieve a list of all classes with enrollment and content statistics:

    - **Basic Info**: Class name and subject
    - **Teacher**: The teacher assigned to the class
    - **Enrollment**: Number of students enrolled
    - **Content**: Number of courses in the class

    **Note**: Only managers can access this endpoint.
    """,
    responses={
        200: {"description": "Classes list retrieved successfully"},
        403: {"description": "Access denied - Only managers can view classes"}
    }
)
def get_all_classes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get list of all classes with their statistics."""
    if current_user.role != "manager":
        raise HTTPException(status_code=403, detail="Only managers can access classes list")

    classes = db.query(Class).all()
    result = []

    for class_obj in classes:
        # Count students in this class
        student_count = db.query(func.count(User.id)).filter(User.class_id == class_obj.id).scalar()

        # Count courses in this class
        course_count = db.query(func.count(Course.id)).filter(Course.class_id == class_obj.id).scalar()

        result.append(ClassSummary(
            id=class_obj.id,
            name=class_obj.name,
            subject=class_obj.subject,
            teacher_name=class_obj.teacher.full_name,
            student_count=student_count,
            course_count=course_count,
            created_at=class_obj.created_at.isoformat()
        ))

    return result

@router.get(
    "/lessons",
    response_model=List[LessonSummary],
    summary="List All Lessons",
    description="""
    Retrieve a list of all lessons with their hierarchical relationships:

    - **Lesson Info**: Title and creation date
    - **Hierarchy**: Unit → Course → Class → Teacher
    - **Content**: Number of questions in the lesson

    **Note**: Only managers can access this endpoint.
    """,
    responses={
        200: {"description": "Lessons list retrieved successfully"},
        403: {"description": "Access denied - Only managers can view lessons"}
    }
)
def get_all_lessons(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get list of all lessons with their relationships."""
    if current_user.role != "manager":
        raise HTTPException(status_code=403, detail="Only managers can access lessons list")

    from models import Question
    lessons = db.query(Lesson).join(Unit).join(Course).join(Class).all()
    result = []

    for lesson in lessons:
        # Count questions in this lesson
        question_count = db.query(func.count(Question.id)).filter(Question.lesson_id == lesson.id).scalar()

        # Get hierarchical info
        unit = lesson.unit
        course = unit.course
        class_obj = course.class_

        result.append(LessonSummary(
            id=lesson.id,
            title=lesson.title,
            unit_name=unit.name,
            course_name=course.name,
            class_name=class_obj.name,
            teacher_name=class_obj.teacher.full_name,
            question_count=question_count,
            created_at=lesson.created_at.isoformat()
        ))

    return result
