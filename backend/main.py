from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from models import Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="EduFix API", version="1.0.0")

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

# Include routers
from routers import auth, content, practice, analytics
app.include_router(auth.router, prefix="/auth", tags=["authentication"])
app.include_router(content.router, prefix="/api", tags=["content"])
app.include_router(practice.router, prefix="/api/practice", tags=["practice"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])

# TODO: Add remaining routers for qa, improvement
# from routers import qa, improvement
# app.include_router(qa.router, prefix="/qa", tags=["qa"])
# app.include_router(improvement.router, prefix="/improvement", tags=["improvement"])
