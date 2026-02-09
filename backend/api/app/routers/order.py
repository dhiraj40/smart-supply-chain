from fastapi import APIRouter, status, Depends
from ulid import ULID
from app.schemas.order import OrderCreate
from app.schemas.event import EventTypes
from app.shared.kafka_producer import send_order_event, send_order_update_event
from app.shared.utils import database as db
from app.auth.dept import get_current_user
import json

from datetime import datetime  

router = APIRouter(prefix="/orders", tags=["Orders"], dependencies=[Depends(get_current_user)])

@router.post("", status_code=status.HTTP_202_ACCEPTED)
def create_order(order: OrderCreate):
    ulid = str(ULID())
    order = send_order_event(ulid, EventTypes.CREATED, order.model_dump())
    return {"status": "published", "order": order}


@router.get("")
def get_orders():
    return json.dumps(db.getOrders(), default=str)

@router.get("/{order_id}")
def get_order(order_id: str):
    return {
        "order": order_id,
        "msg": "successfully retrieved."
    }

@router.delete("/{order_id}")
def delete_order(order_id: str):
    send_order_update_event(order_id, EventTypes.DELETED, {"order_id": order_id})
    return {
        "order": order_id,
        "msg": "successfully deleted."
    }


@router.post("/completed/{order_id}")
def complete_order(order_id: str):
    send_order_update_event(order_id, EventTypes.COMPLETED, {"order_id": order_id})
    return {
        "order": order_id,
        "msg": "successfully completed."
    }