# Event Schemas

This document defines the **canonical event schemas** used across the Smart Supply Chain platform.

Kafka events are the **source of truth**.  
All consumers and downstream databases must conform to these schemas.

---

## 📌 Design Principles

- Events are **immutable**
- Events are **append-only**
- Consumers must be **idempotent**
- Schemas are **backward-compatible**
- One event represents **one fact**

---

## 🧾 Common Event Envelope

All events follow this base structure:

```json
{
  "event_id": "uuid",
  "event_type": "STRING",
  "entity_type": "ORDER | SHIPMENT",
  "entity_id": "STRING",
  "timestamp": "ISO-8601",
  "payload": {},
  "metadata": {
    "source": "api | consumer",
    "version": "v1"
  }
}
