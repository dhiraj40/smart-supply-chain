from datetime import datetime
from pydantic import BaseModel
from typing import Optional, List

class OrderedItem(BaseModel):
    item_id: str
    quantity: int
    unit_price: float

class OrderCreate(BaseModel):
    order_id: Optional[str]
    customer_id: str
    warehouse_id: str = 'WAR-1'
    status: Optional[str] = 'processing' 
    order_amount: float
    ordered_items: List[OrderedItem]
    currency: Optional[str] = 'INR'
    created_at: Optional[datetime] = datetime.now()
    updated_at: Optional[datetime] = datetime.now()