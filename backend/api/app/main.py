from fastapi import FastAPI
from app.routers import order
from app.shared.kafka_producer import get_kafka_producer

app = FastAPI(title="Smart Supply Chain API")

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

# Health check endpoint
@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the Smart Supply Chain API"}