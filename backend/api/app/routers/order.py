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


# def build_order_event_payload(order: OrderCreateRequest, current_user: dict) -> dict:
#     # user_id = str(current_user.get("sub") or current_user.get("user_id") or "order-app-user")

#     return order.model_dump()


@router.post("/create_order", status_code=status.HTTP_202_ACCEPTED, response_model=OrderCreateResponse)
def create_order(order: OrderCreateRequest, user_id = Depends(get_current_user)):
    ulid = str(ULID())
    order_data = order.model_dump()
    order_data["user_id"] = user_id
    published_order = send_order_event(
        ulid,
        EventTypes.CREATED,
        order_data,
    )
    return OrderCreateResponse(
        order_id=published_order["order_id"],
        status=published_order.get("status", "created"),
    )

@router.get("/")
def list_orders(user_id = Depends(get_current_user)):
    return db.getUserOrders(user_id)


@router.get("/{order_id}")
def get_order_items(order_id: str):
    return db.getOrderedItems(order_id)



# @router.get("/{order_id}")
# def get_order(order_id: str):
#     return {
#         "order": order_id,
#         "msg": "successfully retrieved."
#     }

# @router.delete("/{order_id}")
# def delete_order(order_id: str):
#     send_order_update_event(order_id, EventTypes.CANCELLED, {"order_id": order_id})
#     return {
#         "order": order_id,
#         "msg": "successfully deleted."
#     }


# @router.post("/completed/{order_id}")
# def complete_order(order_id: str):
#     send_order_update_event(order_id, EventTypes.COMPLETED, {"order_id": order_id})
#     return {
#         "order": order_id,
#         "msg": "successfully completed."
#     }
