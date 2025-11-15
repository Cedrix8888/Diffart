from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from enum import Enum

class LLMProvider(str, Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    LOCAL = "local"

class ChatMessage(BaseModel):
    role: str = Field(..., description="Message role: system, user, or assistant")
    content: str = Field(..., description="Message content")

class ConversationRequest(BaseModel):
    user_id: str = Field("zx", description="User ID")
    title: Optional[str] = Field(None, description="Conversation title")
    system_message: Optional[str] = Field(None, description="Initial system message")

class RgbRequest(BaseModel):
    user_id: str = Field("zx", description="User ID for image generation")
    width: int = Field(1400, gt=0, description="Image width in pixels")
    height: int = Field(2993, gt=0, description="Image height in pixels")
    color: str = Field("#000000", description="Background color in hex format")

class LayerRequest(BaseModel):
    user_id: str = Field("zx", description="User ID for image generation")
    width: int = Field(1400, gt=0, description="Image width in pixels")
    height: int = Field(2993, gt=0, description="Image height in pixels")
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
