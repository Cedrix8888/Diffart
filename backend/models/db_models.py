from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 与AI生成结果建立一对多关系
    ai_results = relationship("AIResult", back_populates="user", cascade="all, delete-orphan")

class AIResult(Base):
    __tablename__ = "ai_results"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    request_id = Column(String(36), unique=True, nullable=False, index=True)  # 用于追踪请求的唯一ID
    is_successful = Column(Boolean, default=True)  # 标记生成是否成功
    created_at = Column(DateTime, default=datetime.utcnow, index=True)  # 生成时间
    
    # 与用户建立多对一关系
    user = relationship("User", back_populates="ai_results")
    
    # 与图层建立一对多关系
    layers = relationship("Layer", back_populates="ai_result", cascade="all, delete-orphan")
    
class Layer(Base):
    __tablename__ = "layers"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    ai_result_id = Column(String(36), ForeignKey("ai_results.id"), nullable=False, index=True)
    positive_prompt = Column(Text, nullable=False)  # 用户输入的正向提示词
    negative_prompt = Column(Text)  # 可选的负向提示词
    image_path = Column(String(255), nullable=False)  # 生成的图片存储路径
    image_format = Column(String(20))  # 存储图像格式（如png、jpg等）
    created_at = Column(DateTime, default=datetime.utcnow, index=True)  # 图层创建时间
    
    # 关联到AI生成结果
    ai_result = relationship("AIResult", back_populates="layers")
    