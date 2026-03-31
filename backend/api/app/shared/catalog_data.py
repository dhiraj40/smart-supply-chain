from copy import deepcopy
from math import ceil


PAGE_SIZE = 10

PRODUCTS = [
    {
        "id": "PROD-101",
        "slug": "progrip-wireless-scanner-2d",
        "brand": "ProGrip",
        "title": "ProGrip Wireless 2D Scanner",
        "thumbnail": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
        "price": {"mrp": 150.0, "sellingPrice": 89.99, "currency": "USD"},
        "rating": {"average": 4.7, "count": 342},
        "badges": ["Bestseller"],
        "description": "Portable scanner for fast warehouse inventory updates.",
    },
    {
        "id": "PROD-102",
        "slug": "zebra-industrial-label-printer-zt231",
        "brand": "Zebra",
        "title": "Zebra Industrial Label Printer ZT231",
        "thumbnail": "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80",
        "price": {"mrp": 220.0, "sellingPrice": 149.5, "currency": "USD"},
        "rating": {"average": 4.5, "count": 228},
        "badges": ["Top Rated"],
        "description": "High-speed thermal printer for shipping and storage labels.",
    },
    {
        "id": "PROD-103",
        "slug": "trackiq-smart-pallet-tracker",
        "brand": "TrackIQ",
        "title": "TrackIQ Smart Pallet Tracker",
        "thumbnail": "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80",
        "price": {"mrp": 99.0, "sellingPrice": 59.0, "currency": "USD"},
        "rating": {"average": 4.2, "count": 118},
        "badges": [],
        "description": "GPS-enabled tracker for monitoring pallet movement in transit.",
    },
    {
        "id": "PROD-104",
        "slug": "stackpro-heavy-duty-storage-bin",
        "brand": "StackPro",
        "title": "StackPro Heavy Duty Storage Bin",
        "thumbnail": "https://images.unsplash.com/photo-1586880244406-556ebe35f282?auto=format&fit=crop&w=800&q=80",
        "price": {"mrp": 35.0, "sellingPrice": 24.75, "currency": "USD"},
        "rating": {"average": 4.3, "count": 205},
        "badges": [],
        "description": "Stackable bin designed for durable bulk component storage.",
    },
    {
        "id": "PROD-105",
        "slug": "forklift-proximity-safety-sensor-kit",
        "brand": "SafeMove",
        "title": "Forklift Proximity Safety Sensor Kit",
        "thumbnail": "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=800&q=80",
        "price": {"mrp": 260.0, "sellingPrice": 199.0, "currency": "USD"},
        "rating": {"average": 4.6, "count": 164},
        "badges": ["Bestseller"],
        "description": "Proximity sensor kit to improve warehouse vehicle awareness.",
    },
    {
        "id": "PROD-106",
        "slug": "skyscan-automated-inventory-drone",
        "brand": "SkyScan",
        "title": "SkyScan Automated Inventory Drone",
        "thumbnail": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        "price": {"mrp": 699.99, "sellingPrice": 499.99, "currency": "USD"},
        "rating": {"average": 4.4, "count": 86},
        "badges": [],
        "description": "Drone system for aerial inventory scanning in large warehouses.",
    },
    {
        "id": "PROD-107",
        "slug": "warehouse-safety-helmet-led",
        "brand": "SafeGear",
        "title": "Warehouse Safety Helmet with LED",
        "thumbnail": "https://images.unsplash.com/photo-1581093588401-9c8b1e5f3c4e?auto=format&fit=crop&w=800&q=80",
        "price": {"mrp": 55.0, "sellingPrice": 34.99, "currency": "USD"},
        "rating": {"average": 4.1, "count": 63},
        "badges": [],
        "description": "Durable helmet with built-in LED lights for improved visibility.",
    },
    {
        "id": "PROD-108",
        "slug": "ergo-warehouse-operator-chair",
        "brand": "ErgoWorks",
        "title": "ErgoWorks Warehouse Operator Chair",
        "thumbnail": "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80",
        "price": {"mrp": 179.95, "sellingPrice": 129.95, "currency": "USD"},
        "rating": {"average": 4.3, "count": 97},
        "badges": [],
        "description": "Comfortable chair designed for long hours of warehouse work.",
    },
    {
        "id": "PROD-109",
        "slug": "heavy-duty-work-gloves-pair",
        "brand": "GripShield",
        "title": "Heavy Duty Work Gloves (Pair)",
        "thumbnail": "https://images.unsplash.com/photo-1581093588401-9c8b1e5f3c4e?auto=format&fit=crop&w=800&q=80",
        "price": {"mrp": 29.99, "sellingPrice": 19.99, "currency": "USD"},
        "rating": {"average": 4.0, "count": 54},
        "badges": [],
        "description": "Protective gloves designed for handling rough materials safely.",
    },
    {
        "id": "PROD-110",
        "slug": "warehouse-floor-marking-tape-roll",
        "brand": "LineSafe",
        "title": "Warehouse Floor Marking Tape Roll",
        "thumbnail": "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80",
        "price": {"mrp": 21.0, "sellingPrice": 14.5, "currency": "USD"},
        "rating": {"average": 4.2, "count": 73},
        "badges": [],
        "description": "Durable tape for marking aisles and safety zones in warehouses.",
    },
]

