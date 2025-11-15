from algorithms.LLM.qwen import llm_qwen
from datetime import datetime
import uuid

async def llm_chat(
    user_id: str = "zx",
    prompt: str = "Give me a short introduction to large language model.",
):
    result = llm_qwen(
        prompt=prompt,
    )
    
    return {
        "user_id": user_id,
        "request_id": str(uuid.uuid4()),
        "content": result['content'],
        "timestamp": datetime.now()
    }
