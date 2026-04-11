from pydantic import BaseModel
from app.schemas.response.user import UserProfileResponse

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_profile: UserProfileResponse

class LoginResponse(BaseModel):
    message: str
    user_profile: UserProfileResponse
    