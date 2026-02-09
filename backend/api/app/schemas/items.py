from pydantic import BaseModel

class Items(BaseModel):
    item_id: str = None
    name: str
    pic_url: str
    description: str
    unit_price: float
    available_quantity: int
