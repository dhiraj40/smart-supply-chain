# Order App FastAPI Schema

This document captures the API contract currently expected by `frontend/order-app`.
It is derived from the frontend request builders, response mappers, and mock payloads.

## Integration Rules

- Base URL: `http://localhost:8000`
- Content type: `application/json`
- `Authorization: Bearer <token>` is sent for authenticated requests when a session exists.
- `401 Unauthorized` should be returned for invalid or missing auth on protected routes.
- Successful responses should be JSON objects or arrays, not pre-serialized JSON strings.

## Frontend-Driven Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/login` | Authenticate the user and return a bearer token |
| `GET` | `/api/v1/home` | Return dashboard widgets for the order app home screen |
| `GET` | `/api/v1/products?category=<slug>&page=<number>` | Return paginated product catalog data |
| `GET` | `/api/v1/products/{slug}` | Return detailed product information |
| `POST` | `/orders` | Submit an order created from the cart |

## 1. Login

### Request

```json
{
  "username": "admin",
  "password": "admin"
}
```

### Response

```json
{
  "access_token": "jwt-or-token-string",
  "token_type": "bearer"
}
```

### Suggested Pydantic Models

```python
from pydantic import BaseModel


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
```

## 2. Home Layout

### `GET /api/v1/home`

### Response

```json
{
  "layout": [
    {
      "widgetId": "hero_banner_1",
      "type": "HeroCarousel",
      "title": "",
      "data": {
        "images": [
          {
            "desktopUrl": "https://example.com/banner-desktop.jpg",
            "mobileUrl": "https://example.com/banner-mobile.jpg",
            "link": "/category/warehouse-equipment"
          }
        ]
      }
    },
    {
      "widgetId": "trending_section_1",
      "type": "ProductScroller",
      "title": "Trending Warehouse Equipment",
      "data": {
        "items": [
          {
            "id": "PROD-101",
            "slug": "progrip-wireless-scanner-2d",
            "brand": "ProGrip",
            "title": "ProGrip Wireless 2D Scanner",
            "thumbnail": "https://example.com/product.jpg",
            "price": {
              "mrp": 150.0,
              "sellingPrice": 89.99,
              "currency": "USD"
            },
            "badges": ["Bestseller"]
          }
        ]
      }
    }
  ]
}
```

### Suggested Pydantic Models

```python
from typing import List, Literal, Optional, Union
from pydantic import BaseModel


class Price(BaseModel):
    mrp: Optional[float] = None
    sellingPrice: float
    currency: str = "USD"


class HomeProductItem(BaseModel):
    id: str
    slug: str
    brand: Optional[str] = None
    title: str
    thumbnail: str
    price: Price
    badges: List[str] = []
    description: Optional[str] = None


class HeroImage(BaseModel):
    desktopUrl: str
    mobileUrl: Optional[str] = None
    link: Optional[str] = None


class HeroCarouselData(BaseModel):
    images: List[HeroImage]


class ProductScrollerData(BaseModel):
    items: List[HomeProductItem]


class HeroCarouselWidget(BaseModel):
    widgetId: str
    type: Literal["HeroCarousel"]
    title: str = ""
    data: HeroCarouselData


class ProductScrollerWidget(BaseModel):
    widgetId: str
    type: Literal["ProductScroller"]
    title: str
    data: ProductScrollerData


class HomeLayoutResponse(BaseModel):
    layout: List[Union[HeroCarouselWidget, ProductScrollerWidget]]
```

## 3. Product Catalog

### `GET /api/v1/products?category=<slug>&page=<number>`

### Query Params

- `category`: string, defaults to `warehouse-equipment`
- `page`: integer, defaults to `1`

### Response

```json
{
  "meta": {
    "totalItems": 10,
    "currentPage": 1,
    "totalPages": 1
  },
  "results": [
    {
      "id": "PROD-101",
      "slug": "progrip-wireless-scanner-2d",
      "brand": "ProGrip",
      "title": "ProGrip Wireless 2D Scanner",
      "thumbnail": "https://example.com/product.jpg",
      "price": {
        "mrp": 150.0,
        "sellingPrice": 89.99,
        "currency": "USD"
      },
      "rating": {
        "average": 4.7,
        "count": 342
      },
      "badges": ["Bestseller"],
      "description": "Portable scanner for fast warehouse inventory updates."
    }
  ],
  "facets": [
    {
      "key": "brand",
      "label": "Brand",
      "type": "checkbox",
      "options": [
        {
          "value": "ProGrip",
          "count": 45
        }
      ]
    }
  ]
}
```

### Suggested Pydantic Models

```python
from typing import List, Optional
from pydantic import BaseModel


class Rating(BaseModel):
    average: Optional[float] = None
    count: int = 0


class ProductSummary(BaseModel):
    id: str
    slug: str
    brand: Optional[str] = None
    title: str
    thumbnail: str
    price: Price
    rating: Optional[Rating] = None
    badges: List[str] = []
    description: Optional[str] = None


class PaginationMeta(BaseModel):
    totalItems: int
    currentPage: int
    totalPages: int


class FacetOption(BaseModel):
    value: str
    count: int


class Facet(BaseModel):
    key: str
    label: str
    type: str
    options: List[FacetOption]


class ProductsResponse(BaseModel):
    meta: PaginationMeta
    results: List[ProductSummary]
    facets: List[Facet] = []
```

