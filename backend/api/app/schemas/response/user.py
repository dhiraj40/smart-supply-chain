from pydantic import BaseModel
from datetime import date
from typing import Optional

class UserProfileResponse(BaseModel):
    user_id: str
    first_name: str
    last_name: str
    email: str
    date_of_birth: date
    profile_picture_url: Optional[str] = None


class UserCreateResponse(BaseModel):
    user_id: str
    status: str = "created"