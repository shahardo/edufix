from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from models import Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EduFix API",
    description="""
    **EduFix** is an adaptive classroom learning platform that reduces learning gaps through intelligent, multi-modal, and collaborative learning experiences for high school students.

    ## Features

    * **Adaptive Learning**: Personalized practice questions that adjust difficulty based on student performance
    * **Q&A Engine**: Natural language question answering with AI-powered responses
    * **Teacher Analytics**: Comprehensive dashboards showing class mastery, individual student progress, and gap identification
    * **Content Improvement**: AI-powered analysis and suggestions for enhancing teaching materials
    * **Multi-lingual Support**: Full Hebrew (RTL) and English (LTR) interface support
    * **Gamification**: Points, badges, and streaks to motivate student engagement

    ## Authentication

    All API endpoints (except registration and login) require JWT token authentication:

    ```
    Authorization: Bearer <your-jwt-token>
    ```

    ## User Roles

    - **Student**: Access to practice questions, personal progress, and content viewing
    - **Teacher**: Full content management, class analytics, and student insights

    ## Response Codes

    - `200`: Success
    - `201`: Created
    - `400`: Bad Request - Invalid input data
    - `401`: Unauthorized - Missing or invalid JWT token
    - `403`: Forbidden - Insufficient permissions
    - `404`: Not Found - Resource doesn't exist
    - `422`: Unprocessable Entity - Validation error
    - `500`: Internal Server Error
    """,
    version="1.0.0",
    contact={
        "name": "EduFix Development Team",
        "email": "support@edufix.com",
    },
    license_info={
        "name": "Proprietary",
        "url": "https://edufix.com/license",
    },
    terms_of_service="https://edufix.com/terms",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    """Root endpoint."""
    return {"message": "Welcome to EduFix API"}

# Include routers with comprehensive tags and descriptions
from routers import auth, content, practice, analytics

app.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"],
    responses={
        401: {"description": "Unauthorized - Invalid or missing JWT token"},
        403: {"description": "Forbidden - Insufficient permissions"},
        422: {"description": "Validation Error - Invalid input data"}
    }
)

app.include_router(
    content.router,
    prefix="/api",
    tags=["Content Management"],
    responses={
        401: {"description": "Unauthorized - Authentication required"},
        403: {"description": "Forbidden - Only teachers can manage content"},
        404: {"description": "Not Found - Resource doesn't exist"}
    }
)

app.include_router(
    practice.router,
    prefix="/api/practice",
    tags=["Practice System"],
    responses={
        401: {"description": "Unauthorized - Authentication required"},
        403: {"description": "Forbidden - Only students can access practice"},
        404: {"description": "Not Found - Question or resource not found"}
    }
)

app.include_router(
    analytics.router,
    prefix="/api/analytics",
    tags=["Analytics & Insights"],
    responses={
        401: {"description": "Unauthorized - Authentication required"},
        403: {"description": "Forbidden - Only teachers can access analytics"},
        404: {"description": "Not Found - Student or class not found"}
    }
)

# TODO: Add remaining routers for qa, improvement
# from routers import qa, improvement
# app.include_router(qa.router, prefix="/qa", tags=["qa"])
# app.include_router(improvement.router, prefix="/improvement", tags=["improvement"])