HOME_LAYOUT = {
    "layout": [
        {
            "widgetId": "hero_banner_1",
            "type": "HeroCarousel",
            "title": "",
            "data": {
                "images": [
                    {
                        "desktopUrl": "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1800&q=80",
                        "mobileUrl": "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=900&q=80",
                        "link": "/category/warehouse-equipment",
                    },
                    {
                        "desktopUrl": "https://images.unsplash.com/photo-1586528116493-0589f5f1b683?auto=format&fit=crop&w=1800&q=80",
                        "mobileUrl": "https://images.unsplash.com/photo-1586528116493-0589f5f1b683?auto=format&fit=crop&w=900&q=80",
                        "link": "/category/scanners",
                    },
                ],
                "items": [],
            },
        }
    ]
}

FACETS = [
    {
        "key": "connectivity",
        "label": "Connectivity",
        "type": "checkbox",
        "options": [
            {"value": "Wireless", "count": 120},
            {"value": "Bluetooth", "count": 85},
            {"value": "USB", "count": 245},
        ],
    },
    {
        "key": "brand",
        "label": "Brand",
        "type": "checkbox",
        "options": [
            {"value": "ProGrip", "count": 45},
            {"value": "Zebra", "count": 55},
        ],
    },
]

DEFAULT_CATEGORY_PATHS = [
    [
        {"id": "cat_50", "slug": "industrial", "name": "Industrial & Scientific"},
        {"id": "cat_502", "slug": "warehouse-equipment", "name": "Warehouse Equipment"},
    ]
]

DEFAULT_SPECIFICATIONS = [
    {"group": "Performance", "key": "Duty Cycle", "value": "High throughput"},
    {"group": "Physical", "key": "Weight", "value": "150g"},
]


def get_home_layout() -> dict:
    layout = deepcopy(HOME_LAYOUT)
    layout["layout"].append(
        {
            "widgetId": "trending_section_1",
            "type": "ProductScroller",
            "title": "Trending Warehouse Equipment",
            "data": {
                "images": [],
                "items": deepcopy(PRODUCTS[:PAGE_SIZE]),
            },
        }
    )
    return layout


def get_products(category: str = "warehouse-equipment", page: int = 1) -> dict:
    normalized_category = (category or "warehouse-equipment").strip().lower()
    filtered_products = PRODUCTS if normalized_category == "warehouse-equipment" else []
    current_page = max(1, int(page))
    total_items = len(filtered_products)
    total_pages = max(1, ceil(total_items / PAGE_SIZE))
    start_index = (current_page - 1) * PAGE_SIZE
    page_items = filtered_products[start_index : start_index + PAGE_SIZE]

    return {
        "meta": {
            "totalItems": total_items,
            "currentPage": current_page,
            "totalPages": total_pages,
        },
        "results": deepcopy(page_items),
        "facets": deepcopy(FACETS),
    }


def get_product_by_slug(slug: str) -> dict:
    product = next((product for product in PRODUCTS if product["slug"] == slug), None)
    if product is None:
        raise KeyError(slug)

    return {
        "id": product["id"],
        "slug": product["slug"],
        "title": f'{product["title"]} with Stand',
        "brand": product["brand"],
        "description": product["description"],
        "price": deepcopy(product["price"]),
        "images": [
            {"url": product["thumbnail"], "alt": f'{product["title"]} front view'},
            {"url": product["thumbnail"], "alt": f'{product["title"]} side view'},
        ],
        "categoryPaths": deepcopy(DEFAULT_CATEGORY_PATHS),
        "variants": [
            {
                "sku": f'{product["id"]}-STD',
                "attributes": {"Model": "Standard"},
                "price": deepcopy(product["price"]),
                "inventory": {"inStock": True, "quantity": 45},
            }
        ],
        "specifications": deepcopy(DEFAULT_SPECIFICATIONS),
    }
