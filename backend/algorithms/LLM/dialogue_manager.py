"""
Dialogue Management Service
Handles conversation context, history, and session management
"""

import json
import asyncio
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from uuid import uuid4
import os

@dataclass
class Message:
    role: str  # 'system', 'user', 'assistant'
    content: str
    timestamp: datetime
    message_id: str
    metadata: Optional[Dict[str, Any]] = None

@dataclass
class Conversation:
    conversation_id: str
    user_id: str
    title: str
    messages: List[Message]
    created_at: datetime
    updated_at: datetime
    metadata: Optional[Dict[str, Any]] = None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "conversation_id": self.conversation_id,
            "user_id": self.user_id,
            "title": self.title,
            "messages": [
                {
                    "role": msg.role,
                    "content": msg.content,
                    "timestamp": msg.timestamp.isoformat(),
                    "message_id": msg.message_id,
                    "metadata": msg.metadata
                }
                for msg in self.messages
            ],
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "metadata": self.metadata
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Conversation':
        messages = [
            Message(
                role=msg["role"],
                content=msg["content"],
                timestamp=datetime.fromisoformat(msg["timestamp"]),
                message_id=msg["message_id"],
                metadata=msg.get("metadata")
            )
            for msg in data["messages"]
        ]
        
        return cls(
            conversation_id=data["conversation_id"],
            user_id=data["user_id"],
            title=data["title"],
            messages=messages,
            created_at=datetime.fromisoformat(data["created_at"]),
            updated_at=datetime.fromisoformat(data["updated_at"]),
            metadata=data.get("metadata")
        )

