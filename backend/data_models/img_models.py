from pydantic import BaseModel, Field
from datetime import datetime

# request models
class BaseRequest(BaseModel):
    user_id: str = Field("zx", description="User ID for image generation")
    width: int = Field(1400, gt=0, description="Image width in pixels")
    height: int = Field(2993, gt=0, description="Image height in pixels")
    
class RgbRequest(BaseRequest):
    color: str = Field("#000000", description="Background color in hex format")

class LayerRequest(BaseRequest):
    prompt_pos: str = Field("glass bottle, high quality", min_length=1, description="User input prompt")
    prompt_neg: str = Field("face asymmetry, eyes asymmetry, deformed eyes, open mouth", min_length=1, description="User input prompt")

class SvgRequest(BaseModel):
    user_id: str = Field("zx", description="User ID for image generation")
    text: str = Field("Hello, World!", min_length=1, description="Text to be converted to SVG")
    x: int = Field(10, gt=0, description="X position of the text")
    y: int = Field(50, gt=0, description="Y position of the text")
    font_size: int = Field(40, gt=0, description="Font size of the text")
    font_family: str = Field("Arial", description="Font family of the text")
    font_weight: str = Field("normal", description="Font weight of the text (e.g., normal, bold)")
    fill: str = Field("#000000", description="Fill color of the text in hex format")
    stroke: str | None = Field(None, description="Stroke color of the text")
    stroke_width: int = Field(1, ge=0, description="Stroke width of the text")
    style: dict[str, str] | None = Field(None, description="Additional CSS styles for the text")

# response models
class BaseResponse(BaseModel):
    user_id: str = Field("zx", description="用户ID")
    request_id: str = Field(..., description="请求唯一标识ID")
    local_path: str = Field(..., description="生成图像的本地存储路径")
    timestamp: datetime = Field(default_factory=datetime.now, description="请求处理时间(UTC)")
    success: bool = Field(True, description="请求是否成功")
    message: str = Field("操作成功", description="状态消息")

class RgbResponse(BaseResponse):
    color: tuple = Field((255, 255, 255), description="生成图像的颜色")
    
class LayerResponse(BaseResponse):
    prompt_pos: str = Field("glass bottle, high quality", description="用户输入的正面提示词")
    prompt_neg: str = Field("face asymmetry, eyes asymmetry, deformed eyes, open mouth", description="用户输入的负面提示词")
    class Config:
        from_attributes = True
        
class SvgResponse(BaseResponse):
    text: str = Field(..., description="生成的SVG文本内容")
    

class ErrorResponse(BaseModel):
    user_id: str = Field("zx", description="用户ID")
    success: bool = Field(False, description="请求失败")
    error_message: str = Field(..., description="错误详细信息")
    timestamp: datetime = Field(default_factory=datetime.now, description="错误发生时间")
    