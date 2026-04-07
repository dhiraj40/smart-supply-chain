# Frontend Data Requirements

This document defines the backend data and database tables needed to support the
current `frontend/order-app` experience and the next shipment-tracking features.

It is written from the frontend point of view:

- what screens exist or should exist
- what APIs those screens need
- what database tables should back those APIs

## Scope

The current frontend already supports:

- login
- dashboard catalog browsing
- cart and order submission
- settings and logout

The next frontend capability requested is:

- shipment tracking
- shipment list view
- shipment detail view
- shipment status timeline

## Screen To Data Mapping

| Frontend screen | Current status | Required API endpoints | Primary tables needed |
| --- | --- | --- | --- |
| Login | Exists | `POST /login` | `users` or external auth source, `user_sessions` optional |
| Dashboard | Exists | `GET /api/v1/home`, `GET /api/v1/products`, `GET /api/v1/products/{slug}` | `products`, `product_images`, `dashboard_widgets`, `dashboard_widget_products` |
| Cart | Exists | none persisted until checkout | client state only before submission |
| Checkout / Orders | Exists through cart page | `POST /orders`, `GET /orders`, `GET /orders/{order_id}` | `orders`, `order_items`, `order_events` |
| Settings | Exists | `POST /logout` optional | `user_sessions` optional |
| Shipment list | Needed | `GET /shipments`, `GET /orders/{order_id}/shipments` | `shipments` |
| Shipment detail | Needed | `GET /shipments/{shipment_id}` | `shipments` |
| Shipment tracking timeline | Needed | `GET /shipments/{shipment_id}/events` | `shipment_events`, `shipment_checkpoints` optional |
| Dashboard KPIs | Future-ready | `GET /analytics/summary` | `daily_metrics` |

## Recommended Frontend Navigation

To support shipment tracking cleanly, the frontend should expose these primary
pages:

| Navigation key | Label | Purpose |
| --- | --- | --- |
| `dashboard` | Dashboard | Browse catalog, featured products, and summary widgets |
| `cart` | Orders | Review cart and submit orders |
| `shipments` | Shipments | View all shipments and filter by status |
| `shipment-detail` | Shipment Detail | Open a single shipment and inspect tracking progress |
| `settings` | Settings | Logout and session controls |

## Required Database Tables

### 1. `users`

Use this only if authentication is local to this system. If auth comes from an
external provider, this table can be replaced by an identity service.

| Column | Type | Required | Notes |
| --- | --- | --- | --- |
| `user_id` | `VARCHAR` | Yes | Primary key |
| `username` | `VARCHAR` | Yes | Unique login id |
| `password_hash` | `VARCHAR` | Yes | Never store raw password |
| `display_name` | `VARCHAR` | No | Used in UI |
| `role` | `VARCHAR` | Yes | Admin, operator, manager, etc. |
| `created_at` | `TIMESTAMP` | Yes | Audit |
| `updated_at` | `TIMESTAMP` | Yes | Audit |

### 2. `user_sessions`

Optional, but useful if the frontend should support server-side logout or token
revocation.

| Column | Type | Required | Notes |
| --- | --- | --- | --- |
| `session_id` | `VARCHAR` | Yes | Primary key |
| `user_id` | `VARCHAR` | Yes | FK to `users.user_id` |
| `access_token` | `VARCHAR` | Yes | Token or token reference |
| `expires_at` | `TIMESTAMP` | Yes | Session expiry |
| `created_at` | `TIMESTAMP` | Yes | Audit |

### 3. `products`

This is required if the catalog should be data-driven instead of hardcoded in
`catalog_data.py`.

| Column | Type | Required | Notes |
| --- | --- | --- | --- |
| `product_id` | `VARCHAR` | Yes | Primary key |
| `slug` | `VARCHAR` | Yes | Unique URL-safe identifier |
| `brand` | `VARCHAR` | No | Used in product cards and detail |
| `title` | `VARCHAR` | Yes | Main display title |
| `description` | `TEXT` | No | Product description |
| `thumbnail_url` | `TEXT` | Yes | Card image |
| `mrp` | `NUMERIC(12,2)` | No | Optional list price |
| `selling_price` | `NUMERIC(12,2)` | Yes | Customer-facing price |
| `currency` | `VARCHAR(3)` | Yes | Usually `USD` |
| `category_slug` | `VARCHAR` | Yes | Used by `/api/v1/products` |
| `rating_average` | `NUMERIC(3,2)` | No | Optional UI display |
| `rating_count` | `INT` | No | Optional UI display |
| `is_active` | `BOOLEAN` | Yes | Hide inactive products |
| `created_at` | `TIMESTAMP` | Yes | Audit |
| `updated_at` | `TIMESTAMP` | Yes | Audit |

### 4. `product_images`

Needed for product detail modals and future gallery support.

