from fastapi import APIRouter, status, Depends
from ulid import ULID
from app.schemas.shipment import ShipmentCreate
from app.shared.kafka_producer import send_shipment_event
from app.shared.utils import database
from app.auth.dept import get_current_user

from datetime import datetime  

router = APIRouter(prefix="/shipments", tags=["Shipments"], dependencies=[Depends(get_current_user)])

@router.post("", status_code=status.HTTP_202_ACCEPTED)
def create_shipment(shipment: ShipmentCreate):
    ulid = str(ULID())
    shipment = send_shipment_event(ulid, 'ShipmentCreated', shipment.model_dump())
    return {"status": "published", "shipment": shipment}

@router.get("")
def get_shipments():
    return database.getShipments()