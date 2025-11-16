from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

class UserLogin(BaseModel):
    username: str = Field(..., min_length=3, description="The username of the user")
    password: str = Field(..., min_length=6, description="The password of the user")

class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, description="The username of the user")
    email: EmailStr = Field(..., description="The email address of the user")
    password: str = Field(..., min_length=6, description="The password of the user")
        
    # @field_validator('password')
    # @classmethod
    # def validate_password(cls, v):
    #     if len(v) < 6:
    #         raise ValueError('Password must be at least 6 characters long')
    #     return v

class UserResponse(BaseModel):
    user_id: str = Field(..., description="Unique identifier for the user")
    username: str = Field(..., description="The username of the user")
    email: EmailStr = Field(..., description="The email address of the user")
    is_active: bool = Field(..., description="Indicates if the user is active")
    created_at: datetime | None = Field(None, description="User creation time")

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field("bearer", description="Type of the token")
    user: UserResponse = Field(..., description="The authenticated user information")

class TokenData(BaseModel):
    user_id: str | None = Field(None, description="Unique identifier for the user")