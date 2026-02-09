from fastapi import APIRouter, status, Depends
from ulid import ULID
from app.schemas.event import EventTypes
from app.shared.kafka_producer import send_order_event, send_order_update_event
from app.shared.utils import database as db
from app.auth.dept import get_current_user
import json


router = APIRouter(prefix="/items", tags=["Items"], dependencies=[Depends(get_current_user)])


@router.get("")
def get_items():
    items = db.getItems()
    return json.dumps(items, default=str)