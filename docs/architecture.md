
---

# 📄 `docs/architecture.md`

```md
# System Architecture

This document explains the **end-to-end architecture** of the Smart Supply Chain Event Tracker.

The system follows an **event-driven architecture** with Kafka as the backbone.

---

## 🎯 Architectural Goals

- Loose coupling between services
- Asynchronous processing
- High scalability
- Replayability
- Fault tolerance

---

## 🧱 High-Level Components

### 1. Frontend
- Displays orders, shipments, and KPIs
- Consumes REST APIs
- No business logic

### 2. Backend API
- Handles user requests
- Performs validation
- Produces Kafka events
- Stateless

### 3. Kafka
- Central event backbone
- Guarantees ordering per entity
- Enables multiple consumers

### 4. Kafka Consumers
- Order Processor
- Shipment Tracker
- Analytics Aggregator

### 5. Databases
- PostgreSQL: materialized views
- Redis: low-latency access

---

## 🔄 Event Flow Diagram

```text
+-----------+        +---------------+        +----------------+
| Frontend  | -----> | Backend API   | -----> | Kafka Producer |
+-----------+        +---------------+        +----------------+
                                                      |
                                                      v
                                              +----------------+
                                              |   Kafka Topics |
                                              +----------------+
                                                      |
                ----------------------------------------------------------------
                |                               |                              |
                v                               v                              v
      +-------------------+        +----------------------+        +----------------------+
      | Order Consumer    |        | Shipment Consumer    |        | Analytics Consumer   |
      +-------------------+        +----------------------+        +----------------------+
                |                               |                              |
                v                               v                              v
        +--------------+              +------------------+              +------------------+
        | PostgreSQL   |              | PostgreSQL       |              | Metrics Tables   |
        +--------------+              +------------------+              +------------------+
                |
                v
           +-----------+
           |   Redis   |
           +-----------+
