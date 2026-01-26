# Kafka Topics

This document defines the Kafka topics used in the Smart Supply Chain Event Tracker.

---

## Topic: `order.events`

**Purpose**  
Tracks the lifecycle of an order.

**Key**  
`order_id`

**Producers**  
- Backend API

**Consumers**  
- Order Consumer  
- Shipment Consumer  
- Analytics Consumer

**Events**
- `ORDER_CREATED`
- `ORDER_CONFIRMED`
- `ORDER_SHIPPED`

**Partitions**  
3

**Retention**  
30 days

---

## Topic: `shipment.events`

**Purpose**  
Tracks shipment status and movement.

**Key**  
`shipment_id`

**Producers**  
- Shipment Consumer  
- Backend API (optional)

**Consumers**  
- Shipment Consumer  
- Analytics Consumer

**Events**
- `SHIPMENT_IN_TRANSIT`
- `SHIPMENT_DELAYED`
- `DELIVERED`

**Partitions**  
3

**Retention**  
30 days

---

## Topic: `delay.events`

**Purpose**  
Captures shipment delay events.

**Key**  
`shipment_id`

**Producers**  
- Shipment Consumer

**Consumers**  
- Analytics Consumer

**Events**
- `SHIPMENT_DELAYED`

**Partitions**  
2

**Retention**  
14 days

---

## Topic: `analytics.events`

**Purpose**  
Stores aggregated metrics for dashboards.

**Key**  
`metric_date`

**Producers**  
- Analytics Consumer

**Consumers**  
- Dashboard / Reporting jobs

**Events**
- `DAILY_METRIC`

**Partitions**  
1

**Retention**  
90 days
