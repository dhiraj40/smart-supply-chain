# Event Model for Smart Supply Chain Tracker

This document defines the **Kafka topics, event structure, and partitioning strategy** for the system.

---

## 🎯 Design Principles

- One topic per domain (orders, shipments, analytics)  
- Event ordering guaranteed per entity using **Kafka message key**  
- Events are **self-describing** with `event_type`  
- Schema evolution supported via clear payloads

---

## 🧱 Topics

| Topic Name       | Purpose                                   | Key         |
|-----------------|-------------------------------------------|------------|
| `orders.events`  | All events related to orders              | `order_id` |
| `shipments.events` | All events related to shipments          | `shipment_id` |
| `analytics.events` | Optional: aggregated or special events  | `metric_id` (or none) |

> **Key takeaway:** Using entity IDs as Kafka keys ensures ordering per entity.

---

## 📝 Base Event Envelope

All events follow a **common structure**:

```json
{
  "event_type": "OrderCreated",     // Type of event
  "event_id": "uuid",               // Unique identifier
  "occurred_at": "2026-01-31T12:00:00Z", // ISO timestamp
  "entity_id": "order_123",         // Maps to key (order_id)
  "payload": {
    // Event-specific data
  }
}
