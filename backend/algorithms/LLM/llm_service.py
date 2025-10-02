"""
Large Language Model Service
Supports multiple LLM providers including OpenAI, Anthropic, and local models
"""

import asyncio
import json
from typing import List, Dict, Any, Optional, AsyncGenerator
from datetime import datetime
import aiohttp
import os
from enum import Enum

class LLMProvider(str, Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    LOCAL = "local"

class LLMService:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")
        self.local_api_url = os.getenv("LOCAL_LLM_URL", "http://localhost:11434")
        
    async def send_message(
        self,
        messages: List[Dict[str, str]],
        provider: LLMProvider = LLMProvider.OPENAI,
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1000,
        stream: bool = False
    ) -> Dict[str, Any]:
        """
        Send message to LLM and get response
        
        Args:
            messages: List of message objects with 'role' and 'content'
            provider: LLM provider to use
            model: Model name (provider-specific)
            temperature: Randomness of response (0.0-1.0)
            max_tokens: Maximum tokens in response
            stream: Whether to stream response
            
        Returns:
            Response dictionary with content and metadata
        """
        
        if provider == LLMProvider.OPENAI:
            return await self._send_openai_message(
                messages, model or "gpt-3.5-turbo", temperature, max_tokens, stream
            )
        elif provider == LLMProvider.ANTHROPIC:
            return await self._send_anthropic_message(
                messages, model or "claude-3-sonnet-20240229", temperature, max_tokens, stream
            )
        elif provider == LLMProvider.LOCAL:
            return await self._send_local_message(
                messages, model or "llama2", temperature, max_tokens, stream
            )
        else:
            raise ValueError(f"Unsupported provider: {provider}")
    
    async def _send_openai_message(
        self,
        messages: List[Dict[str, str]],
        model: str,
        temperature: float,
        max_tokens: int,
        stream: bool
    ) -> Dict[str, Any]:
        """Send message to OpenAI API"""
        
        if not self.openai_api_key:
            raise ValueError("OpenAI API key not configured")
        
        headers = {
            "Authorization": f"Bearer {self.openai_api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "stream": stream
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=payload
            ) as response:
                
                if response.status != 200:
                    error_text = await response.text()
                    raise Exception(f"OpenAI API error: {response.status} - {error_text}")
                
                if stream:
                    # For streaming, we need to handle it differently
                    content_chunks = []
                    async for chunk in self._handle_openai_stream(response):
                        content_chunks.append(chunk)
                    return {
                        "content": "".join(content_chunks),
                        "model": model,
                        "usage": {},
                        "provider": "openai",
                        "timestamp": datetime.now().isoformat(),
                        "streaming": True
                    }
                else:
                    result = await response.json()
                    return {
                        "content": result["choices"][0]["message"]["content"],
                        "model": result["model"],
                        "usage": result.get("usage", {}),
                        "provider": "openai",
                        "timestamp": datetime.now().isoformat()
                    }
    
    async def _send_anthropic_message(
        self,
        messages: List[Dict[str, str]],
        model: str,
        temperature: float,
        max_tokens: int,
        stream: bool
    ) -> Dict[str, Any]:
        """Send message to Anthropic Claude API"""
        
        if not self.anthropic_api_key:
            raise ValueError("Anthropic API key not configured")
        
        headers = {
            "x-api-key": self.anthropic_api_key,
            "Content-Type": "application/json",
            "anthropic-version": "2023-06-01"
        }
        
        # Convert messages format for Anthropic
        system_message = ""
        claude_messages = []
        
        for msg in messages:
            if msg["role"] == "system":
                system_message = msg["content"]
            else:
                claude_messages.append(msg)
        
        payload = {
            "model": model,
            "messages": claude_messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "stream": stream
        }
        
        if system_message:
            payload["system"] = system_message
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "https://api.anthropic.com/v1/messages",
                headers=headers,
                json=payload
            ) as response:
                
                if response.status != 200:
                    error_text = await response.text()
                    raise Exception(f"Anthropic API error: {response.status} - {error_text}")
                
                if stream:
                    # For streaming, we need to handle it differently
                    content_chunks = []
                    async for chunk in self._handle_anthropic_stream(response):
                        content_chunks.append(chunk)
                    return {
                        "content": "".join(content_chunks),
                        "model": model,
                        "usage": {},
                        "provider": "anthropic",
                        "timestamp": datetime.now().isoformat(),
                        "streaming": True
                    }
                else:
                    result = await response.json()
                    return {
                        "content": result["content"][0]["text"],
                        "model": result["model"],
                        "usage": result.get("usage", {}),
                        "provider": "anthropic",
                        "timestamp": datetime.now().isoformat()
                    }
    
    async def _send_local_message(
        self,
        messages: List[Dict[str, str]],
        model: str,
        temperature: float,
        max_tokens: int,
        stream: bool
    ) -> Dict[str, Any]:
        """Send message to local LLM (e.g., Ollama)"""
        
        # Convert messages to prompt for local models
        prompt = self._messages_to_prompt(messages)
        
        payload = {
            "model": model,
            "prompt": prompt,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "stream": stream
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.local_api_url}/api/generate",
                    json=payload
                ) as response:
                    
                    if response.status != 200:
                        error_text = await response.text()
                        raise Exception(f"Local LLM API error: {response.status} - {error_text}")
                    
                    if stream:
                        # For streaming, we need to handle it differently
                        content_chunks = []
                        async for chunk in self._handle_local_stream(response):
                            content_chunks.append(chunk)
                        return {
                            "content": "".join(content_chunks),
                            "model": model,
                            "usage": {},
                            "provider": "local",
                            "timestamp": datetime.now().isoformat(),
                            "streaming": True
                        }
                    else:
                        result = await response.json()
                        return {
                            "content": result.get("response", ""),
                            "model": model,
                            "usage": {},
                            "provider": "local",
                            "timestamp": datetime.now().isoformat()
                        }
        except aiohttp.ClientError:
            raise Exception("Local LLM service unavailable")
    
    def _messages_to_prompt(self, messages: List[Dict[str, str]]) -> str:
        """Convert messages to a single prompt for local models"""
        prompt_parts = []
        
        for msg in messages:
            role = msg["role"]
            content = msg["content"]
            
            if role == "system":
                prompt_parts.append(f"System: {content}")
            elif role == "user":
                prompt_parts.append(f"Human: {content}")
            elif role == "assistant":
                prompt_parts.append(f"Assistant: {content}")
        
        prompt_parts.append("Assistant:")
        return "\n\n".join(prompt_parts)
    
    async def _handle_openai_stream(self, response) -> AsyncGenerator[str, None]:
        """Handle OpenAI streaming response"""
        async for line in response.content:
            line = line.decode('utf-8').strip()
            if line.startswith('data: '):
                data = line[6:]
                if data == '[DONE]':
                    break
                try:
                    chunk = json.loads(data)
                    if chunk['choices'][0]['delta'].get('content'):
                        yield chunk['choices'][0]['delta']['content']
                except json.JSONDecodeError:
                    continue
    
    async def _handle_anthropic_stream(self, response) -> AsyncGenerator[str, None]:
        """Handle Anthropic streaming response"""
        async for line in response.content:
            line = line.decode('utf-8').strip()
            if line.startswith('data: '):
                data = line[6:]
                try:
                    chunk = json.loads(data)
                    if chunk.get('type') == 'content_block_delta':
                        if chunk['delta'].get('text'):
                            yield chunk['delta']['text']
                except json.JSONDecodeError:
                    continue
    
    async def _handle_local_stream(self, response) -> AsyncGenerator[str, None]:
        """Handle local LLM streaming response"""
        async for line in response.content:
            try:
                chunk = json.loads(line.decode('utf-8'))
                if chunk.get('response'):
                    yield chunk['response']
                if chunk.get('done'):
                    break
            except json.JSONDecodeError:
                continue
    
    async def get_available_models(self, provider: LLMProvider) -> List[str]:
        """Get list of available models for a provider"""
        
        if provider == LLMProvider.OPENAI:
            if not self.openai_api_key:
                return []
            
            headers = {
                "Authorization": f"Bearer {self.openai_api_key}",
            }
            
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.get(
                        "https://api.openai.com/v1/models",
                        headers=headers
                    ) as response:
                        if response.status == 200:
                            result = await response.json()
                            return [model["id"] for model in result["data"] 
                                   if "gpt" in model["id"]]
                        return []
            except:
                return []
        
        elif provider == LLMProvider.ANTHROPIC:
            # Anthropic doesn't have a models endpoint, return known models
            return [
                "claude-3-opus-20240229",
                "claude-3-sonnet-20240229", 
                "claude-3-haiku-20240307"
            ]
        
        elif provider == LLMProvider.LOCAL:
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.get(f"{self.local_api_url}/api/tags") as response:
                        if response.status == 200:
                            result = await response.json()
                            return [model["name"] for model in result.get("models", [])]
                        return []
            except:
                return []
        
        return []

# Global LLM service instance
llm_service = LLMService()