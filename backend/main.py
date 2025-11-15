from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from api.img_routes import router as img_router
from api.llm_routes import router as llm_router
from api.auth_routes import router as auth_router
from config import FRONT_URL
from utils.dependencies import create_tables
import os

app = FastAPI(
    title="Diffart API",
    description="A comprehensive API for AI-powered image generation and user management",
    version="1.0.0"
)

# Create database tables on startup
@app.on_event("startup")
async def startup_event():
    create_tables()

# Ensure static directory exists
if not os.path.exists("static"):
    os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONT_URL, "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api")
app.include_router(img_router, prefix="/api")
app.include_router(llm_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to Diffart API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is running"}


