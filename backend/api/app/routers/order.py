from fastapi import APIRouter, status, Request
from uuid import uuid4
from app.schemas.order import OrderCreate
from app.shared.kafka_producer import send_order_event

from datetime import datetime  

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("", status_code=status.HTTP_202_ACCEPTED)
def create_order(order: OrderCreate):
    # producer = get_kafka_producer()
    send_order_event(
        event_type='OrderCreated',
        order_id=order.order_id,
        payload=order.model_dump()
    )
    return {"status": "published", "order": order}
