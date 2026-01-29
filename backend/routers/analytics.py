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

class StudentDashboardData(BaseModel):
    active_classes_count: int
    completed_tasks_count: int
    average_grade: float
    current_streak: int
    total_points: int
    classes: List[Dict[str, Any]]
    recent_activity: List[Dict[str, Any]]
    upcoming_assignments: List[Dict[str, Any]]

class TeacherClassDetails(BaseModel):
    class_id: int
    class_name: str
    subject: str
    total_students: int
    students: List[Dict[str, Any]]
    struggling_topics: List[Dict[str, Any]]
    mastery_distribution: Dict[str, int]

class StudentCoursesData(BaseModel):
    courses: List[Dict[str, Any]]
    recent_lessons: List[Dict[str, Any]]

class StudentExercisesData(BaseModel):
    math_exercises: int
    science_exercises: int
    english_exercises: int
    history_exercises: int
    recent_sessions: List[Dict[str, Any]]
    recommended_exercises: List[Dict[str, Any]]

class StudentDetailedAnalytics(BaseModel):
    overall_mastery: float
    mastery_improvement: float
    current_streak: int
    best_streak: int
    total_questions: int
    accuracy: float
    achievements_count: int
    recent_badges: int
    subject_mastery: List[Dict[str, Any]]
    progress_timeline: List[Dict[str, Any]]
    strengths: List[Dict[str, Any]]
    weaknesses: List[Dict[str, Any]]
    recent_achievements: List[Dict[str, Any]]
    activity_calendar: List[Dict[str, Any]]

# Analytics endpoints
@router.get(
    "/dashboard",
    response_model=DashboardMetrics,
    summary="Get Teacher Dashboard",
    description="""
    Retrieve comprehensive dashboard metrics for teachers including:

    - **Total Students**: Number of students in all teacher's classes
    - **Active Students Today**: Students who had learning sessions today
    - **Average Mastery Score**: Overall class performance across all topics
    - **Total Questions Attempted**: Cumulative practice questions answered
    - **Completion Rate**: Percentage of students who completed lessons
    - **Top Performing Students**: Highest-scoring students with their mastery levels

    **Note**: Only teachers can access this endpoint. Data aggregates across all classes owned by the teacher.
    """,
    responses={
        200: {"description": "Dashboard metrics retrieved successfully"},
        403: {"description": "Access denied - Only teachers can view dashboard"}
    }
)
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

