from sqlalchemy.orm import Session
import uuid
from datetime import datetime
from models.db_models import AIResult  # 导入模型类

def create_ai_result(db: Session, 
                     user_id: str, 
                     prompt: str, 
                     db_path: str, 
                     image_format: str, model_name: str,
                     processing_time: str | None = None, 
                     is_successful: bool = True):
    """
    创建AI生成结果记录并保存到数据库
    
    参数:
        db: 数据库会话
        user_id: 用户ID
        prompt: 用户输入的提示词
        db_path: 数据库存储的图像路径
        image_format: 图像格式
        model_name: 使用的AI模型名称
        processing_time: 处理时间（毫秒）
        is_successful: 是否成功生成
    
    返回:
        新建的AIResult记录
    """
    # 生成唯一请求ID
    request_id = str(uuid.uuid4())
    
    # 创建AIResult对象
    db_result = AIResult(
        user_id=user_id,
        prompt=prompt,
        image_path=db_path,  # 存储相对路径
        image_format=image_format,
        model_name=model_name,
        request_id=request_id,
        is_successful=is_successful,
        processing_time=processing_time,
        created_at=datetime.utcnow()
    )
    
    # 保存到数据库
    db.add(db_result)
    db.commit()
    db.refresh(db_result)  # 刷新获取数据库生成的字段（如id）
    
    return db_result