| Column | Type | Required | Notes |
| --- | --- | --- | --- |
| `image_id` | `VARCHAR` | Yes | Primary key |
| `product_id` | `VARCHAR` | Yes | FK to `products.product_id` |
| `image_url` | `TEXT` | Yes | Image source |
| `alt_text` | `VARCHAR` | No | Accessibility |
| `sort_order` | `INT` | Yes | Controls UI order |

### 5. `dashboard_widgets`

Needed if the home screen should be configurable instead of generated from
hardcoded Python data.

| Column | Type | Required | Notes |
| --- | --- | --- | --- |
| `widget_id` | `VARCHAR` | Yes | Primary key |
| `widget_type` | `VARCHAR` | Yes | `HeroCarousel`, `ProductScroller`, KPI, etc. |
| `title` | `VARCHAR` | No | Section heading |
| `position_index` | `INT` | Yes | Render order on dashboard |
| `is_active` | `BOOLEAN` | Yes | Enable or disable widget |
| `config_json` | `JSONB` | No | Hero images, links, layout settings |
| `created_at` | `TIMESTAMP` | Yes | Audit |
| `updated_at` | `TIMESTAMP` | Yes | Audit |

### 6. `dashboard_widget_products`

Joins products to dashboard scrollers.

| Column | Type | Required | Notes |
| --- | --- | --- | --- |
| `widget_id` | `VARCHAR` | Yes | FK to `dashboard_widgets.widget_id` |
| `product_id` | `VARCHAR` | Yes | FK to `products.product_id` |
| `sort_order` | `INT` | Yes | Controls order inside the widget |

### 7. `orders`

This table already exists and is required by the current checkout flow.

| Column | Type | Required | Notes |
| --- | --- | --- | --- |
| `order_id` | `VARCHAR` | Yes | Primary key |
| `customer_id` | `VARCHAR` | Yes | User or account placing the order |
| `warehouse_id` | `VARCHAR` | Yes | Fulfillment warehouse |
| `status` | `VARCHAR` | Yes | `created`, `confirmed`, `shipped`, `delivered`, etc. |
| `order_amount` | `NUMERIC(12,2)` | Yes | Total order amount |
| `currency` | `VARCHAR(3)` | Yes | Usually `USD` |
| `created_at` | `TIMESTAMP` | Yes | Order creation time |
| `updated_at` | `TIMESTAMP` | Yes | Latest status update |

### 8. `order_items`

This table is strongly recommended and is currently missing from the SQL init
script. Without it, the frontend cannot reliably show historical order contents.

| Column | Type | Required | Notes |
| --- | --- | --- | --- |
| `order_item_id` | `VARCHAR` | Yes | Primary key |
| `order_id` | `VARCHAR` | Yes | FK to `orders.order_id` |
| `item_id` | `VARCHAR` | Yes | Product id from frontend payload |
| `name` | `VARCHAR` | Yes | Snapshot of item title at checkout time |
| `quantity` | `INT` | Yes | Quantity ordered |
| `unit_price` | `NUMERIC(12,2)` | Yes | Snapshot price |
| `line_total` | `NUMERIC(12,2)` | Yes | `quantity * unit_price` |
| `created_at` | `TIMESTAMP` | Yes | Audit |

### 9. `order_events`

This table already exists and should remain the append-only order timeline.

| Column | Type | Required | Notes |
| --- | --- | --- | --- |
| `event_id` | `VARCHAR` | Yes | Primary key |
| `order_id` | `VARCHAR` | Yes | FK to `orders.order_id` |
| `event_type` | `VARCHAR` | Yes | `OrderCreated`, `OrderCancelled`, etc. |
| `event_timestamp` | `TIMESTAMP` | Yes | Event time |
| `payload` | `JSONB` | Yes | Full event body |

### 10. `shipments`

This table already exists and is the main table required for a shipment list and
shipment detail screen.

| Column | Type | Required | Notes |
| --- | --- | --- | --- |
| `shipment_id` | `VARCHAR` | Yes | Primary key |
| `order_id` | `VARCHAR` | Yes | FK to `orders.order_id` |
| `status` | `VARCHAR` | Yes | `processing`, `packed`, `in_transit`, `delayed`, `delivered` |
| `current_location` | `VARCHAR` | No | Human-readable location |
| `expected_delivery` | `DATE` | No | ETA shown in UI |
| `created_at` | `TIMESTAMP` | Yes | Shipment creation time |
| `updated_at` | `TIMESTAMP` | Yes | Latest tracking update |

### 11. `shipment_events`

This table already exists and is required for a shipment activity timeline.

| Column | Type | Required | Notes |
| --- | --- | --- | --- |
| `event_id` | `VARCHAR` | Yes | Primary key |
| `shipment_id` | `VARCHAR` | Yes | FK to `shipments.shipment_id` |
| `event_type` | `VARCHAR` | Yes | `ShipmentCreated`, `ShipmentInTransit`, `ShipmentDelayed`, `Delivered` |
| `event_timestamp` | `TIMESTAMP` | Yes | Event time |
| `payload` | `JSONB` | Yes | Full event body |

