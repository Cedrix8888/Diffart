from pathlib import Path
import os

AI_IMAGE_ROOT = Path("static")  
FRONT_URL = "http://localhost:5173"

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

# Security configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production")
API_KEY = os.getenv("API_KEY", "u#Tqw(]%CTO+u&[FQ&G6apADEmKzOqc[Aqk-6W~Z")

# JWT Configuration
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days
ALGORITHM = "HS256"