@router.get(
    "/student/dashboard",
    response_model=StudentDashboardData,
    summary="Get Student Dashboard Data",
    description="""Get comprehensive dashboard data for the current student including:

    - **Active Classes Count**: Number of classes the student is enrolled in
    - **Completed Tasks Count**: Number of completed assignments/lessons
    - **Average Grade**: Overall mastery score percentage
    - **Current Streak**: Current consecutive days of activity
    - **Total Points**: Gamification points earned
    - **Classes**: List of enrolled classes with details
    - **Recent Activity**: Last activities (practice sessions, lesson completions)
    - **Upcoming Assignments**: Due assignments and deadlines

    **Note**: Only students can access this endpoint.
    """,
    responses={
        200: {"description": "Student dashboard data retrieved successfully"},
        403: {"description": "Access denied - Only students can access their dashboard"}
    }
)
def get_student_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get dashboard data for the current student."""
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can access their dashboard")

    # Get student's class and courses
    if not current_user.class_id:
        return StudentDashboardData(
            active_classes_count=0,
            completed_tasks_count=0,
            average_grade=0.0,
            current_streak=0,
            total_points=0,
            classes=[],
            recent_activity=[],
            upcoming_assignments=[]
        )

    # Get courses for student's class
    from models import Course, Unit, Lesson
    courses = db.query(Course).filter(Course.class_id == current_user.class_id).all()
    active_classes_count = len(courses)

    # Get completed tasks (progress records with completed status)
    completed_tasks_count = db.query(func.count(Progress.id)).filter(
        Progress.user_id == current_user.id,
        Progress.status == "completed"
    ).scalar()

    # Get average grade (average mastery score)
    avg_mastery = db.query(func.avg(Mastery.score)).filter(
        Mastery.user_id == current_user.id
    ).scalar() or 0.0
    average_grade = round(avg_mastery, 1)

    # Get gamification data
    gamification = db.query(Gamification).filter(Gamification.user_id == current_user.id).first()
    current_streak = gamification.streak if gamification else 0
    total_points = gamification.points if gamification else 0

    # Build classes list
    classes = []
    for course in courses:
        # Get course progress
        course_lessons = db.query(Lesson).join(Unit).filter(Unit.course_id == course.id).all()
        lesson_ids = [l.id for l in course_lessons]

        if lesson_ids:
            completed_course_lessons = db.query(func.count(Progress.id)).filter(
                Progress.user_id == current_user.id,
                Progress.lesson_id.in_(lesson_ids),
                Progress.status == "completed"
            ).scalar()

            next_lesson = None
            for lesson in course_lessons:
                progress = db.query(Progress).filter(
                    Progress.user_id == current_user.id,
                    Progress.lesson_id == lesson.id
                ).first()
                if not progress or progress.status != "completed":
                    next_lesson = lesson.title
                    break

            grade = db.query(func.avg(Mastery.score)).filter(
                Mastery.user_id == current_user.id,
                Mastery.topic.like(f"%{course.subject}%")
            ).scalar() or 0.0
        else:
            completed_course_lessons = 0
            next_lesson = "No lessons available"
            grade = 0.0

        classes.append({
            "id": course.id,
            "name": course.name,
            "subject": course.subject,
            "teacher_name": current_user.student_class.teacher.full_name if current_user.student_class else "Unknown",
            "completed_lessons": completed_course_lessons,
            "total_lessons": len(course_lessons),
            "next_lesson": next_lesson,
            "grade": round(grade, 1)
        })

    # Get recent activity (last 10 items)
    recent_activity = []

    # Get recent practice sessions
    recent_sessions = db.query(UserSession).filter(
        UserSession.user_id == current_user.id
    ).order_by(desc(UserSession.start_time)).limit(5).all()

    for session in recent_sessions:
        accuracy = (session.correct_answers / session.questions_attempted * 100) if session.questions_attempted > 0 else 0
        recent_activity.append({
            "type": "practice",
            "description": f"Practiced {session.session_type}",
            "timestamp": session.start_time.isoformat(),
            "details": f"{session.correct_answers}/{session.questions_attempted} correct ({round(accuracy, 1)}%)"
        })

    # Get recent lesson completions
    recent_completions = db.query(Progress).filter(
        Progress.user_id == current_user.id,
        Progress.status == "completed"
    ).order_by(desc(Progress.last_accessed)).limit(5).all()

    for completion in recent_completions:
        lesson = db.query(Lesson).filter(Lesson.id == completion.lesson_id).first()
        if lesson:
            recent_activity.append({
                "type": "lesson_completion",
                "description": f"Completed lesson: {lesson.title}",
                "timestamp": completion.last_accessed.isoformat(),
                "details": f"{completion.completion_percentage}% completion"
            })

    # Sort recent activity by timestamp
    recent_activity.sort(key=lambda x: x["timestamp"], reverse=True)
    recent_activity = recent_activity[:10]

    # Get upcoming assignments (for now, simulate with course deadlines)
    # In a real implementation, this would come from an assignments table
    upcoming_assignments = []
    for course in courses[:3]:  # Show next 3 courses
        upcoming_assignments.append({
            "title": f"{course.name} Review",
            "course_name": course.name,
            "due_date": (datetime.utcnow() + timedelta(days=7)).isoformat(),
            "priority": "medium",
            "type": "review"
        })

    return StudentDashboardData(
        active_classes_count=active_classes_count,
        completed_tasks_count=completed_tasks_count,
        average_grade=average_grade,
        current_streak=current_streak,
        total_points=total_points,
        classes=classes,
        recent_activity=recent_activity,
        upcoming_assignments=upcoming_assignments
    )

@router.get(
    "/students/{student_id}/insights",
    response_model=StudentInsight,
    summary="Get Student Insights",
    description="""
    Retrieve detailed performance analytics for a specific student including:

    - **Mastery Scores**: Performance across different topics/subjects
    - **Recent Activity**: Last 10 learning sessions with duration and accuracy
    - **Progress Rate**: Percentage of completed lessons
    - **AI Recommendations**: Personalized suggestions based on performance patterns

    **Mastery Levels:**
    - 80-100: Expert
    - 60-79: Advanced
    - 40-59: Intermediate
    - 0-39: Beginner

    **Note**: Only teachers can access insights for students in their classes.
    """,
    responses={
        200: {"description": "Student insights retrieved successfully"},
        403: {"description": "Access denied - Student not in teacher's class"},
        404: {"description": "Student not found"}
    }
)
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

@router.get(
    "/teacher/classes/{class_id}/details",
    response_model=TeacherClassDetails,
    summary="Get Teacher Class Details",
    description="""Get detailed information about a specific class including:

    - **Class Information**: Name, subject, total students
    - **Students**: List of all students with performance data
    - **Struggling Topics**: Topics where students need the most help
    - **Mastery Distribution**: Breakdown of student performance levels

    **Note**: Only teachers can access details for their own classes.
    """,
    responses={
        200: {"description": "Class details retrieved successfully"},
        403: {"description": "Access denied - Class not owned by teacher"},
        404: {"description": "Class not found"}
    }
)
def get_teacher_class_details(
    class_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get detailed information about a specific class for teachers."""
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can access class details")

    # Verify teacher owns the class
    class_obj = db.query(Class).filter(
        Class.id == class_id,
        Class.teacher_id == current_user.id
    ).first()
    if not class_obj:
        raise HTTPException(status_code=404, detail="Class not found or access denied")

    # Get students in the class
    students = db.query(User).filter(User.class_id == class_id).all()
    total_students = len(students)
    student_ids = [s.id for s in students]

    # Build student list with performance data
    student_list = []
    for student in students:
        # Get average mastery score
        avg_mastery = db.query(func.avg(Mastery.score)).filter(
            Mastery.user_id == student.id
        ).scalar() or 0.0

        # Get homework completion status (simplified - count completed lessons)
        completed_lessons = db.query(func.count(Progress.id)).filter(
            Progress.user_id == student.id,
            Progress.status == "completed"
        ).scalar()

        # Determine status based on recent activity and performance
        today = datetime.utcnow().date()
        recent_sessions = db.query(UserSession).filter(
            UserSession.user_id == student.id,
            func.date(UserSession.start_time) >= today - timedelta(days=7)
        ).count()

        if avg_mastery >= 80:
            status = "Excellent"
        elif avg_mastery >= 60:
            status = "Good"
        elif avg_mastery >= 40:
            status = "Needs Improvement"
        else:
            status = "At Risk"

        if recent_sessions == 0:
            status = "Inactive"

        student_list.append({
            "id": student.id,
            "name": student.full_name,
            "email": student.email,
            "mastery_score": round(avg_mastery, 1),
            "completed_lessons": completed_lessons,
            "status": status,
            "recent_activity": recent_sessions > 0
        })

    # Get struggling topics (topics with low average mastery)
    topic_mastery = db.query(
        Mastery.topic,
        func.avg(Mastery.score).label('avg_score'),
        func.count(Mastery.user_id).label('student_count')
    ).filter(
        Mastery.user_id.in_(student_ids)
    ).group_by(Mastery.topic).all()

    struggling_topics = []
    for topic, avg_score, count in topic_mastery:
        if avg_score < 60:  # Consider topics with <60% average as struggling
            struggling_students = db.query(func.count(Mastery.user_id)).filter(
                Mastery.topic == topic,
                Mastery.user_id.in_(student_ids),
                Mastery.score < 50
            ).scalar()

            struggling_topics.append({
                "topic": topic,
                "average_mastery": round(avg_score, 1),
                "struggling_students": struggling_students,
                "total_students": count
            })

    # Sort struggling topics by average mastery (lowest first)
    struggling_topics.sort(key=lambda x: x["average_mastery"])

    # Calculate mastery distribution
    mastery_distribution = {
        "expert": 0,      # 80-100%
        "advanced": 0,    # 60-79%
        "intermediate": 0, # 40-59%
        "beginner": 0     # 0-39%
    }

    for student in students:
        avg_mastery = db.query(func.avg(Mastery.score)).filter(
            Mastery.user_id == student.id
        ).scalar() or 0.0

        if avg_mastery >= 80:
            mastery_distribution["expert"] += 1
        elif avg_mastery >= 60:
            mastery_distribution["advanced"] += 1
        elif avg_mastery >= 40:
            mastery_distribution["intermediate"] += 1
        else:
            mastery_distribution["beginner"] += 1

    return TeacherClassDetails(
        class_id=class_id,
        class_name=class_obj.name,
        subject=class_obj.subject,
        total_students=total_students,
        students=student_list,
        struggling_topics=struggling_topics[:5],  # Top 5 struggling topics
        mastery_distribution=mastery_distribution
    )