class DialogueManager:
    def __init__(self, storage_dir: str = "data/conversations"):
        self.storage_dir = storage_dir
        self.conversations: Dict[str, Conversation] = {}
        self.max_context_length = 4000  # Maximum tokens for context
        self.cleanup_interval = timedelta(days=7)  # Auto-cleanup old conversations
        
        # Ensure storage directory exists
        os.makedirs(storage_dir, exist_ok=True)
        
        # Load existing conversations
        asyncio.create_task(self._load_conversations())
    
    async def create_conversation(
        self,
        user_id: str,
        title: Optional[str] = None,
        system_message: Optional[str] = None
    ) -> str:
        """Create a new conversation"""
        
        conversation_id = str(uuid4())
        now = datetime.now()
        
        messages = []
        if system_message:
            messages.append(Message(
                role="system",
                content=system_message,
                timestamp=now,
                message_id=str(uuid4())
            ))
        
        conversation = Conversation(
            conversation_id=conversation_id,
            user_id=user_id,
            title=title or f"对话 {now.strftime('%Y-%m-%d %H:%M')}",
            messages=messages,
            created_at=now,
            updated_at=now
        )
        
        self.conversations[conversation_id] = conversation
        await self._save_conversation(conversation)
        
        return conversation_id
    
    async def add_message(
        self,
        conversation_id: str,
        role: str,
        content: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """Add a message to a conversation"""
        
        if conversation_id not in self.conversations:
            raise ValueError(f"Conversation {conversation_id} not found")
        
        conversation = self.conversations[conversation_id]
        message_id = str(uuid4())
        
        message = Message(
            role=role,
            content=content,
            timestamp=datetime.now(),
            message_id=message_id,
            metadata=metadata
        )
        
        conversation.messages.append(message)
        conversation.updated_at = datetime.now()
        
        # Update title if this is the first user message
        if role == "user" and len([m for m in conversation.messages if m.role == "user"]) == 1:
            conversation.title = self._generate_title(content)
        
        await self._save_conversation(conversation)
        return message_id
    
    async def get_conversation(self, conversation_id: str) -> Optional[Conversation]:
        """Get a conversation by ID"""
        return self.conversations.get(conversation_id)
    
    async def get_user_conversations(
        self,
        user_id: str,
        limit: int = 50,
        offset: int = 0
    ) -> List[Conversation]:
        """Get all conversations for a user"""
        
        user_conversations = [
            conv for conv in self.conversations.values()
            if conv.user_id == user_id
        ]
        
        # Sort by updated_at descending
        user_conversations.sort(key=lambda x: x.updated_at, reverse=True)
        
        return user_conversations[offset:offset + limit]
    
    async def delete_conversation(self, conversation_id: str, user_id: str) -> bool:
        """Delete a conversation (with user verification)"""
        
        conversation = self.conversations.get(conversation_id)
        if not conversation or conversation.user_id != user_id:
            return False
        
        del self.conversations[conversation_id]
        await self._delete_conversation_file(conversation_id)
        return True
    
    async def get_context_messages(
        self,
        conversation_id: str,
        max_tokens: Optional[int] = None
    ) -> List[Dict[str, str]]:
        """Get messages formatted for LLM context with token limit"""
        
        conversation = self.conversations.get(conversation_id)
        if not conversation:
            return []
        
        max_tokens = max_tokens or self.max_context_length
        
        # Convert to LLM format
        llm_messages = [
            {"role": msg.role, "content": msg.content}
            for msg in conversation.messages
        ]
        
        # Simple token estimation (4 characters ≈ 1 token)
        current_tokens = 0
        context_messages = []
        
        # Always include system message first
        system_messages = [msg for msg in llm_messages if msg["role"] == "system"]
        if system_messages:
            context_messages.extend(system_messages)
            current_tokens += sum(len(msg["content"]) // 4 for msg in system_messages)
        
        # Add messages from most recent, respecting token limit
        non_system_messages = [msg for msg in llm_messages if msg["role"] != "system"]
        for msg in reversed(non_system_messages):
            msg_tokens = len(msg["content"]) // 4
            if current_tokens + msg_tokens > max_tokens:
                break
            context_messages.insert(-len(system_messages) if system_messages else 0, msg)
            current_tokens += msg_tokens
        
        return context_messages
    
    async def update_conversation_title(
        self,
        conversation_id: str,
        title: str,
        user_id: str
    ) -> bool:
        """Update conversation title"""
        
        conversation = self.conversations.get(conversation_id)
        if not conversation or conversation.user_id != user_id:
            return False
        
        conversation.title = title
        conversation.updated_at = datetime.now()
        await self._save_conversation(conversation)
        return True
    
    def _generate_title(self, first_message: str) -> str:
        """Generate a title from the first user message"""
        
        # Simple title generation - take first 50 characters
        title = first_message.strip()[:50]
        if len(first_message) > 50:
            title += "..."
        
        return title or "新对话"
    
    async def _save_conversation(self, conversation: Conversation):
        """Save conversation to file"""
        
        file_path = os.path.join(self.storage_dir, f"{conversation.conversation_id}.json")
        
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(conversation.to_dict(), f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error saving conversation {conversation.conversation_id}: {e}")
    
    async def _load_conversations(self):
        """Load all conversations from storage"""
        
        if not os.path.exists(self.storage_dir):
            return
        
        for filename in os.listdir(self.storage_dir):
            if filename.endswith('.json'):
                file_path = os.path.join(self.storage_dir, filename)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        conversation = Conversation.from_dict(data)
                        self.conversations[conversation.conversation_id] = conversation
                except Exception as e:
                    print(f"Error loading conversation from {filename}: {e}")
    
    async def _delete_conversation_file(self, conversation_id: str):
        """Delete conversation file from storage"""
        
        file_path = os.path.join(self.storage_dir, f"{conversation_id}.json")
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f"Error deleting conversation file {conversation_id}: {e}")
    
    async def cleanup_old_conversations(self):
        """Clean up old conversations"""
        
        cutoff_date = datetime.now() - self.cleanup_interval
        conversations_to_delete = []
        
        for conversation_id, conversation in self.conversations.items():
            if conversation.updated_at < cutoff_date:
                conversations_to_delete.append(conversation_id)
        
        for conversation_id in conversations_to_delete:
            del self.conversations[conversation_id]
            await self._delete_conversation_file(conversation_id)
        
        if conversations_to_delete:
            print(f"Cleaned up {len(conversations_to_delete)} old conversations")

# Global dialogue manager instance
dialogue_manager = DialogueManager()