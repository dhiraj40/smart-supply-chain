from pydantic import BaseModel
from typing import Optional
import datetime

class ShipmentCreate(BaseModel):
    shipment_id: str
    order_id: str
    status:Optional[str] = 'processing'
    current_location: str
    expected_delivery: datetime.date
    created_at: Optional[datetime] = datetime.now()
    updated_at: Optional[datetime] = datetime.now()

