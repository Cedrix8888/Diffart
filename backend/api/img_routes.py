from fastapi import APIRouter, Depends, HTTPException, status
from models.img_models import RgbRequest, LayerRequest, SvgRequest, RgbResponse, LayerResponse, SvgResponse, ErrorResponse
from services.img.img_service import layer_rgb, layer_trans, layer_svg
from utils.security import get_api_key
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(
    prefix="/img",
    tags=["图像生成"],
    dependencies=[Depends(get_api_key)],
    responses={
        400: {"model": ErrorResponse, "description": "无效请求"},
        401: {"model": ErrorResponse, "description": "API Key 验证失败"},  
        500: {"model": ErrorResponse, "description": "服务器错误"}
    }
)

@router.post(
    path="/rgb",
    response_model=RgbResponse,  
    summary="生成RGB图像",
    description="生成指定颜色的RGB图像",
)
async def request_rgb(request: RgbRequest):
    try:
        result = await layer_rgb(
            user_id=request.user_id,
            width=request.width,
            height=request.height,
            color=request.color
        )
        
        return RgbResponse(
            request_id=result["request_id"],
            local_path=result["local_path"],
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
        
@router.post(
    path="/layer",
    response_model=LayerResponse,  
    summary="生成单图层图像",
    description="根据传入文本生成带透明通道的单图层图像",
)
async def request_layer(request: LayerRequest):
    try:
        result = await layer_trans(
            user_id=request.user_id,
            width=request.width,
            height=request.height,
            prompt_pos=request.prompt_pos,
            prompt_neg=request.prompt_neg
        )
        
        return LayerResponse(
            request_id=result["request_id"],
            local_path=result["local_path"],
            timestamp=result["timestamp"],
            prompt_pos=result["prompt_pos"],
            prompt_neg=result["prompt_neg"]
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
    path="/svg",
    response_model=SvgResponse,  
    summary="生成矢量文本",
    description="根据传入文本生成矢量文本图像",
)
async def request_svg(request: SvgRequest):
    try:
        result = await layer_svg(
            user_id=request.user_id,
            text=request.text,
            x=request.x,
            y=request.y,
            font_size=request.font_size,
            font_family=request.font_family,
            font_weight=request.font_weight,
            fill=request.fill,
            stroke=request.stroke,
            stroke_width=request.stroke_width,
            style=request.style
        )
        
        return SvgResponse(
            request_id=result["request_id"],
            local_path=result["local_path"],
            timestamp=result["timestamp"],
            text=request.text)
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
