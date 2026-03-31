from pydantic import BaseModel


class OrderCreateResponse(BaseModel):
    order_id: str
    status: str = "created"