@router.get(
    "/student/courses",
    response_model=StudentCoursesData,
    summary="Get Student Courses and Lessons",
    description="""Get courses and lessons data for the current student including:

    - **Courses**: List of enrolled courses with progress information
    - **Recent Lessons**: Recently accessed lessons for quick resume

    **Note**: Only students can access this endpoint.
    """,
    responses={
        200: {"description": "Student courses data retrieved successfully"},
        403: {"description": "Access denied - Only students can access their courses"}
    }
)
def get_student_courses(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get courses and lessons data for the current student."""
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can access their courses")

    # Get student's class and courses
    if not current_user.class_id:
        return StudentCoursesData(courses=[], recent_lessons=[])

    # Get courses for student's class
    from models import Course, Unit, Lesson
    courses = db.query(Course).filter(Course.class_id == current_user.class_id).all()

    # Build courses list with progress information
    courses_data = []
    for course in courses:
        # Get course lessons
        course_lessons = db.query(Lesson).join(Unit).filter(Unit.course_id == course.id).all()
        lesson_ids = [l.id for l in course_lessons]

        if lesson_ids:
            # Get progress for this course
            completed_course_lessons = db.query(func.count(Progress.id)).filter(
                Progress.user_id == current_user.id,
                Progress.lesson_id.in_(lesson_ids),
                Progress.status == "completed"
            ).scalar()

            total_lessons = len(course_lessons)

            # Get average grade for the course
            grade = db.query(func.avg(Mastery.score)).filter(
                Mastery.user_id == current_user.id,
                Mastery.topic.like(f"%{course.subject}%")
            ).scalar() or 0.0
        else:
            completed_course_lessons = 0
            total_lessons = 0
            grade = 0.0

        courses_data.append({
            "id": course.id,
            "name": course.name,
            "subject": course.subject,
            "teacher_name": current_user.student_class.teacher.full_name if current_user.student_class else "Unknown",
            "completed_lessons": completed_course_lessons,
            "total_lessons": total_lessons,
            "grade": round(grade, 1)
        })

    # Get recent lessons (last 5 accessed)
    recent_lessons = []
    recent_progress = db.query(Progress).filter(
        Progress.user_id == current_user.id
    ).order_by(desc(Progress.last_accessed)).limit(5).all()

    for progress in recent_progress:
        lesson = db.query(Lesson).filter(Lesson.id == progress.lesson_id).first()
        if lesson:
            # Get lesson's course
            unit = db.query(Unit).filter(Unit.id == lesson.unit_id).first()
            course = db.query(Course).filter(Course.id == unit.course_id).first() if unit else None

            recent_lessons.append({
                "id": lesson.id,
                "title": lesson.title,
                "course_name": course.name if course else "Unknown Course",
                "duration": "15 min",  # Placeholder - would come from lesson metadata
                "completion_percentage": progress.completion_percentage
            })

    return StudentCoursesData(
        courses=courses_data,
        recent_lessons=recent_lessons
    )

@router.get(
    "/student/exercises",
    response_model=StudentExercisesData,
    summary="Get Student Exercises Data",
    description="""Get exercises and practice data for the current student including:

    - **Exercise Counts**: Number of available exercises by subject
    - **Recent Sessions**: Recent practice sessions with performance
    - **Recommended Exercises**: Personalized exercise suggestions

    **Note**: Only students can access this endpoint.
    """,
    responses={
        200: {"description": "Student exercises data retrieved successfully"},
        403: {"description": "Access denied - Only students can access their exercises"}
    }
)
def get_student_exercises(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get exercises and practice data for the current student."""
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can access their exercises")

    # Get exercise counts by subject (simplified - using mastery topics as proxy)
    math_exercises = db.query(func.count(Mastery.id)).filter(
        Mastery.user_id == current_user.id,
        Mastery.topic.like("%math%")
    ).scalar()

    science_exercises = db.query(func.count(Mastery.id)).filter(
        Mastery.user_id == current_user.id,
        Mastery.topic.like("%science%")
    ).scalar()

    english_exercises = db.query(func.count(Mastery.id)).filter(
        Mastery.user_id == current_user.id,
        Mastery.topic.like("%english%")
    ).scalar()

    history_exercises = db.query(func.count(Mastery.id)).filter(
        Mastery.user_id == current_user.id,
        Mastery.topic.like("%history%")
    ).scalar()

    # Get recent practice sessions
    recent_sessions = []
    recent_user_sessions = db.query(UserSession).filter(
        UserSession.user_id == current_user.id
    ).order_by(desc(UserSession.start_time)).limit(5).all()

    for session in recent_user_sessions:
        accuracy = (session.correct_answers / session.questions_attempted * 100) if session.questions_attempted and session.questions_attempted > 0 else 0
        recent_sessions.append({
            "id": session.id,
            "topic": session.session_type,
            "score": round(accuracy, 1),
            "questions_attempted": session.questions_attempted,
            "duration": f"{session.duration} min",
            "date": session.start_time.date().isoformat()
        })

    # Generate recommended exercises based on weak areas
    recommended_exercises = []
    weak_masteries = db.query(Mastery).filter(
        Mastery.user_id == current_user.id,
        Mastery.score < 70
    ).order_by(Mastery.score).limit(3).all()

    for mastery in weak_masteries:
        recommended_exercises.append({
            "id": mastery.id,
            "title": f"Practice: {mastery.topic}",
            "topic": mastery.topic,
            "difficulty": "medium" if mastery.score < 50 else "easy",
            "description": f"Strengthen your understanding of {mastery.topic}",
            "estimated_time": "10 min"
        })

    return StudentExercisesData(
        math_exercises=math_exercises,
        science_exercises=science_exercises,
        english_exercises=english_exercises,
        history_exercises=history_exercises,
        recent_sessions=recent_sessions,
        recommended_exercises=recommended_exercises
    )

@router.get(
    "/student/detailed",
    response_model=StudentDetailedAnalytics,
    summary="Get Student Detailed Analytics",
    description="""Get comprehensive analytics data for the current student including:

    - **Performance Metrics**: Mastery scores, streaks, accuracy
    - **Subject Mastery**: Performance breakdown by subject
    - **Progress Timeline**: Daily progress over the last week
    - **Strengths & Weaknesses**: Areas of excellence and improvement
    - **Achievements**: Recent badges and accomplishments
    - **Activity Calendar**: Study activity visualization

    **Note**: Only students can access their own detailed analytics.
    """,
    responses={
        200: {"description": "Student detailed analytics retrieved successfully"},
        403: {"description": "Access denied - Only students can access their analytics"}
    }
)
def get_student_detailed_analytics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get detailed analytics data for the current student."""
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can access their analytics")

    # Get overall mastery and improvement
    overall_mastery = db.query(func.avg(Mastery.score)).filter(
        Mastery.user_id == current_user.id
    ).scalar() or 0.0

    # Calculate mastery improvement (compare last 30 days to previous 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    sixty_days_ago = datetime.utcnow() - timedelta(days=60)

    recent_mastery = db.query(func.avg(Mastery.score)).filter(
        Mastery.user_id == current_user.id,
        Mastery.updated_at >= thirty_days_ago
    ).scalar() or 0.0

    older_mastery = db.query(func.avg(Mastery.score)).filter(
        Mastery.user_id == current_user.id,
        Mastery.updated_at.between(sixty_days_ago, thirty_days_ago)
    ).scalar() or 0.0

    mastery_improvement = recent_mastery - older_mastery

    # Get gamification data
    gamification = db.query(Gamification).filter(Gamification.user_id == current_user.id).first()
    current_streak = gamification.streak if gamification else 0
    best_streak = gamification.streak if gamification else 0  # Use current streak as best streak

    # Get total questions and accuracy
    total_questions = db.query(func.count(UserAnswer.id)).filter(
        UserAnswer.user_id == current_user.id
    ).scalar()

    total_correct = db.query(func.sum(UserAnswer.is_correct)).filter(
        UserAnswer.user_id == current_user.id
    ).scalar() or 0

    accuracy = (total_correct / total_questions * 100) if total_questions > 0 else 0.0

    # Get achievements count (simplified - count completed lessons)
    achievements_count = db.query(func.count(Progress.id)).filter(
        Progress.user_id == current_user.id,
        Progress.status == "completed"
    ).scalar() or 0

    recent_badges = 0  # Placeholder - would come from achievements system

    # Get subject mastery
    subject_mastery = []
    mastery_by_topic = db.query(
        Mastery.topic,
        func.avg(Mastery.score).label('avg_score')
    ).filter(
        Mastery.user_id == current_user.id
    ).group_by(Mastery.topic).all()

    for topic, score in mastery_by_topic:
        subject_mastery.append({
            "name": topic,
            "score": round(score, 1)
        })

    # Get progress timeline (last 7 days)
    progress_timeline = []
    for i in range(7):
        date = datetime.utcnow() - timedelta(days=i)
        day_mastery = db.query(func.avg(Mastery.score)).filter(
            Mastery.user_id == current_user.id,
            func.date(Mastery.updated_at) == date.date()
        ).scalar() or 0.0

        progress_timeline.append({
            "date": date.strftime("%Y-%m-%d"),
            "score": round(day_mastery, 1)
        })

    # Get strengths (topics with score >= 80)
    strengths = []
    high_masteries = db.query(Mastery).filter(
        Mastery.user_id == current_user.id,
        Mastery.score >= 80
    ).all()

    for mastery in high_masteries[:3]:  # Top 3 strengths
        strengths.append({
            "topic": mastery.topic,
            "description": f"Excellent performance in {mastery.topic}"
        })

    # Get weaknesses (topics with score < 60)
    weaknesses = []
    low_masteries = db.query(Mastery).filter(
        Mastery.user_id == current_user.id,
        Mastery.score < 60
    ).order_by(Mastery.score).all()

    for mastery in low_masteries[:3]:  # Top 3 weaknesses
        weaknesses.append({
            "topic": mastery.topic,
            "description": f"Additional practice needed in {mastery.topic}"
        })

    # Get recent achievements (simplified - recent lesson completions)
    recent_achievements = []
    recent_completions = db.query(Progress).filter(
        Progress.user_id == current_user.id,
        Progress.status == "completed"
    ).order_by(desc(Progress.last_accessed)).limit(3).all()

    for i, completion in enumerate(recent_completions):
        from models import Lesson
        lesson = db.query(Lesson).filter(Lesson.id == completion.lesson_id).first()
        if lesson:
            icons = ["fa-graduation-cap", "fa-star", "fa-trophy"]
            recent_achievements.append({
                "id": completion.id,
                "name": f"Completed: {lesson.title}",
                "description": f"Successfully completed {lesson.title}",
                "icon": icons[i % len(icons)],
                "date": completion.last_accessed.strftime("%B %d, %Y")
            })

    # Generate activity calendar (last 35 days for 5 weeks)
    activity_calendar = []
    for i in range(35):
        date = datetime.utcnow() - timedelta(days=34-i)
        # Check if student had any activity on this day
        activity_count = db.query(UserSession).filter(
            UserSession.user_id == current_user.id,
            func.date(UserSession.start_time) == date.date()
        ).count()

        activity_calendar.append({
            "day": date.day,
            "date": date.strftime("%Y-%m-%d"),
            "active": activity_count > 0
        })

    return StudentDetailedAnalytics(
        overall_mastery=round(overall_mastery, 1),
        mastery_improvement=round(mastery_improvement, 1),
        current_streak=current_streak,
        best_streak=best_streak,
        total_questions=total_questions,
        accuracy=round(accuracy, 1),
        achievements_count=achievements_count,
        recent_badges=recent_badges,
        subject_mastery=subject_mastery,
        progress_timeline=progress_timeline,
        strengths=strengths,
        weaknesses=weaknesses,
        recent_achievements=recent_achievements,
        activity_calendar=activity_calendar
    )
