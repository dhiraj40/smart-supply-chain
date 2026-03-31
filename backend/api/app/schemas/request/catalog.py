from pydantic import BaseModel, Field


class ProductListQuery(BaseModel):
    category: str = "warehouse-equipment"
    page: int = Field(default=1, ge=1)
