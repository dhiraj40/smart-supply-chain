from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Customer(BaseModel):
    customer_name: str
    customer_email: str
    customer_phone: str
    customer_address: str
    username: str
    password: str

class User(BaseModel):
    username: str
    password: str

class UserLogins(BaseModel):
    username: str
    log_event: str
    timestamp: Optional[datetime] = datetime.now()