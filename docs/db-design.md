# Database Design

This document describes the database schema and design principles for the
Smart Supply Chain Event Tracker.

Kafka is the source of truth.
PostgreSQL stores materialized views derived from Kafka events.

---

## Design Goals

- Fast reads for APIs and dashboards
- Support event replay and rebuild
- Maintain full event history
- Enable analytics and aggregations
- Safe handling of duplicate events

---

## Storage Strategy

| Layer | Purpose | Technology |
|-----|--------|-----------|
| Event Store | Immutable stream | Kafka |
| OLTP Store | Latest state | PostgreSQL |
| Cache | Low-latency reads | Redis |
| Analytics | Aggregated metrics | PostgreSQL |

---

## Core Tables (PostgreSQL)

---

## Table: `orders`

Stores the **latest state** of each order.

```sql
CREATE TABLE orders (
  order_id        VARCHAR PRIMARY KEY,
  customer_id     VARCHAR NOT NULL,
  warehouse_id    VARCHAR NOT NULL,
  status          VARCHAR NOT NULL,
  order_amount    NUMERIC(12,2),
  currency        VARCHAR(3),
  created_at      TIMESTAMP NOT NULL,
  updated_at      TIMESTAMP NOT NULL
);
