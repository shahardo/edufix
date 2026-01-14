from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import User, Class, Course, Unit, Lesson, Material
from routers.auth import get_current_user
import aiofiles
import os
import uuid

router = APIRouter()

# Create uploads directory if it doesn't exist
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Pydantic models
class CourseCreate(BaseModel):
    name: str
    description: Optional[str] = None
    subject: str
    class_id: int

class CourseResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    subject: str
    class_id: int

    class Config:
        from_attributes = True

class UnitCreate(BaseModel):
    name: str
    course_id: int

class UnitResponse(BaseModel):
    id: int
    name: str
    course_id: int

    class Config:
        from_attributes = True

class LessonCreate(BaseModel):
    title: str
    unit_id: int

class LessonResponse(BaseModel):
    id: int
    title: str
    unit_id: int

    class Config:
        from_attributes = True

class MaterialCreate(BaseModel):
    lesson_id: int
    name: str
    content_type: str
    language: Optional[str] = "en"

class MaterialResponse(BaseModel):
    id: int
    lesson_id: int
    name: str
    file_path: str
    content_type: str
    language: str

    class Config:
        from_attributes = True

# Course endpoints
@router.post("/courses", response_model=CourseResponse)
def create_course(course: CourseCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Create a new course."""
    # Verify user is a teacher and owns the class
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can create courses")

    db_class = db.query(Class).filter(Class.id == course.class_id, Class.teacher_id == current_user.id).first()
    if db_class is None:
        raise HTTPException(status_code=404, detail="Class not found or not owned by teacher")

    db_course = Course(**course.dict())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

@router.get("/courses", response_model=List[CourseResponse])
def get_courses(class_id: Optional[int] = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get courses for a class."""
    query = db.query(Course)
    if class_id:
        query = query.filter(Course.class_id == class_id)

    # If student, only show courses for their class
    if current_user.role == "student":
        query = query.filter(Course.class_id == current_user.class_id)
    # If teacher, show courses for classes they teach
    elif current_user.role == "teacher":
        teacher_class_ids = db.query(Class.id).filter(Class.teacher_id == current_user.id).all()
        teacher_class_ids = [c.id for c in teacher_class_ids]
        query = query.filter(Course.class_id.in_(teacher_class_ids))

    return query.all()

@router.get("/courses/{course_id}", response_model=CourseResponse)
def get_course(course_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get a specific course."""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    # Check permissions
    if current_user.role == "student" and course.class_id != current_user.class_id:
        raise HTTPException(status_code=403, detail="Access denied")
    elif current_user.role == "teacher":
        db_class = db.query(Class).filter(Class.id == course.class_id, Class.teacher_id == current_user.id).first()
        if not db_class:
            raise HTTPException(status_code=403, detail="Access denied")

    return course

# Unit endpoints
@router.post("/units", response_model=UnitResponse)
def create_unit(unit: UnitCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Create a new unit."""
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can create units")

    # Verify teacher owns the course's class
    course = db.query(Course).filter(Course.id == unit.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    db_class = db.query(Class).filter(Class.id == course.class_id, Class.teacher_id == current_user.id).first()
    if not db_class:
        raise HTTPException(status_code=403, detail="Access denied")

    db_unit = Unit(**unit.dict())
    db.add(db_unit)
    db.commit()
    db.refresh(db_unit)
    return db_unit

@router.get("/units", response_model=List[UnitResponse])
def get_units(course_id: Optional[int] = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get units for a course."""
    query = db.query(Unit)
    if course_id:
        query = query.filter(Unit.course_id == course_id)

    # Check permissions based on course access
    if course_id:
        course = db.query(Course).filter(Course.id == course_id).first()
        if course is not None:
            if current_user.role == "student" and course.class_id != current_user.class_id:
                raise HTTPException(status_code=403, detail="Access denied")
            elif current_user.role == "teacher":
                db_class = db.query(Class).filter(Class.id == course.class_id, Class.teacher_id == current_user.id).first()
                if db_class is None:
                    raise HTTPException(status_code=403, detail="Access denied")

    return query.all()

# Lesson endpoints
@router.post("/lessons", response_model=LessonResponse)
def create_lesson(lesson: LessonCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Create a new lesson."""
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can create lessons")

    # Verify teacher owns the unit's course's class
    unit = db.query(Unit).filter(Unit.id == lesson.unit_id).first()
    if unit is None:
        raise HTTPException(status_code=404, detail="Unit not found")

    course = db.query(Course).filter(Course.id == unit.course_id).first()
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")

    db_class = db.query(Class).filter(Class.id == course.class_id, Class.teacher_id == current_user.id).first()
    if db_class is None:
        raise HTTPException(status_code=403, detail="Access denied")

    db_lesson = Lesson(**lesson.dict())
    db.add(db_lesson)
    db.commit()
    db.refresh(db_lesson)
    return db_lesson

@router.get("/lessons", response_model=List[LessonResponse])
def get_lessons(unit_id: Optional[int] = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get lessons for a unit."""
    query = db.query(Lesson)
    if unit_id:
        query = query.filter(Lesson.unit_id == unit_id)

    # Check permissions based on unit/course access
    if unit_id:
        unit = db.query(Unit).filter(Unit.id == unit_id).first()
        if unit is not None:
            course = db.query(Course).filter(Course.id == unit.course_id).first()
            if course is not None:
                if current_user.role == "student" and course.class_id != current_user.class_id:
                    raise HTTPException(status_code=403, detail="Access denied")
                elif current_user.role == "teacher":
                    db_class = db.query(Class).filter(Class.id == course.class_id, Class.teacher_id == current_user.id).first()
                    if db_class is None:
                        raise HTTPException(status_code=403, detail="Access denied")

    return query.all()

# Material endpoints
@router.post("/materials/upload")
async def upload_material(
    lesson_id: int = Form(...),
    name: str = Form(...),
    content_type: str = Form(...),
    language: Optional[str] = Form("en"),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload a material file."""
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can upload materials")

    # Verify teacher owns the lesson's class
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if lesson is None:
        raise HTTPException(status_code=404, detail="Lesson not found")

    unit = db.query(Unit).filter(Unit.id == lesson.unit_id).first()
    if unit is None:
        raise HTTPException(status_code=404, detail="Unit not found")

    course = db.query(Course).filter(Course.id == unit.course_id).first()
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")

    db_class = db.query(Class).filter(Class.id == course.class_id, Class.teacher_id == current_user.id).first()
    if db_class is None:
        raise HTTPException(status_code=403, detail="Access denied")

    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    # Save file
    async with aiofiles.open(file_path, 'wb') as f:
        content = await file.read()
        await f.write(content)

    # Create material record
    db_material = Material(
        lesson_id=lesson_id,
        name=name,
        file_path=file_path,
        content_type=content_type,
        language=language
    )
    db.add(db_material)
    db.commit()
    db.refresh(db_material)

    return {"message": "Material uploaded successfully", "material_id": db_material.id}

@router.get("/materials", response_model=List[MaterialResponse])
def get_materials(lesson_id: Optional[int] = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get materials for a lesson."""
    query = db.query(Material)
    if lesson_id:
        query = query.filter(Material.lesson_id == lesson_id)

    # Check permissions based on lesson access
    if lesson_id:
        lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
        if lesson is not None:
            unit = db.query(Unit).filter(Unit.id == lesson.unit_id).first()
            if unit is not None:
                course = db.query(Course).filter(Course.id == unit.course_id).first()
                if course is not None:
                    if current_user.role == "student" and course.class_id != current_user.class_id:
                        raise HTTPException(status_code=403, detail="Access denied")
                    elif current_user.role == "teacher":
                        db_class = db.query(Class).filter(Class.id == course.class_id, Class.teacher_id == current_user.id).first()
                        if db_class is None:
                            raise HTTPException(status_code=403, detail="Access denied")

    return query.all()

@router.get("/materials/{material_id}/download")
def download_material(material_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Download a material file."""
    material = db.query(Material).filter(Material.id == material_id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")

    # Check permissions
    lesson = db.query(Lesson).filter(Lesson.id == material.lesson_id).first()
    if lesson is None:
        raise HTTPException(status_code=404, detail="Lesson not found")

    unit = db.query(Unit).filter(Unit.id == lesson.unit_id).first()
    if unit is None:
        raise HTTPException(status_code=404, detail="Unit not found")

    course = db.query(Course).filter(Course.id == unit.course_id).first()
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")

    if current_user.role == "student" and course.class_id != current_user.class_id:
        raise HTTPException(status_code=403, detail="Access denied")
    elif current_user.role == "teacher":
        db_class = db.query(Class).filter(Class.id == course.class_id, Class.teacher_id == current_user.id).first()
        if db_class is None:
            raise HTTPException(status_code=403, detail="Access denied")

    if not os.path.exists(str(material.file_path)):
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(material.file_path, filename=material.name)