## 4. Product Detail

### `GET /api/v1/products/{slug}`

### Response

```json
{
  "id": "PROD-101",
  "slug": "progrip-wireless-scanner-2d",
  "title": "ProGrip Wireless 2D Scanner with Stand",
  "brand": "ProGrip",
  "description": "High-speed 2D barcode scanner designed for heavy warehouse use.",
  "images": [
    {
      "url": "https://example.com/product-1.jpg",
      "alt": "Front View"
    }
  ],
  "categoryPaths": [
    [
      {
        "id": "cat_50",
        "slug": "industrial",
        "name": "Industrial & Scientific"
      },
      {
        "id": "cat_502",
        "slug": "warehouse-equipment",
        "name": "Warehouse Equipment"
      }
    ]
  ],
  "variants": [
    {
      "sku": "PROD-101-STD",
      "attributes": {
        "Model": "Standard"
      },
      "price": {
        "mrp": 150.0,
        "sellingPrice": 89.99,
        "currency": "USD"
      },
      "inventory": {
        "inStock": true,
        "quantity": 45
      }
    }
  ],
  "specifications": [
    {
      "group": "Performance",
      "key": "Duty Cycle",
      "value": "High throughput"
    }
  ]
}
```

### Suggested Pydantic Models

```python
from typing import Dict, List, Optional
from pydantic import BaseModel


class ProductImage(BaseModel):
    url: str
    alt: Optional[str] = None


class CategoryNode(BaseModel):
    id: str
    slug: str
    name: str


class Inventory(BaseModel):
    inStock: bool
    quantity: int


class ProductVariant(BaseModel):
    sku: str
    attributes: Dict[str, str] = {}
    price: Price
    inventory: Inventory


class ProductSpecification(BaseModel):
    group: str
    key: str
    value: str


class ProductDetailResponse(BaseModel):
    id: str
    slug: str
    title: str
    brand: Optional[str] = None
    description: str = ""
    price: Optional[Price] = None
    images: List[ProductImage] = []
    categoryPaths: List[List[CategoryNode]] = []
    variants: List[ProductVariant] = []
    specifications: List[ProductSpecification] = []
```

## 5. Order Submission

### `POST /orders`

### Request

```json
{
  "order_date": "2026-03-31T16:30:00.000Z",
  "total_amount": 209.98,
  "items": [
    {
      "item_id": "PROD-101",
      "name": "ProGrip Wireless 2D Scanner",
      "quantity": 2,
      "unit_price": 89.99,
      "line_total": 179.98
    },
    {
      "item_id": "PROD-104",
      "name": "StackPro Heavy Duty Storage Bin",
      "quantity": 1,
      "unit_price": 30.0,
      "line_total": 30.0
    }
  ]
}
```

### Response

The frontend expects `order_id` at the top level. It also accepts `id`, but `order_id` should be the canonical field.

```json
{
  "order_id": "01JQ123ABCXYZ7890ORDER",
  "status": "created"
}
```

### Suggested Pydantic Models

```python
from datetime import datetime
from typing import List
from pydantic import BaseModel, Field


class OrderItemRequest(BaseModel):
    item_id: str
    name: str
    quantity: int = Field(gt=0)
    unit_price: float = Field(ge=0)
    line_total: float = Field(ge=0)


class OrderCreateRequest(BaseModel):
    order_date: datetime
    total_amount: float = Field(ge=0)
    items: List[OrderItemRequest]


class OrderCreateResponse(BaseModel):
    order_id: str
    status: str = "created"
```

## Contract Notes

- `POST /orders` should return a flat response. Do not wrap the payload as `{ "order": { ... } }`.
- The frontend does not send `customer_id`, `warehouse_id`, `currency`, `ordered_items`, or `order_amount`.
- The frontend sends `order_date`, `total_amount`, and `items`.
- The frontend creates `order_date` in ISO-8601 format via `new Date().toISOString()`.
- Product list and home widget product payloads use `sellingPrice`, not `unit_price`.
- Product detail may provide price either in `price` or in the first entry of `variants`; returning both is safe.

## Current Backend Gaps Against This Contract

### Already aligned

- `POST /login` request and response shape already match the frontend.

### Needs alignment

- The current backend exposes `/items`, but the frontend expects `/api/v1/home`, `/api/v1/products`, and `/api/v1/products/{slug}`.
- The current `OrderCreate` schema expects `customer_id`, `warehouse_id`, `order_amount`, and `ordered_items`, which does not match the frontend request body.
- The current `POST /orders` route returns:

```json
{
  "status": "published",
  "order": {
    "...": "..."
  }
}
```

The frontend expects:

```json
{
  "order_id": "01JQ123ABCXYZ7890ORDER",
  "status": "created"
}
```

- Route handlers should return Python dict/list objects directly. Avoid `json.dumps(...)` in FastAPI handlers because the frontend calls `response.json()` and expects structured JSON.
