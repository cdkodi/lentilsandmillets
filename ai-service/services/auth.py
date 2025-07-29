"""
Authentication Service for AI Article Generation
Simple JWT-based authentication with CMS integration
"""

import os
import jwt
from datetime import datetime, timedelta
from typing import Dict, Optional
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from utils.logging import get_logger

logger = get_logger(__name__)

security = HTTPBearer()

class AuthService:
    def __init__(self):
        self.secret_key = os.getenv("JWT_SECRET_KEY", "your-secret-key")
        self.algorithm = "HS256"
        self.access_token_expire_minutes = 60
    
    def create_access_token(self, user_data: Dict) -> str:
        """Create JWT access token"""
        try:
            expire = datetime.utcnow() + timedelta(minutes=self.access_token_expire_minutes)
            to_encode = {
                "sub": str(user_data["id"]),
                "email": user_data["email"],
                "role": user_data.get("role", "user"),
                "exp": expire
            }
            
            encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
            return encoded_jwt
            
        except Exception as e:
            logger.error(f"Failed to create access token: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to create access token")
    
    def verify_token(self, token: str) -> Dict:
        """Verify and decode JWT token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            
            user_id = payload.get("sub")
            if user_id is None:
                raise HTTPException(status_code=401, detail="Invalid token")
            
            return {
                "id": int(user_id),
                "email": payload.get("email"),
                "role": payload.get("role", "user")
            }
            
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token has expired")
        except jwt.JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")

auth_service = AuthService()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict:
    """
    Dependency to get current user from JWT token
    For development, we'll use a simplified approach
    """
    try:
        # For development/testing, we'll accept a simple token
        # In production, this would verify against the CMS user system
        
        token = credentials.credentials
        
        # Development bypass - accept 'dev-token' for testing
        if token == "dev-token":
            return {
                "id": 1,
                "email": "admin@lentilsandmillets.com",
                "role": "admin"
            }
        
        # Verify actual JWT token
        user = auth_service.verify_token(token)
        return user
        
    except Exception as e:
        logger.error(f"Authentication failed: {str(e)}")
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_admin_user(current_user: Dict = Depends(get_current_user)) -> Dict:
    """Dependency to ensure user has admin privileges"""
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin privileges required"
        )
    return current_user