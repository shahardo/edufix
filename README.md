# EduFix

EduFix is an adaptive classroom learning platform designed to reduce learning gaps through intelligent, multi-modal, and collaborative learning experiences for high school students. The platform supports STEM and humanities subjects with full multilingual support (Hebrew + English as primary languages) and includes an AI-powered Content Improvement Module that analyzes teacher materials and suggests or auto-generates improvements to presentations, lesson plans, homework assignments, and other pedagogical resources.

## Key Features

- **Adaptive Learning**: Personalized practice questions that adjust difficulty based on student performance
- **Q&A Engine**: Natural language question answering with explanations in the student's preferred language
- **Teacher Analytics**: Comprehensive dashboards showing class mastery, individual student progress, and gap identification
- **Content Improvement**: AI-powered analysis and suggestions for enhancing teaching materials
- **Multi-lingual Support**: Full Hebrew (RTL) and English (LTR) interface support
- **Gamification**: Points, badges, and streaks to motivate student engagement
- **Collaborative Learning**: Group sessions with peer teaching and system monitoring
- **Homework Management**: Creation, submission, grading, and feedback workflows

## Architecture

- **Backend**: Python FastAPI with SQLAlchemy 2.0 ORM, JWT authentication
- **Database**: PostgreSQL with Alembic migrations
- **Frontend**: Vanilla HTML/CSS/JS (Phase 1), React planned (Phase 2+)
- **AI Integration**: OpenAI GPT for Q&A and content improvement
- **File Storage**: Local filesystem with cloud storage planned

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- PostgreSQL 13+
- Git

### Backend Setup
```bash
git clone https://github.com/shahardo/edufix.git
cd edufix/backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Set up database
createdb edufix
alembic upgrade head

# (Optional) Load demo data
python demo_data.py

# Run development server
uvicorn main:app --reload
```

**API Documentation**: http://localhost:8000/docs

### Frontend Setup
The frontend mockups are available in the `frontend/` directory. Run any HTML file directly in your browser or serve with a local server.

## 📊 Development Status

### ✅ Phase 1A: Core MVP (Completed)
- User authentication and registration
- Content management (courses, units, lessons, materials)
- Practice system with adaptive questions and hints
- Basic teacher dashboard and student profiles

### ✅ Phase 1B: Backend API Development (Completed)
- Enhanced user management APIs with profile updates
- Complete analytics APIs (dashboard, student insights, interventions)
- Comprehensive database schema with all models
- Full test suite with 47 passing tests

### 🔄 Phase 2: AI Integration & Advanced Features (In Progress)
- OpenAI GPT integration for Q&A responses
- Content improvement module for PPTX/PDF analysis
- Real-time collaboration features
- Advanced analytics and ML insights

### 📅 Future Phases
- **Phase 3**: Internationalization & Production Readiness
- **Phase 4**: Mobile & Integration (React Native, Google Classroom)
- **Phase 5**: Expansion & Enhancement (Advanced AI, Global Scaling)

See `docs/devplan.md` for detailed roadmap and specifications.

## 📁 Project Structure

```
edufix/
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── database.py          # Database configuration (PostgreSQL)
│   ├── models.py            # SQLAlchemy 2.0 models
│   ├── demo_data.py         # Demo data generation
│   ├── requirements.txt     # Python dependencies
│   ├── README.md           # Backend documentation
│   ├── routers/
│   │   ├── auth.py         # Authentication & user management
│   │   ├── content.py      # Course/unit/lesson/material CRUD
│   │   ├── practice.py     # Question serving & mastery tracking
│   │   └── analytics.py    # Dashboard & insights APIs
│   ├── tests/
│   │   ├── test_auth.py
│   │   ├── test_content.py
│   │   ├── test_practice.py
│   │   ├── test_models.py
│   │   └── test_demo_data.py
│   └── uploads/            # File storage directory
├── frontend/
│   ├── *.html             # Mock UI screens
│   ├── css/
│   ├── js/
│   └── README.md
├── docs/
│   ├── devplan.md         # Development roadmap
│   ├── perplexity Mockup Spec.md
│   └── perplexity PRD.md
├── alembic/               # Database migrations
└── README.md
```

## 🧪 Testing

Run the comprehensive test suite:
```bash
cd backend
pytest tests/ -v --cov=. --cov-report=html
```

**Current Status**: 47 tests passing ✅

## 🤝 Contributing

1. Follow the development rules in `docs/devplan.md`
2. Write tests for new features (aim for 80%+ coverage)
3. Update documentation for API changes
4. Use conventional commits

### Code Quality Standards
- Type hints throughout codebase
- Pydantic models for API validation
- SQLAlchemy 2.0 patterns
- Descriptive naming and documentation
- Proper error handling with HTTP status codes

## 📚 Documentation

- **Backend API**: See `backend/README.md` for complete API documentation
- **Development Plan**: `docs/devplan.md` for roadmap and specifications
- **UI Mockups**: `docs/perplexity Mockup Spec.md`
- **Product Requirements**: `docs/perplexity PRD.md`

## 🔐 Security

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control (Student/Teacher)
- Input validation and sanitization
- File upload security checks

## 📈 Performance

- PostgreSQL with optimized queries
- SQLAlchemy connection pooling
- Async file operations
- Efficient pagination for large datasets
- Database indexing strategy

## 🌍 Internationalization

- Full Hebrew (RTL) and English (LTR) support planned
- Unicode-safe database design
- Language preference storage
- RTL layout system ready

## 📞 Support

For questions or support:
- Check the documentation in `backend/README.md`
- Review `docs/devplan.md` for development guidelines
- Open an issue for bugs or feature requests

## 📄 License

[To be determined]

---

**EduFix** - Transforming Education Through Adaptive Technology
