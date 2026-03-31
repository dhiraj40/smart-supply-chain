from datetime import datetime

from pydantic import BaseModel, Field


class OrderItemRequest(BaseModel):
    item_id: str
    name: str
    quantity: int = Field(gt=0)
    unit_price: float = Field(ge=0)
    line_total: float = Field(ge=0)


class OrderCreateRequest(BaseModel):
    order_date: datetime
    total_amount: float = Field(ge=0)
    items: list[OrderItemRequest] = Field(min_length=1)
