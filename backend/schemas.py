from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Base schema for User, common attributes
class UserBase(BaseModel):
    username: str
    email: Optional[str] = None
    avatar_url: Optional[str] = None
    github_id: str

# Schema for creating a user (e.g., after GitHub OAuth)
class UserCreate(UserBase):
    pass

# Schema for reading a user (e.g., when returning user data from API)
class User(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True # Pydantic will read data even if it is not a dict, but an ORM model
