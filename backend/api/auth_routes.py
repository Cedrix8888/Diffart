from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from services.auth.auth_service import AuthService
from models.auth_models import UserLogin, UserRegister, TokenResponse, UserResponse
from models.db_models import User
from utils.dependencies import get_db, get_current_active_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate user and return access token with user information
    """
    try:
        token_response = AuthService.login_user(
            db=db,
            username=user_data.username,
            password=user_data.password
        )
        return token_response
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during login"
        )

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """
    Register a new user account
    """
    try:
        db_user = AuthService.create_user(db=db, user_data=user_data)
        return UserResponse(
            id=db_user.id,
            username=db_user.username,
            email=db_user.email,
            is_active=db_user.is_active,
            created_at=db_user.created_at
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during registration"
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get current authenticated user information
    """
    return UserResponse(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        is_active=current_user.is_active,
        created_at=current_user.created_at
    )

@router.post("/verify-token")
async def verify_token(current_user: User = Depends(get_current_active_user)):
    """
    Verify if the provided token is valid
    """
    return {
        "valid": True,
        "user_id": current_user.id,
        "username": current_user.username
    }

@router.post("/logout")
async def logout():
    """
    Logout endpoint (client should remove token)
    """
    return {"message": "Successfully logged out"}

@router.put("/change-password")
async def change_password(
    current_password: str,
    new_password: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Change user password
    """
    # Verify current password
    if not AuthService.verify_password(current_password, current_user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Validate new password
    if len(new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 6 characters long"
        )
    
    # Update password
    current_user.password = AuthService.get_password_hash(new_password)
    db.commit()
    
    return {"message": "Password updated successfully"}