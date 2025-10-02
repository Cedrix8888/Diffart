from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from models.request_models import (
    ChatRequest, ConversationRequest, ConversationUpdateRequest, 
    ConversationListRequest, ModelListRequest
)
from models.response_models import (
    ChatResponse, ConversationResponse, ConversationListResponse,
    ConversationCreatedResponse, ModelListResponse, ErrorResponse,
    ChatMessageResponse
)
from algorithms.LLM.llm_service import llm_service
from algorithms.LLM.llm_service import LLMProvider as ServiceLLMProvider
from algorithms.LLM.dialogue_manager import dialogue_manager
from utils.security import get_api_key
from dotenv import load_dotenv
import json
from typing import Dict, Any

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
    response_model=ChatResponse,
    summary="发送聊天消息",
    description="发送消息到大语言模型并获取回复，支持对话上下文",
)
async def chat(request: ChatRequest):
    try:
        conversation_id = request.conversation_id
        
        # Create new conversation if none provided
        if not conversation_id:
            conversation_id = await dialogue_manager.create_conversation(
                user_id=request.user_id,
                system_message=request.system_message
            )
        
        # Add user message to conversation
        user_message_id = await dialogue_manager.add_message(
            conversation_id=conversation_id,
            role="user",
            content=request.message
        )
        
        # Get conversation context for LLM
        context_messages = await dialogue_manager.get_context_messages(
            conversation_id=conversation_id,
            max_tokens=request.max_tokens // 2  # Reserve half tokens for response
        )
        
        # Send to LLM
        llm_response = await llm_service.send_message(
            messages=context_messages,
            provider=ServiceLLMProvider(request.provider.value),
            model=request.model,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
            stream=request.stream
        )
        
        # Add assistant message to conversation
        assistant_message_id = await dialogue_manager.add_message(
            conversation_id=conversation_id,
            role="assistant",
            content=llm_response["content"],
            metadata={
                "model": llm_response["model"],
                "provider": llm_response["provider"],
                "usage": llm_response.get("usage", {})
            }
        )
        
        return ChatResponse(
            conversation_id=conversation_id,
            message_id=assistant_message_id,
            content=llm_response["content"],
            model=llm_response["model"],
            provider=llm_response["provider"],
            usage=llm_response.get("usage"),
            timestamp=llm_response["timestamp"]
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

@router.post(
    path="/conversation",
    response_model=ConversationCreatedResponse,
    summary="创建新对话",
    description="创建一个新的对话会话",
)
async def create_conversation(request: ConversationRequest):
    try:
        conversation_id = await dialogue_manager.create_conversation(
            user_id=request.user_id,
            title=request.title,
            system_message=request.system_message
        )
        
        conversation = await dialogue_manager.get_conversation(conversation_id)
        
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={"error_message": "创建对话失败"}
            )
        
        return ConversationCreatedResponse(
            conversation_id=conversation_id,
            title=conversation.title,
            created_at=conversation.created_at.isoformat()
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "user_id": request.user_id,
                "error_message": "创建对话失败，请稍后再试。",
            }
        )

@router.get(
    path="/conversation/{conversation_id}",
    response_model=ConversationResponse,
    summary="获取对话详情",
    description="根据对话ID获取完整对话内容",
)
async def get_conversation(conversation_id: str, user_id: str = "zx"):
    try:
        conversation = await dialogue_manager.get_conversation(conversation_id)
        
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"error_message": "对话不存在"}
            )
        
        if conversation.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"error_message": "无权访问此对话"}
            )
        
        messages = []
        for msg in conversation.messages:
            messages.append(ChatMessageResponse(
                role=msg.role,
                content=msg.content,
                timestamp=msg.timestamp.isoformat(),
                message_id=msg.message_id,
                metadata=msg.metadata
            ))
        
        return ConversationResponse(
            conversation_id=conversation.conversation_id,
            user_id=conversation.user_id,
            title=conversation.title,
            messages=messages,
            created_at=conversation.created_at.isoformat(),
            updated_at=conversation.updated_at.isoformat(),
            metadata=conversation.metadata
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error_message": "获取对话失败，请稍后再试。"}
        )

@router.post(
    path="/conversations",
    response_model=ConversationListResponse,
    summary="获取用户对话列表",
    description="获取指定用户的所有对话，支持分页",
)
async def get_conversations(request: ConversationListRequest):
    try:
        conversations = await dialogue_manager.get_user_conversations(
            user_id=request.user_id,
            limit=request.limit,
            offset=request.offset
        )
        
        conversation_responses = []
        for conv in conversations:
            messages = []
            for msg in conv.messages:
                messages.append(ChatMessageResponse(
                    role=msg.role,
                    content=msg.content,
                    timestamp=msg.timestamp.isoformat(),
                    message_id=msg.message_id,
                    metadata=msg.metadata
                ))
            
            conversation_responses.append(ConversationResponse(
                conversation_id=conv.conversation_id,
                user_id=conv.user_id,
                title=conv.title,
                messages=messages,
                created_at=conv.created_at.isoformat(),
                updated_at=conv.updated_at.isoformat(),
                metadata=conv.metadata
            ))
        
        return ConversationListResponse(
            conversations=conversation_responses,
            total=len(conversations),
            offset=request.offset,
            limit=request.limit
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "user_id": request.user_id,
                "error_message": "获取对话列表失败，请稍后再试。",
            }
        )

@router.put(
    path="/conversation/{conversation_id}",
    summary="更新对话标题",
    description="更新指定对话的标题",
)
async def update_conversation(
    conversation_id: str, 
    request: ConversationUpdateRequest
):
    try:
        success = await dialogue_manager.update_conversation_title(
            conversation_id=conversation_id,
            title=request.title,
            user_id=request.user_id
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"error_message": "对话不存在或无权修改"}
            )
        
        return {"message": "对话标题更新成功"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error_message": "更新对话失败，请稍后再试。"}
        )

@router.delete(
    path="/conversation/{conversation_id}",
    summary="删除对话",
    description="删除指定的对话",
)
async def delete_conversation(conversation_id: str, user_id: str = "zx"):
    try:
        success = await dialogue_manager.delete_conversation(
            conversation_id=conversation_id,
            user_id=user_id
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"error_message": "对话不存在或无权删除"}
            )
        
        return {"message": "对话删除成功"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error_message": "删除对话失败，请稍后再试。"}
        )

@router.post(
    path="/models",
    response_model=ModelListResponse,
    summary="获取可用模型列表",
    description="获取指定LLM提供商的可用模型列表",
)
async def get_models(request: ModelListRequest):
    try:
        models = await llm_service.get_available_models(ServiceLLMProvider(request.provider.value))
        
        return ModelListResponse(
            provider=request.provider.value,
            models=models
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error_message": "获取模型列表失败，请稍后再试。"}
        )