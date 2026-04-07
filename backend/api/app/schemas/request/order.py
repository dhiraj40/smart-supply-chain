from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class OrderItemRequest(BaseModel):
    product_id: str
    quantity: int = Field(gt=0)
    unit_price: float = Field(ge=0)

class OrderCreateRequest(BaseModel):
    order_amount: float = Field(ge=0)
    currency: str = Field(min_length=3, max_length=3, default="INR")
    order_status: str = Field(default="created")
    delivery_address: str
    order_date: datetime
    items: list[OrderItemRequest] = Field(min_length=1)

