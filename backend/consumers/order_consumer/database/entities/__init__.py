from sqlalchemy.orm import declarative_base
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.dialects.postgresql import JSONB
import datetime


Base = declarative_base()

class EventTypes:
    CREATED = "CREATED"
    UPDATED = "UPDATED"
    CANCELLED = "CANCELLED"
    COMPLETED = "COMPLETED"

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    order_id = Column(String, unique=True, index=True)
    customer_id = Column(String, nullable=False)
    warehouse_id = Column(String, nullable=False)
    status = Column(String, default="processing", index=True, nullable=False)
    order_amount = Column(Float)
    currency = Column(String(3), default='INR')
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc), onupdate=datetime.datetime.now(datetime.timezone.utc))

class OrderEvent(Base):
    __tablename__ = "order_events"
    
    event_id = Column(String, primary_key=True, nullable=False)
    order_id = Column(String, index=True, nullable=False)
    event_type = Column(String, nullable=False)
    event_timestamp = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc), index=True, nullable=False)
    payload = Column(JSONB, nullable=False)

class ErrorLog(Base):
    __tablename__ = "error_logs"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    error_message = Column(String, nullable=False)
    stack_trace = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc), index=True, nullable=False)

class Item(Base):
    __tablename__ = "items"
    
    item_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    pic_url = Column(String, nullable=True)
    description = Column(String, nullable=True)
    unit_price = Column(Float, nullable=False, default=0.0)
    available_quantity = Column(Integer, nullable=False, default=0)

class OrderedItem(Base):
    __tablename__ = "ordered_items"
    
    order_id = Column(String, primary_key=True, foreign_key="orders.order_id", index=True, nullable=False)
    item_id = Column(String, primary_key=True, foreign_key="items.item_id", index=True, nullable=False)
    quantity = Column(Integer, nullable=False)