from datetime import datetime, timezone

from fastapi import APIRouter, Depends, status
from ulid import ULID

from app.auth.dept import get_current_user
from app.schemas.event import EventTypes
from app.schemas.request.order import OrderCreateRequest
from app.schemas.response.order import OrderCreateResponse
from app.shared.kafka_producer import send_order_event, send_order_update_event
from app.shared.utils import database as db

router = APIRouter(prefix="/orders", tags=["Orders"], dependencies=[Depends(get_current_user)])


def build_order_event_payload(order: OrderCreateRequest, current_user: dict) -> dict:
    customer_id = str(current_user.get("sub") or current_user.get("username") or "order-app-user")

    return {
        **order.model_dump(),
        "customer_id": customer_id,
        "warehouse_id": "WAR-1",
        "status": "created",
        "currency": "USD",
        "order_amount": order.total_amount,
        "created_at": order.order_date,
        "updated_at": datetime.now(timezone.utc),
        "ordered_items": [
            {
                "item_id": item.item_id,
                "quantity": item.quantity,
                "unit_price": item.unit_price,
            }
            for item in order.items
        ],
    }


@router.post("", status_code=status.HTTP_202_ACCEPTED, response_model=OrderCreateResponse)
def create_order(order: OrderCreateRequest, current_user: dict = Depends(get_current_user)):
    ulid = str(ULID())
    published_order = send_order_event(
        ulid,
        EventTypes.CREATED,
        build_order_event_payload(order, current_user),
    )
    return OrderCreateResponse(
        order_id=published_order["order_id"],
        status=published_order.get("status", "created"),
    )


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
    send_order_update_event(order_id, EventTypes.CANCELLED, {"order_id": order_id})
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
