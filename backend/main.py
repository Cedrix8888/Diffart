from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from api.img_routes import router as img_router
from api.llm_routes import router as llm_router
from config import FRONT_URL
import os
app = FastAPI()

# 确保static目录存在
if not os.path.exists("static"):
    os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# 确保对话存储目录存在
if not os.path.exists("data"):
    os.makedirs("data", exist_ok=True)
if not os.path.exists("data/conversations"):
    os.makedirs("data/conversations", exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONT_URL],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(img_router, prefix="/api")
app.include_router(llm_router, prefix="/api")


