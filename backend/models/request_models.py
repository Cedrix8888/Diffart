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

class ChatRequest(BaseModel):
    user_id: str = Field("zx", description="User ID for the chat session")
    conversation_id: Optional[str] = Field(None, description="Conversation ID for context")
    message: str = Field(..., min_length=1, description="User message")
    provider: LLMProvider = Field(LLMProvider.OPENAI, description="LLM provider to use")
    model: Optional[str] = Field(None, description="Specific model to use")
    temperature: float = Field(0.7, ge=0.0, le=1.0, description="Response randomness")
    max_tokens: int = Field(1000, gt=0, le=4000, description="Maximum tokens in response")
    stream: bool = Field(False, description="Whether to stream the response")
    system_message: Optional[str] = Field(None, description="System message for new conversations")

class ConversationRequest(BaseModel):
    user_id: str = Field("zx", description="User ID")
    title: Optional[str] = Field(None, description="Conversation title")
    system_message: Optional[str] = Field(None, description="Initial system message")

class ConversationUpdateRequest(BaseModel):
    user_id: str = Field("zx", description="User ID")
    title: str = Field(..., min_length=1, description="New conversation title")

class ConversationListRequest(BaseModel):
    user_id: str = Field("zx", description="User ID")
    limit: int = Field(50, gt=0, le=100, description="Number of conversations to return")
    offset: int = Field(0, ge=0, description="Offset for pagination")

class ModelListRequest(BaseModel):
    provider: LLMProvider = Field(..., description="LLM provider to get models for")

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
