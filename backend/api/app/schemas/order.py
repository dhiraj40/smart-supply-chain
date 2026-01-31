from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class OrderCreate(BaseModel):
    order_id: str
    customer_id: str
    warehouse_id: str
    status: Optional[str] = 'processing'
    order_amount: float
    currency: Optional[str] = 'INR'
    created_at: Optional[datetime] = datetime.now()
    updated_at: Optional[datetime] = datetime.now()