from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class MessageCreate(BaseModel):
    content: str

class MessageOut(BaseModel):
    id: int
    user_id: int
    content: str
    created_at: Optional[datetime]
    class Config:
        from_attributes = True