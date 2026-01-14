from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import User, Question, UserAnswer, Mastery, Gamification
from routers.auth import get_current_user
import json
import random

router = APIRouter()

# Pydantic models
class QuestionResponse(BaseModel):
    id: int
    question_text: str
    question_type: str
    options: Optional[List[str]] = None
    difficulty: str
    subject: str

    class Config:
        from_attributes = True

class AnswerSubmit(BaseModel):
    answer: str
    time_taken: Optional[float] = None
    hints_used: Optional[int] = 0

class AnswerResponse(BaseModel):
    is_correct: bool
    correct_answer: str
    explanation: Optional[str] = None
    points_earned: int
    mastery_increased: bool

class HintResponse(BaseModel):
    hint: str
    hint_level: int
    total_hints: int

class MasteryResponse(BaseModel):
    topic: str
    score: float
    level: str

# Practice endpoints
@router.get("/questions/next", response_model=QuestionResponse)
def get_next_question(
    lesson_id: Optional[int] = None,
    unit_id: Optional[int] = None,
    subject: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get the next question for practice based on user's mastery level."""
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can access practice questions")

    # Build query based on filters
    query = db.query(Question)

    if lesson_id:
        query = query.filter(Question.lesson_id == lesson_id)
    elif unit_id:
        # Get all lessons in the unit
        from models import Lesson
        lesson_ids = db.query(Lesson.id).filter(Lesson.unit_id == unit_id).all()
        lesson_ids = [l.id for l in lesson_ids]
        if lesson_ids:
            query = query.filter(Question.lesson_id.in_(lesson_ids))
    elif subject:
        query = query.filter(Question.subject == subject)

    questions = query.all()
    if not questions:
        raise HTTPException(status_code=404, detail="No questions available for the specified criteria")

    # Get user's mastery levels for these questions
    question_ids = [q.id for q in questions]
    user_answers = db.query(UserAnswer).filter(
        UserAnswer.user_id == current_user.id,
        UserAnswer.question_id.in_(question_ids)
    ).all()

    # Calculate mastery scores
    question_mastery = {}
    for answer in user_answers:
        if answer.is_correct:
            question_mastery[answer.question_id] = min(100, (question_mastery.get(answer.question_id, 0) + 20))
        else:
            question_mastery[answer.question_id] = max(0, question_mastery.get(answer.question_id, 0) - 10)

    # Select question with lowest mastery or random if all equal
    min_mastery = min(question_mastery.values()) if question_mastery else 0
    candidates = [q for q in questions if question_mastery.get(q.id, 0) == min_mastery]

    selected_question = random.choice(candidates)

    # Prepare response data
    response_data = {
        "id": selected_question.id,
        "question_text": selected_question.question_text,
        "question_type": selected_question.question_type,
        "difficulty": selected_question.difficulty,
        "subject": selected_question.subject,
        "options": json.loads(selected_question.options) if selected_question.options else None
    }

    return QuestionResponse(**response_data)

@router.post("/questions/{question_id}/answer", response_model=AnswerResponse)
def submit_answer(
    question_id: int,
    answer_data: AnswerSubmit,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit an answer to a question and get feedback."""
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can submit answers")

    # Get the question
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    # Check if answer is correct
    is_correct = answer_data.answer.strip().lower() == question.correct_answer.strip().lower()

    # Create user answer record
    user_answer = UserAnswer(
        user_id=current_user.id,
        question_id=question_id,
        answer=answer_data.answer,
        is_correct=is_correct,
        time_taken=answer_data.time_taken,
        hints_used=answer_data.hints_used or 0
    )
    db.add(user_answer)

    # Update mastery
    mastery_topic = f"{question.subject}_{question.difficulty}"
    mastery = db.query(Mastery).filter(
        Mastery.user_id == current_user.id,
        Mastery.topic == mastery_topic
    ).first()

    if mastery:
        if is_correct:
            mastery.score = min(100, mastery.score + 5)
        else:
            mastery.score = max(0, mastery.score - 2)
        mastery.updated_at = datetime.utcnow()
    else:
        mastery = Mastery(
            user_id=current_user.id,
            topic=mastery_topic,
            score=5 if is_correct else 0
        )
        db.add(mastery)

    # Update gamification
    gamification = db.query(Gamification).filter(Gamification.user_id == current_user.id).first()
    if not gamification:
        gamification = Gamification(user_id=current_user.id, points=0, streak=0)
        db.add(gamification)

    points_earned = 0
    if is_correct:
        points_earned = 10 + (5 if answer_data.time_taken and answer_data.time_taken < 60 else 0)  # Bonus for quick answers
        gamification.points += points_earned
        gamification.streak += 1
    else:
        gamification.streak = 0

    gamification.updated_at = datetime.utcnow()

    db.commit()

    # Generate response
    mastery_increased = is_correct and mastery.score > (mastery.score - 5)

    return AnswerResponse(
        is_correct=is_correct,
        correct_answer=question.correct_answer,
        explanation="Great job!" if is_correct else "Keep practicing!",
        points_earned=points_earned,
        mastery_increased=mastery_increased
    )

@router.get("/questions/{question_id}/hints", response_model=HintResponse)
def get_hint(
    question_id: int,
    hint_level: int = 1,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a hint for a question."""
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can request hints")

    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    # Generate hints based on question type and level
    total_hints = 3  # Default number of hints

    if hint_level == 1:
        if question.question_type == "mcq":
            hint = "Look at the options carefully and eliminate obviously wrong answers."
        else:
            hint = "Think about the key concepts covered in this lesson."
    elif hint_level == 2:
        if question.question_type == "mcq":
            hint = "Consider which answer relates most directly to the question."
        else:
            hint = "Recall the main formula or principle that applies here."
    elif hint_level == 3:
        hint = f"The answer involves: {question.correct_answer[:10]}..."
    else:
        raise HTTPException(status_code=400, detail="Invalid hint level")

    return HintResponse(
        hint=hint,
        hint_level=hint_level,
        total_hints=total_hints
    )

@router.get("/mastery", response_model=List[MasteryResponse])
def get_mastery_scores(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get user's mastery scores for all topics."""
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students have mastery scores")

    masteries = db.query(Mastery).filter(Mastery.user_id == current_user.id).all()

    response = []
    for mastery in masteries:
        level = "Beginner"
        if mastery.score >= 80:
            level = "Expert"
        elif mastery.score >= 60:
            level = "Advanced"
        elif mastery.score >= 40:
            level = "Intermediate"

        response.append(MasteryResponse(
            topic=mastery.topic,
            score=mastery.score,
            level=level
        ))

    return response

@router.get("/gamification")
def get_gamification_data(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get user's gamification data."""
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students have gamification data")

    gamification = db.query(Gamification).filter(Gamification.user_id == current_user.id).first()
    if not gamification:
        return {
            "points": 0,
            "badges": [],
            "streak": 0
        }

    return {
        "points": gamification.points,
        "badges": json.loads(gamification.badges) if gamification.badges else [],
        "streak": gamification.streak
    }
