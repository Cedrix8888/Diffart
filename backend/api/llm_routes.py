from fastapi import APIRouter, Depends, HTTPException, status
from models.qwen_models import QwenRequest, QwenResponse, ErrorResponse
from services.llm.llm_services import llm_chat
from utils.security import get_api_key
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(
    prefix="/llm",
    tags=["大语言模型"],
    dependencies=[Depends(get_api_key)],
    responses={
        400: {"model": ErrorResponse, "description": "无效请求"},
        401: {"model": ErrorResponse, "description": "API Key 验证失败"},  
        500: {"model": ErrorResponse, "description": "服务器错误"}
    }
)

@router.post(
    path="/chat",
    response_model=QwenResponse,
    summary="发送聊天消息",
    description="发送消息到大语言模型并获取回复，支持对话上下文",
)
async def request_qwen(request: QwenRequest):
    try:
        result = await llm_chat(
            prompt=request.prompt,
        )
        
        return QwenResponse(
            user_id=result["user_id"],
            request_id=result["request_id"],
            thinking_content=None,
            content=result["content"],
            timestamp=result["timestamp"]
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "user_id": request.user_id,
                "error_message": str(e),
                }
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "user_id": request.user_id,
                "error_message": "服务器内部错误，请稍后再试。",
            }
        )