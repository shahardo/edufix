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

- **Backend**: Python FastAPI with SQLAlchemy ORM, JWT authentication
- **Database**: SQLite (development) / PostgreSQL (production)
- **Frontend**: React (separate repository, configured for CORS)
- **AI Integration**: External NLP services for Q&A and content improvement

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Backend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shahardo/edufix.git
   cd edufix
   ```

2. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

3. **Create virtual environment**:
   ```bash
   python -m venv venv
   ```

4. **Activate virtual environment**:
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - Linux/Mac:
     ```bash
     source venv/bin/activate
     ```

5. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

6. **Run the development server**:
   ```bash
   uvicorn main:app --reload
   ```

7. **Access the API**:
   - API endpoint: http://localhost:8000
   - Interactive API documentation: http://localhost:8000/docs
   - Alternative docs: http://localhost:8000/redoc

The SQLite database file `edufix.db` will be created automatically in the backend directory.

### Frontend Setup

The frontend is a separate React application that connects to this API. It should be run on port 3000 (CORS configured).

*Note: Frontend repository is not included in this codebase.*

### Running Tests

To run the test suite (requires virtual environment activated):

```bash
cd backend
pytest
```

## Project Structure

```
edufix/
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── database.py          # Database configuration
│   ├── models.py            # SQLAlchemy models
│   ├── requirements.txt     # Python dependencies
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py          # Authentication endpoints
│   │   └── ...              # Additional routers (TODO)
│   ├── tests/
│   │   └── test_auth.py     # Authentication tests
│   └── ...
├── docs/
│   ├── perplexity Mockup Spec.md    # UI mockups and user flows
│   └── perplexity PRD.md            # Complete product requirements
├── .gitignore
└── README.md
```

## Development Status

This is Phase 1 of the EduFix platform, focusing on core MVP functionality:

- ✅ Authentication system
- ✅ Basic API structure
- 🔄 Student learning flows (in development)
- 🔄 Teacher analytics (in development)
- 🔄 Content improvement module (planned)
- 🔄 Multi-lingual UI (planned)

See `docs/perplexity PRD.md` for detailed roadmap and feature specifications.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

[To be determined]

## Contact

For questions or support, please contact the development team.
