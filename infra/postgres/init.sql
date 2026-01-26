-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  order_id        VARCHAR PRIMARY KEY,
  customer_id     VARCHAR NOT NULL,
  warehouse_id    VARCHAR NOT NULL,
  status          VARCHAR NOT NULL,
  order_amount    NUMERIC(12,2),
  currency        VARCHAR(3),
  created_at      TIMESTAMP NOT NULL,
  updated_at      TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_status
ON orders(status);

CREATE INDEX IF NOT EXISTS idx_orders_warehouse
ON orders(warehouse_id);

------------------------------------------------

-- Order events table
CREATE TABLE IF NOT EXISTS order_events (
  event_id        UUID PRIMARY KEY,
  order_id        VARCHAR NOT NULL,
  event_type      VARCHAR NOT NULL,
  event_timestamp TIMESTAMP NOT NULL,
  payload         JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_events_order
ON order_events(order_id);

CREATE INDEX IF NOT EXISTS idx_order_events_time
ON order_events(event_timestamp);

------------------------------------------------

-- Shipments table
CREATE TABLE IF NOT EXISTS shipments (
  shipment_id        VARCHAR PRIMARY KEY,
  order_id           VARCHAR NOT NULL,
  status             VARCHAR NOT NULL,
  current_location   VARCHAR,
  expected_delivery  DATE,
  created_at         TIMESTAMP NOT NULL,
  updated_at         TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_shipments_order
ON shipments(order_id);

CREATE INDEX IF NOT EXISTS idx_shipments_status
ON shipments(status);

------------------------------------------------

-- Shipment events table
CREATE TABLE IF NOT EXISTS shipment_events (
  event_id        UUID PRIMARY KEY,
  shipment_id     VARCHAR NOT NULL,
  event_type      VARCHAR NOT NULL,
  event_timestamp TIMESTAMP NOT NULL,
  payload         JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_shipment_events_ship
ON shipment_events(shipment_id);

CREATE INDEX IF NOT EXISTS idx_shipment_events_time
ON shipment_events(event_timestamp);

------------------------------------------------

-- Daily metrics table
CREATE TABLE IF NOT EXISTS daily_metrics (
  metric_date              DATE PRIMARY KEY,
  total_orders             INT,
  delivered_orders         INT,
  delayed_shipments        INT,
  avg_delivery_time_hours  NUMERIC(6,2),
  updated_at               TIMESTAMP NOT NULL
);