### 12. `shipment_checkpoints`

This table is optional but highly recommended for a richer tracking UI. If not
added, the frontend can derive the timeline from `shipment_events.payload`.

| Column | Type | Required | Notes |
| --- | --- | --- | --- |
| `checkpoint_id` | `VARCHAR` | Yes | Primary key |
| `shipment_id` | `VARCHAR` | Yes | FK to `shipments.shipment_id` |
| `status` | `VARCHAR` | Yes | Tracking step shown in timeline |
| `location` | `VARCHAR` | No | Warehouse, city, or hub |
| `message` | `VARCHAR` | No | Friendly status text for UI |
| `checkpoint_time` | `TIMESTAMP` | Yes | Event occurrence time |
| `sort_order` | `INT` | No | Optional stable ordering |

### 13. `daily_metrics`

This table already exists conceptually, but the SQL init file currently defines
it twice. It should remain a single analytics table for dashboard KPIs.

| Column | Type | Required | Notes |
| --- | --- | --- | --- |
| `metric_date` | `DATE` | Yes | Primary key by day |
| `total_orders` | `INT` | No | Orders created that day |
| `delivered_orders` | `INT` | No | Orders delivered that day |
| `delayed_shipments` | `INT` | No | Count of delayed shipments |
| `avg_delivery_time_hours` | `NUMERIC(6,2)` | No | Average delivery time |
| `updated_at` | `TIMESTAMP` | Yes | Refresh timestamp |

## Shipment Tracking Requirements

To support "track shipments and all", the frontend should be able to render:

| Feature | Minimum fields required |
| --- | --- |
| Shipment list row | `shipment_id`, `order_id`, `status`, `current_location`, `expected_delivery`, `updated_at` |
| Shipment detail header | `shipment_id`, `order_id`, `status`, `expected_delivery`, `current_location` |
| Tracking timeline | `event_type` or checkpoint `status`, `location`, `message`, `event_timestamp` |
| Delay state | `status`, delay reason in `payload` or `message`, latest timestamp |
| Delivered state | `status`, delivery timestamp, delivery location |

## Recommended Shipment APIs

| Method | Path | Purpose | Backing tables |
| --- | --- | --- | --- |
| `GET` | `/shipments` | List all shipments with filters | `shipments` |
| `GET` | `/shipments/{shipment_id}` | Get one shipment | `shipments` |
| `GET` | `/shipments/{shipment_id}/events` | Get shipment timeline | `shipment_events` or `shipment_checkpoints` |
| `GET` | `/orders/{order_id}/shipments` | Show shipments connected to an order | `shipments` |
| `POST` | `/shipments` | Create shipment | `shipments`, `shipment_events` |

## Minimum SQL Changes Recommended

These are the most important gaps between the current backend and the frontend
needs:

| Priority | Change | Why it matters |
| --- | --- | --- |
| High | Add `order_items` table | Required to show ordered products after checkout |
| High | Keep only one `daily_metrics` table definition | Current SQL defines it twice |
| High | Add `GET /shipments/{shipment_id}` | Needed for shipment detail page |
| High | Add `GET /shipments/{shipment_id}/events` | Needed for tracking timeline |
| Medium | Add `shipment_checkpoints` table or normalize timeline from event payloads | Makes tracking UI easier to build |
| Medium | Move catalog data from hardcoded Python to `products` and related tables | Makes dashboard content manageable from data |
| Low | Add `user_sessions` if server-side logout is needed | Useful for better auth control |

## Suggested Build Order

| Step | Deliverable |
| --- | --- |
| 1 | Fix SQL schema gaps: `order_items`, `daily_metrics`, shipment detail support |
| 2 | Add shipment list API and shipment detail API |
| 3 | Add shipment timeline API backed by `shipment_events` |
| 4 | Add `ShipmentsPage` in the frontend navigation |
| 5 | Add `ShipmentDetailPage` or modal |
| 6 | Replace hardcoded catalog data with database-backed product tables if needed |

## Summary

For the current frontend, the minimum persistent tables are:

| Category | Tables |
| --- | --- |
| Catalog | `products`, `product_images`, `dashboard_widgets`, `dashboard_widget_products` |
| Orders | `orders`, `order_items`, `order_events` |
| Shipments | `shipments`, `shipment_events`, `shipment_checkpoints` optional |
| Analytics | `daily_metrics` |
| Auth | `users`, `user_sessions` optional |

If we want the app to support shipment tracking well, `shipments` and
`shipment_events` are mandatory, while `shipment_checkpoints` is the best next
addition for a polished tracking timeline UI.
