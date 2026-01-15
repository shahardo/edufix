from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from pydantic import BaseModel
from database import get_db
from models import User, Class, Session as UserSession, Progress, Mastery, Gamification, Intervention, UserAnswer
from routers.auth import get_current_user

router = APIRouter()

# Pydantic models
class DashboardMetrics(BaseModel):
    total_students: int
    active_students_today: int
    average_mastery_score: float
    total_questions_attempted: int
    completion_rate: float
    top_performing_students: List[Dict[str, Any]]

class StudentInsight(BaseModel):
    student_id: int
    student_name: str
    mastery_scores: Dict[str, float]
    recent_activity: List[Dict[str, Any]]
    progress_rate: float
    recommendations: List[str]

class ClassProgress(BaseModel):
    lesson_id: int
    lesson_title: str
    average_completion: float
    struggling_students: int
    completed_students: int

class InterventionSummary(BaseModel):
    id: int
    student_name: str
    intervention_type: str
    priority: str
    status: str
    description: str
    created_at: datetime

class InterventionCreate(BaseModel):
    student_id: int
    intervention_type: str
    description: str
    priority: str = "medium"
    lesson_id: Optional[int] = None

# Analytics endpoints
@router.get("/dashboard", response_model=DashboardMetrics)
def get_teacher_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get dashboard metrics for teachers."""
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can access dashboard")

    # Get teacher's classes
    teacher_classes = db.query(Class).filter(Class.teacher_id == current_user.id).all()
    class_ids = [c.id for c in teacher_classes]

    if not class_ids:
        return DashboardMetrics(
            total_students=0,
            active_students_today=0,
            average_mastery_score=0.0,
            total_questions_attempted=0,
            completion_rate=0.0,
            top_performing_students=[]
        )

    # Get students in teacher's classes
    students = db.query(User).filter(User.class_id.in_(class_ids)).all()
    student_ids = [s.id for s in students]

    # Total students
    total_students = len(students)

    # Active students today (students who had sessions today)
    today = datetime.utcnow().date()
    active_students_today = db.query(UserSession).filter(
        UserSession.user_id.in_(student_ids),
        func.date(UserSession.start_time) == today
    ).distinct(UserSession.user_id).count()

    # Average mastery score
    avg_mastery = db.query(func.avg(Mastery.score)).filter(
        Mastery.user_id.in_(student_ids)
    ).scalar() or 0.0

    # Total questions attempted
    total_questions = db.query(func.count(UserAnswer.id)).filter(
        UserAnswer.user_id.in_(student_ids)
    ).scalar()

    # Completion rate (students who completed at least one lesson)
    completed_students = db.query(Progress).filter(
        Progress.user_id.in_(student_ids),
        Progress.status == "completed"
    ).distinct(Progress.user_id).count()

    completion_rate = (completed_students / total_students * 100) if total_students > 0 else 0.0

    # Top performing students (by average mastery)
    top_students = db.query(
        User.id,
        User.full_name,
        func.avg(Mastery.score).label('avg_mastery')
    ).join(Mastery).filter(
        User.id.in_(student_ids)
    ).group_by(User.id, User.full_name).order_by(
        desc('avg_mastery')
    ).limit(5).all()

    top_performing_students = [
        {"id": s.id, "name": s.full_name, "average_mastery": round(s.avg_mastery, 1)}
        for s in top_students
    ]

    return DashboardMetrics(
        total_students=total_students,
        active_students_today=active_students_today,
        average_mastery_score=round(avg_mastery, 1),
        total_questions_attempted=total_questions,
        completion_rate=round(completion_rate, 1),
        top_performing_students=top_performing_students
    )

@router.get("/students/{student_id}/insights", response_model=StudentInsight)
def get_student_insights(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get detailed insights for a specific student."""
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can access student insights")

    # Verify teacher owns the student's class
    student = db.query(User).filter(User.id == student_id).first()
    if not student or student.role != "student":
        raise HTTPException(status_code=404, detail="Student not found")

    teacher_class = db.query(Class).filter(
        Class.id == student.class_id,
        Class.teacher_id == current_user.id
    ).first()
    if not teacher_class:
        raise HTTPException(status_code=403, detail="Access denied")

    # Get mastery scores
    masteries = db.query(Mastery).filter(Mastery.user_id == student_id).all()
    mastery_scores = {m.topic: m.score for m in masteries}

    # Recent activity (last 10 sessions)
    recent_sessions = db.query(UserSession).filter(
        UserSession.user_id == student_id
    ).order_by(desc(UserSession.start_time)).limit(10).all()

    recent_activity = []
    for session in recent_sessions:
        recent_activity.append({
            "type": session.session_type,
            "start_time": session.start_time,
            "duration": session.duration,
            "questions_attempted": session.questions_attempted,
            "correct_answers": session.correct_answers
        })

    # Progress rate (lessons completed vs total lessons)
    total_lessons = db.query(func.count(Progress.id)).filter(
        Progress.user_id == student_id
    ).scalar()

    completed_lessons = db.query(func.count(Progress.id)).filter(
        Progress.user_id == student_id,
        Progress.status == "completed"
    ).scalar()

    progress_rate = (completed_lessons / total_lessons * 100) if total_lessons > 0 else 0.0

    # Generate recommendations
    recommendations = []
    avg_mastery = sum(mastery_scores.values()) / len(mastery_scores) if mastery_scores else 0

    if avg_mastery < 50:
        recommendations.append("Student needs additional support in core concepts")
    if progress_rate < 30:
        recommendations.append("Low engagement - consider reaching out to student")
    if recent_sessions and len(recent_sessions) < 3:
        recommendations.append("Student has been inactive recently")

    return StudentInsight(
        student_id=student_id,
        student_name=student.full_name,
        mastery_scores=mastery_scores,
        recent_activity=recent_activity,
        progress_rate=round(progress_rate, 1),
        recommendations=recommendations
    )

