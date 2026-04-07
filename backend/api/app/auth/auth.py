from datetime import datetime, timedelta, timezone
from http.client import HTTPException
from jose import jwt, JWTError

from app.shared.utils.database import getUserCredential, getUserProfile
from passlib.context import CryptContext


SECRET_KEY = "super-secret-key"   # move to env in real apps
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

def login_user(username: str, password: str):
    # In real apps, verify username and password against the database
    user_credential = getUserCredential(email=username)
    if not user_credential:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not verify_password(password, user_credential["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_profile = getUserProfile(username)
    if not user_profile:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token_data = {
        "sub": user_profile["user_id"],
    }
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    return access_token, refresh_token, user_profile