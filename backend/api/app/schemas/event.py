from pydantic import BaseModel
from datetime import datetime
from typing import Any

class Event(BaseModel):
    event_id: str
    event_type: str
    entity_id: str
    timestamp: datetime
    payload: Any
