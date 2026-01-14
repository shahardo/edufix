# EduFix Phase 1A Development Plan

## Overview
This phase implements core backend APIs and interactive mock screens for EduFix Phase 1 MVP. Focus on Content Management, Practice System, Q&A Engine, and Analytics with accompanying UI mockups.

## Phase 1A: Content Management, Basic Flows & Mock Screens (3-4 weeks)

### Priority 1: Content Management Router + Mock Teacher Content Management
- [x] Backend: Material upload, course/unit/lesson CRUD
- [x] Content router implementation with permissions and file handling
- [x] Basic test suite for content operations
- [x] Mock Screen: Teacher content management interface (as per Mockup 5)
- [x] Interactive demo: Upload materials, organize by course structure

### Priority 2: Practice System Router + Mock Student Practice Flow
- [x] Backend: Question serving, hints, answer processing
- [x] Mock Screen: Student practice interface (as per Mockups 3)
- [x] Interactive demo: Question progression, hint levels, feedback

### Priority 3: Basic Q&A Router + Mock Student Lesson Workspace
- [ ] Backend: Question submission, AI response integration
- [x] Mock Screen: Student lesson workspace (as per Mockup 2)
- [x] Interactive demo: Ask questions, receive answers, navigate content

### Priority 4: Analytics Router + Mock Teacher Dashboard
- [ ] Backend: Dashboard data aggregation, student profiles
- [x] Mock Screen: Teacher dashboard (as per Mockup 4) + student profiles (Mockup 7)
- [x] Interactive demo: View class metrics, drill into student details

## API Endpoints Documentation

### Content Management API (`/api`)
- `POST /courses` - Create a new course
- `GET /courses` - Get courses (filtered by class_id)
- `GET /courses/{course_id}` - Get specific course
- `POST /units` - Create a new unit
- `GET /units` - Get units (filtered by course_id)
- `POST /lessons` - Create a new lesson
- `GET /lessons` - Get lessons (filtered by unit_id)
- `POST /materials/upload` - Upload material file
- `GET /materials` - Get materials (filtered by lesson_id)
- `GET /materials/{material_id}/download` - Download material file

### Practice System API (`/api/practice`)
- `GET /questions/next` - Get next question for practice (adaptive selection based on mastery)
  - Query params: lesson_id, unit_id, subject
- `POST /questions/{question_id}/answer` - Submit answer to question
  - Updates mastery, gamification, and user progress
- `GET /questions/{question_id}/hints` - Get hint for question (3 levels available)
  - Query param: hint_level (1-3)
- `GET /mastery` - Get user's mastery scores for all topics
- `GET /gamification` - Get user's gamification data (points, badges, streak)

### Authentication API (`/auth`)
- `POST /register` - Register new user
- `POST /token` - Login and get access token
- `GET /users/me` - Get current user info

## Technical Implementation

### Dependencies to Add:
- openai (for Q&A and improvement AI)
- python-multipart (already present for file uploads)
- pandas (for analytics data processing)
- reportlab (for PDF report generation)
- faker (for demo data generation)
- aiofiles (for async file operations)

### Mock Screens Technology:
- Framework: Vanilla HTML/CSS/JavaScript or minimal React
- Styling: Tailwind CSS for rapid prototyping
- Mock Data: JSON files with sample data
- Integration: Fetch API to backend endpoints

## Success Criteria
- Teachers can upload materials and see basic analytics
- Students can ask questions and receive AI-powered answers
- Practice system delivers adaptive questions with hints
- Homework creation/submission flow works end-to-end
- Content improvement provides meaningful suggestions
- All core mock screens demonstrate user flows interactively
