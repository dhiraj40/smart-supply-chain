from fastapi import APIRouter, status, Request
from uuid import uuid4
from app.schemas.shipment import ShipmentCreate
from app.shared.kafka_producer import send_shipment_event

from datetime import datetime  

router = APIRouter(prefix="/shipments", tags=["Shipments"])

@router.post("", status_code=status.HTTP_202_ACCEPTED)
def create_order(shipment: ShipmentCreate):
    # producer = get_kafka_producer()
    send_shipment_event(
        event_type='ShipmentCreated',
        shipment_id=shipment.shipment_id,
        payload=shipment.model_dump()
    )
    return {"status": "published", "shipment": shipment}