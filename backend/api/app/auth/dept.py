from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer, OAuth2PasswordBearer

from app.auth.auth import verify_token

security_scheme = HTTPBearer()

def get_current_user(credential: HTTPAuthorizationCredentials = Depends(security_scheme)):
    payload = verify_token(token=credential.credentials)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    return payload