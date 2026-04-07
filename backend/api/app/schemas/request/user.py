from datetime import datetime

from pydantic import BaseModel

class UserProfile(BaseModel):
    first_name: str
    last_name: str
    email: str
    date_of_birth: str  # ISO format date string (e.g., "1990-01-01")
    profile_picture_url: str = None


class UserCreateRequest(BaseModel):
    user_profile: UserProfile
    password: str