from pydantic import BaseModel, Field
from typing import Any
from datetime import datetime


class QwenConfig(BaseModel):
    """Configuration for loading/using the Qwen model.

    This mirrors common options used in `backend/algorithms/LLM/qwen.py` and
    centralizes default values so other code can validate/configure runs.
    """

    device_map: str | dict[str, Any] = Field("auto", description="Device mapping for model loading (e.g. 'auto' or explicit mapping dict)")
    torch_dtype: str | None = Field("auto", description="Torch dtype to pass to from_pretrained (e.g. 'auto', 'float16')")
    enable_thinking: bool = Field(True, description="Whether to enable model \"thinking\"inner monologue parsing")


class QwenMessage(BaseModel):
    """A single chat message (role/content) used by the Qwen chat tokenizer helpers."""

    role: str = Field(..., description="Message role: e.g., 'user', 'assistant', 'system'")
    content: str = Field(..., description="Message content text")


class QwenRequest(BaseModel):
    """Input payload used to request generation from the Qwen runner.

    Either `prompt` or `messages` may be provided. When `messages` is present
    it will be formatted using the project's chat template helpers (as in qwen.py).
    """
    user_id: str = Field("zx", description="用户ID")
    prompt: str | None = Field("Give me a short introduction to large language model.", description="A plain text prompt; mutually-compatible with messages")
    messages: list[QwenMessage] | None = Field(None, description="Optional list of structured chat messages")
    config: QwenConfig | None = Field(None, description="Optional per-request config override")


class QwenResponse(BaseModel):
    """Structured response returned after running the Qwen model.

    - thinking_content: inner 'thinking' portion if thinking mode was used
    - content: final generated content intended for the user
    - output_ids: raw token ids produced by the model (post-generation)
    - raw: optional field for any additional debug/metadata (model logits, shapes etc.)
    """
    user_id: str = Field(default="zx", description="用户ID")
    request_id: str = Field(..., description="请求唯一标识ID")
    thinking_content: str | None = Field(None, description="Parsed 'thinking' content (if present)")
    content: str = Field(..., description="Final generated content")
    timestamp: datetime = Field(default_factory=datetime.now, description="请求处理时间(UTC)")


class ErrorResponse(BaseModel):
    user_id: str = Field("zx", description="用户ID")
    success: bool = Field(False, description="请求失败")
    error_message: str = Field(..., description="错误详细信息")
    timestamp: datetime = Field(default_factory=datetime.now, description="错误发生时间")

__all__ = [
    "QwenConfig",
    "QwenMessage",
    "QwenRequest",
    "QwenResponse",
    "ErrorResponse",
]
