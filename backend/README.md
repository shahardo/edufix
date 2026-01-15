# EduFix Backend API

A comprehensive educational platform backend built with FastAPI, providing content management, practice systems, Q&A capabilities, and analytics for teachers and students.

## 🚀 Features

### ✅ Implemented (Phase 1A + 1B)
- **User Management**: Registration, authentication, JWT tokens, profile management
- **Content Management**: Courses, units, lessons, and material uploads
- **Practice System**: Adaptive question serving, hints, answer processing, mastery tracking
- **Analytics Dashboard**: Teacher insights, student progress tracking, intervention management
- **Database**: PostgreSQL with SQLAlchemy ORM and Alembic migrations
- **File Uploads**: Secure material uploads with file type validation

### 🔄 In Development (Phase 2)
- Q&A Engine with OpenAI GPT integration
- Content improvement analysis
- Real-time features and WebSocket support

## 🛠️ Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy 2.0
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Local filesystem (configurable)
- **Testing**: pytest
- **Migration**: Alembic
- **Password Hashing**: bcrypt (via passlib)

## 📋 Prerequisites

- Python 3.12+
- PostgreSQL 13+
- Virtual environment (recommended)

## 🔧 Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd edufix/backend
   ```

2. **Create and activate virtual environment**:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables** (optional):
   Create a `.env` file in the backend directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost/edufix
   SECRET_KEY=your-secret-key-here
   ```

5. **Set up the database**:
   ```bash
   # Create PostgreSQL database
   createdb edufix

   # Run migrations
   alembic upgrade head

   # (Optional) Load demo data
   python demo_data.py
   ```

## 🚀 Running the Application

### Development Server
```bash
# From backend directory
uvicorn main:app --reload
```

The API will be available at: http://127.0.0.1:8000

### API Documentation
- **Swagger UI**: http://127.0.0.1:8000/docs
- **ReDoc**: http://127.0.0.1:8000/redoc

## 📚 API Endpoints

### Authentication (`/auth`)
- `POST /auth/register` - Register new user
- `POST /auth/token` - Login and get access token
- `GET /auth/users/me` - Get current user info
- `PUT /auth/users/me` - Update user profile
- `PUT /auth/users/me/password` - Change password

### Content Management (`/api`)
- `POST /api/courses` - Create course
- `GET /api/courses` - List courses
- `GET /api/courses/{course_id}` - Get specific course
- `POST /api/units` - Create unit
- `GET /api/units` - List units
- `POST /api/lessons` - Create lesson
- `GET /api/lessons` - List lessons
- `POST /api/materials/upload` - Upload material
- `GET /api/materials` - List materials
- `GET /api/materials/{material_id}/download` - Download material

### Practice System (`/api/practice`)
- `GET /api/practice/questions/next` - Get next practice question
- `POST /api/practice/questions/{question_id}/answer` - Submit answer
- `GET /api/practice/questions/{question_id}/hints` - Get question hints
- `GET /api/practice/mastery` - Get user's mastery scores
- `GET /api/practice/gamification` - Get gamification data

### Analytics (`/api/analytics`)
- `GET /api/analytics/dashboard` - Teacher dashboard metrics
- `GET /api/analytics/students/{student_id}/insights` - Student insights
- `GET /api/analytics/classes/{class_id}/progress` - Class progress
- `GET /api/analytics/interventions` - List interventions
- `POST /api/analytics/interventions` - Create intervention

## 🧪 Testing

### Run All Tests
```bash
# From backend directory
pytest tests/ -v
```

### Run Specific Test Files
```bash
pytest tests/test_auth.py -v
pytest tests/test_content.py -v
pytest tests/test_practice.py -v
pytest tests/test_models.py -v
```

### Test Coverage
```bash
pytest --cov=. --cov-report=html
# View coverage report in htmlcov/index.html
```

## 🗄️ Database Schema

### Core Models
- **User**: Students and teachers with authentication
- **Class**: Teacher-managed student groups
- **Course**: Educational content organized by subject
- **Unit**: Subdivisions within courses
- **Lesson**: Individual learning units
- **Material**: Uploaded files (PPTX, PDF, DOCX, etc.)
- **Question**: Practice questions with multiple choice/short answer
- **UserAnswer**: Student responses and scoring
- **Mastery**: Topic-wise proficiency tracking
- **Gamification**: Points, badges, and streaks
- **Session**: Learning session tracking
- **Progress**: Lesson completion tracking
- **Intervention**: Teacher recommendations and actions

