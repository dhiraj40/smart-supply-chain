from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.auth.auth import create_access_token
from app.routers import catalog, order, shipment
from app.schemas.request.auth import LoginRequest
from app.schemas.response.auth import TokenResponse
from app.shared.kafka_producer import get_kafka_producer

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
app.include_router(catalog.router)
app.include_router(order.router)
app.include_router(shipment.router)

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

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the Smart Supply Chain API"}
