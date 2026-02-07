from sqlalchemy.orm import declarative_base
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.dialects.postgresql import JSONB
import datetime


Base = declarative_base()
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
    event_timestamp = Column(DateTime, index=True, nullable=False)
    payload = Column(JSONB, nullable=False)

class Shipment(Base):
    __tablename__ = "shipments"
    
    shipment_id = Column(String, primary_key=True, nullable=False)
    order_id = Column(String, index=True, nullable=False)
    status = Column(String, index=True, nullable=False)
    current_location = Column(String, nullable=True)
    expected_delivery = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc), onupdate=datetime.datetime.now(datetime.timezone.utc))

class ShipmentEvent(Base):
    __tablename__ = "shipment_events"
    
    event_id = Column(String, primary_key=True, nullable=False)
    shipment_id = Column(String, index=True, nullable=False)
    event_type = Column(String, nullable=False)
    event_timestamp = Column(DateTime, index=True, nullable=False)
    payload = Column(JSONB, nullable=False)

# class DailyMetric(Base):
#     __tablename__ = "daily_metrics"
    
#     metric_date = Column(DateTime, primary_key=True, nullable=False)
#     total_orders = Column(Integer, nullable=False)
#     delivered_orders = Column(Integer, nullable=False)
#     delayed_shipments = Column(Integer, nullable=False)
#     avg_delivery_time_hours = Column(Float, nullable=False)
#     updated_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc), onupdate=datetime.datetime.now(datetime.timezone.utc))