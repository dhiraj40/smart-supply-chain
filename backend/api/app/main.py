from fastapi import FastAPI, HTTPException, Response, Depends
from fastapi.middleware.cors import CORSMiddleware
from ulid import ULID

from app.auth.auth import create_access_token, get_password_hash, login_user, verify_token
from app.routers import catalog, order, shipment
from app.schemas.request.auth import LoginRequest
from app.schemas.response.auth import LoginResponse, TokenResponse
from app.shared.kafka_producer import get_kafka_producer
from contextlib import asynccontextmanager

from app.shared.utils.database import createUser, createUser
from app.schemas.request.user import UserCreateRequest
from app.schemas.request.user import UserCreateRequest
from app.schemas.response.user import UserCreateResponse
from app.auth.dept import get_current_user

# Fake user database (for demo)
FAKE_USER = {
    "username": "admin",
    "password": "admin"
}

app = FastAPI(title="Smart Supply Chain API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", "http://127.0.0.1:3000",
        "http://localhost:3005", "http://127.0.0.1:3005"
    ],  # React app
    allow_credentials=True,
    allow_methods=["*"],  # allows OPTIONS, POST, GET, etc.
    allow_headers=["*"],  # allows Content-Type, Authorization
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize Kafka producer on startup
    print("Starting up... Initializing Kafka producer.")
    app.state.kafka_producer = get_kafka_producer()
    yield
    # Close Kafka producer on shutdown
    print("Shutting down... Closing Kafka producer.")
    producer = app.state.kafka_producer
    producer.flush()
    producer.close()


# @app.on_event("startup")
# def startup_event():
#     # Initialize Kafka producer on startup
#     app.state.kafka_producer = get_kafka_producer()
    
# @app.on_event("shutdown")
# def shutdown_event():
#     # Close Kafka producer on shutdown
#     producer = app.state.kafka_producer
#     producer.flush()
#     producer.close()

# Include routers
app.include_router(catalog.router)
app.include_router(order.router)
app.include_router(shipment.router)

# Health check endpoint
@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}

@app.post('/login', response_model=LoginResponse)
def login(data: LoginRequest, response: Response):
    access_token, refresh_token, user_profile= login_user(username=data.username, password=data.password)

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,  # Set to True in production with HTTPS
        samesite="lax"
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,  # Set to True in production with HTTPS
        samesite="lax"
    )
    return {"message": "Login success", "user_profile": user_profile}

@app.post('/logout')
def logout(response: Response):
    response.delete_cookie(key="access_token")
    response.delete_cookie(key="refresh_token")
    return {"message": "Logout success"}

@app.post('/refresh')
def refresh_token(response: Response, refresh_token: str = Depends(get_current_user)):
    payload = verify_token(refresh_token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    
    new_access_token = create_access_token({"sub": user_id})
    response.set_cookie(
        key="access_token",
        value=new_access_token,
        httponly=True,
        secure=False,  # Set to True in production with HTTPS
        samesite="lax"
    )
    return {"message": "Token refreshed"}

@app.post('/signup', response_model=UserCreateResponse)
def signup(data: UserCreateRequest):
    # Implementation for user signup
    user_id = f"user_{ULID()}"
    hashed_password = get_password_hash(data.password)
    user_profile = data.user_profile
    createUser(
        user_id=user_id,
        first_name=user_profile.first_name,
        last_name=user_profile.last_name,
        email=user_profile.email,
        date_of_birth=user_profile.date_of_birth,
        profile_picture_url=user_profile.profile_picture_url,
        password_hash=hashed_password
    )
    return UserCreateResponse(user_id=user_id)


# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the Smart Supply Chain API"}
