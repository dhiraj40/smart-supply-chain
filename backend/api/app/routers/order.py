from fastapi import APIRouter, status, Depends
from ulid import ULID
from app.schemas.order import OrderCreate
from app.shared.kafka_producer import send_order_event
from app.shared.utils import database as db
from app.auth.dept import get_current_user

from datetime import datetime  

router = APIRouter(prefix="/orders", tags=["Orders"], dependencies=[Depends(get_current_user)])

@router.post("", status_code=status.HTTP_202_ACCEPTED)
def create_order(order: OrderCreate):
    ulid = str(ULID())
    order = send_order_event(ulid, 'OrderCreated', order.model_dump())
    return {"status": "published", "order": order}


@router.get("")
def get_orders():
    return db.getOrders()

@router.get("/{order_id}")
def get_order(order_id: str):
    return {
        "order": order_id,
        "msg": "successfully retrieved."
    }

@router.delete("/{order_id}")
def delete_order(order_id: str):
    # send_event(
    #     event_topic=ORDER_EVENT,
    #     event_id="EVT-"+ order_id,
    #     event_type='OrderDeleted',
    #     payload={
    #         "order_id": order_id,
    #         "updated_at": datetime.now()
    #     }
    # )
    return {
        "order": order_id,
        "msg": "successfully retrieved."
    }
