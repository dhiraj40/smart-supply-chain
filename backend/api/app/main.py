from fastapi import FastAPI
from fastapi import security
from app.routers import order, shipment, items
from app.shared.kafka_producer import get_kafka_producer

from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer, OAuth2PasswordRequestForm

from app.auth.auth import create_access_token
from app.schemas.auth_model import LoginRequest, TokenResponse
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Fake user database (for demo)
FAKE_USER = {
    "username": "admin",
    "password": "admin"
}

app = FastAPI(title="Smart Supply Chain API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React app
    allow_credentials=True,
    allow_methods=["*"],  # allows OPTIONS, POST, GET, etc.
    allow_headers=["*"],  # allows Content-Type, Authorization
)


@app.on_event("startup")
def startup_event():
    # Initialize Kafka producer on startup
    app.state.kafka_producer = get_kafka_producer()
    
@app.on_event("shutdown")
def shutdown_event():
    # Close Kafka producer on shutdown
    producer = app.state.kafka_producer
    producer.flush()
    producer.close()

# Include routers
app.include_router(order.router)
app.include_router(shipment.router)
app.include_router(items.router)

# Health check endpoint
@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}

@app.post('/login', response_model=TokenResponse)
def login(data: LoginRequest):
    if (
        data.username != FAKE_USER["username"]
        or data.password != FAKE_USER["password"]
    ):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    # token = create_access_token(form_data.username)
    token = create_access_token({"sub": data.username})
    return {"access_token": token, "token_type": "bearer"}

# 1. Create the security INSTANCE
security_scheme = HTTPBearer()

@app.get("/protected")
def protected(credentials: HTTPAuthorizationCredentials = Depends(security_scheme)): # <--- USE security
    token = credentials.credentials  # This contains the actual token string
    return {"message": "You are authorized!", "token": token}

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the Smart Supply Chain API"}