### Relationships
```
User (teacher) ───┐
                  ├── Class ───┐
User (student) ───┘           │
                              ├── Course ─── Unit ─── Lesson ─── Material
                              │                                    ─── Question
                              └── Session, Progress, Mastery, etc.
```

## 🔐 Authentication

The API uses JWT (JSON Web Token) authentication:

1. **Register/Login** to get access token
2. **Include token in requests**:
   ```
   Authorization: Bearer <your-jwt-token>
   ```
3. **Token expires** in 30 minutes (configurable)

### User Roles
- **Student**: Access to practice, content viewing, personal analytics
- **Teacher**: Full content management, class analytics, student insights

## 📁 File Uploads

### Supported Formats
- **Slides**: PPTX, PPT
- **Documents**: PDF, DOCX, DOC
- **Videos**: MP4, AVI
- **Images**: JPG, PNG, GIF

### Upload Process
1. **Authentication required** (teachers only)
2. **POST to `/api/materials/upload`** with form data:
   - `lesson_id`: Target lesson ID
   - `name`: Display name
   - `content_type`: File type category
   - `file`: The actual file
3. **Files stored** in `backend/uploads/` directory
4. **Secure download** via `/api/materials/{id}/download`

## 📊 Analytics Features

### Teacher Dashboard
- Class performance metrics
- Student engagement statistics
- Top performing students
- Completion rates

### Student Insights
- Individual mastery scores
- Recent activity tracking
- Progress rate analysis
- Personalized recommendations

### Intervention Management
- Track student issues
- Create action items
- Monitor resolution status

## 🔧 Configuration

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost/edufix

# Security
SECRET_KEY=your-256-bit-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30

# File Storage
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760  # 10MB

# External APIs (future)
OPENAI_API_KEY=sk-...
```

### Database Configuration
Located in `backend/database.py` - modify connection string as needed.

## 🚀 Deployment

### Production Considerations
1. **Use production ASGI server**:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
   ```

2. **Environment variables** for secrets (never commit to git)

3. **Database migration** on deployment:
   ```bash
   alembic upgrade head
   ```

4. **File storage**: Consider cloud storage (AWS S3, etc.) for production

5. **HTTPS**: Use reverse proxy (nginx) with SSL certificates

### Docker (Future)
```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🤝 Contributing

1. **Follow the development rules** in `docs/devplan.md`
2. **Write tests** for new features
3. **Update documentation** for API changes
4. **Use meaningful commit messages**

### Code Quality
- **Type hints** throughout the codebase
- **Pydantic models** for API validation
- **SQLAlchemy 2.0** patterns
- **Descriptive variable names**
- **Error handling** with appropriate HTTP status codes

## 📝 API Documentation

### Request/Response Examples

#### Register User
```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "student1",
    "email": "student1@example.com",
    "password": "password123",
    "full_name": "John Doe",
    "role": "student"
  }'
```

#### Get Access Token
```bash
curl -X POST "http://localhost:8000/auth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=student1&password=password123"
```

#### Upload Material
```bash
curl -X POST "http://localhost:8000/api/materials/upload" \
  -H "Authorization: Bearer <token>" \
  -F "lesson_id=1" \
  -F "name=Introduction Slides" \
  -F "content_type=slide" \
  -F "file=@presentation.pptx"
```

## 🐛 Troubleshooting

### Common Issues

1. **Import errors**: Ensure virtual environment is activated
2. **Database connection**: Check PostgreSQL is running and credentials
3. **File uploads**: Verify `uploads/` directory exists and is writable
4. **Token expiration**: Refresh tokens when they expire (401 errors)

### Debug Mode
```bash
# Enable debug logging
export PYTHONPATH=.
python -c "import logging; logging.basicConfig(level=logging.DEBUG)"
uvicorn main:app --reload --log-level debug
```

## 📈 Roadmap

### Phase 1B (Current)
- ✅ User management APIs
- ✅ Content management APIs
- ✅ Practice system APIs
- ✅ Analytics APIs

### Phase 2 (Next)
- 🔄 OpenAI Q&A integration
- 🔄 Content improvement analysis
- 🔄 Real-time collaboration
- 🔄 Advanced analytics

### Phase 3-5
- 🌟 Mobile apps
- 🌟 Internationalization
- 🌟 Advanced AI features
- 🌟 Production scaling

---

For more details, see the main project README and `docs/devplan.md`.