@router.get("/classes/{class_id}/progress", response_model=List[ClassProgress])
def get_class_progress(
    class_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get progress overview for all lessons in a class."""
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can access class progress")

    # Verify teacher owns the class
    class_obj = db.query(Class).filter(
        Class.id == class_id,
        Class.teacher_id == current_user.id
    ).first()
    if not class_obj:
        raise HTTPException(status_code=403, detail="Access denied")

    # Get all lessons for this class's courses
    from models import Course, Unit, Lesson
    lessons = db.query(Lesson).join(Unit).join(Course).filter(
        Course.class_id == class_id
    ).all()

    progress_data = []
    students_in_class = db.query(User).filter(User.class_id == class_id).all()

    for lesson in lessons:
        # Get progress for this lesson
        progress_records = db.query(Progress).filter(
            Progress.lesson_id == lesson.id,
            Progress.user_id.in_([s.id for s in students_in_class])
        ).all()

        if progress_records:
            avg_completion = sum(p.completion_percentage for p in progress_records) / len(progress_records)
            struggling_students = sum(1 for p in progress_records if p.completion_percentage < 50)
            completed_students = sum(1 for p in progress_records if p.status == "completed")
        else:
            avg_completion = 0.0
            struggling_students = 0
            completed_students = 0

        progress_data.append(ClassProgress(
            lesson_id=lesson.id,
            lesson_title=lesson.title,
            average_completion=round(avg_completion, 1),
            struggling_students=struggling_students,
            completed_students=completed_students
        ))

    return progress_data

@router.get("/interventions", response_model=List[InterventionSummary])
def get_interventions(
    status_filter: Optional[str] = None,
    priority_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get interventions for teacher's students."""
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can access interventions")

    query = db.query(Intervention).filter(Intervention.teacher_id == current_user.id)

    if status_filter:
        query = query.filter(Intervention.status == status_filter)
    if priority_filter:
        query = query.filter(Intervention.priority == priority_filter)

    interventions = query.order_by(desc(Intervention.created_at)).all()

    result = []
    for intervention in interventions:
        student = db.query(User).filter(User.id == intervention.student_id).first()
        result.append(InterventionSummary(
            id=intervention.id,
            student_name=student.full_name if student else "Unknown",
            intervention_type=intervention.intervention_type,
            priority=intervention.priority,
            status=intervention.status,
            description=intervention.description,
            created_at=intervention.created_at
        ))

    return result

@router.post("/interventions")
def create_intervention(
    intervention_data: InterventionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new intervention for a student."""
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can create interventions")

    # Verify teacher owns the student's class
    student = db.query(User).filter(User.id == intervention_data.student_id).first()
    if not student or student.role != "student":
        raise HTTPException(status_code=404, detail="Student not found")

    teacher_class = db.query(Class).filter(
        Class.id == student.class_id,
        Class.teacher_id == current_user.id
    ).first()
    if not teacher_class:
        raise HTTPException(status_code=403, detail="Access denied")

    intervention = Intervention(
        student_id=intervention_data.student_id,
        teacher_id=current_user.id,
        intervention_type=intervention_data.intervention_type,
        description=intervention_data.description,
        priority=intervention_data.priority,
        lesson_id=intervention_data.lesson_id
    )

    db.add(intervention)
    db.commit()
    db.refresh(intervention)

    return {"message": "Intervention created successfully", "intervention_id": intervention.id}
