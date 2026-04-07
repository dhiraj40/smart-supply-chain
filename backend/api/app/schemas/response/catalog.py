from datetime import datetime
from pydantic import BaseModel, Field


class ProductSummaryResponse(BaseModel):
    product_id: str
    slug: str
    brand: str
    product_name: str
    description: str
    thumbnail_url: str
    vendor_id: str
    mrp: float
    selling_price: float
    currency: str
    category_slug: str
    rating_average: float
    rating_count: int = 0
    is_available: bool
    stock: int


class ProductImageResponse(BaseModel):
    image_id: str
    product_id: str
    image_url: str
    alt_text: str | None = None

class ProductReviewResponse(BaseModel):
    review_id: str
    product_id: str
    user_id: str
    rating: int
    review_text: str
    created_at: datetime
    updated_at: datetime

# class Price(BaseModel):
#     mrp: float | None = None
#     sellingPrice: float
#     currency: str = "USD"


# class Rating(BaseModel):
#     average: float | None = None
#     count: int = 0


# class HomeProductItem(BaseModel):
#     id: str
#     slug: str
#     brand: str | None = None
#     title: str
#     thumbnail: str
#     price: Price
#     badges: list[str] = Field(default_factory=list)
#     description: str | None = None


# class HeroImage(BaseModel):
#     desktopUrl: str
#     mobileUrl: str | None = None
#     link: str | None = None


# class HomeWidgetData(BaseModel):
#     images: list[HeroImage] = Field(default_factory=list)
#     items: list[HomeProductItem] = Field(default_factory=list)


# class HomeWidget(BaseModel):
#     widgetId: str
#     type: str
#     title: str = ""
#     data: HomeWidgetData


# class HomeLayoutResponse(BaseModel):
#     layout: list[HomeWidget]


# class ProductSummary(BaseModel):
#     id: str
#     slug: str
#     brand: str | None = None
#     title: str
#     thumbnail: str
#     price: Price
#     rating: Rating | None = None
#     badges: list[str] = Field(default_factory=list)
#     description: str | None = None


# class PaginationMeta(BaseModel):
#     totalItems: int
#     currentPage: int
#     totalPages: int


# class FacetOption(BaseModel):
#     value: str
#     count: int


# class Facet(BaseModel):
#     key: str
#     label: str
#     type: str
#     options: list[FacetOption] = Field(default_factory=list)


# class ProductsResponse(BaseModel):
#     meta: PaginationMeta
#     results: list[ProductSummary] = Field(default_factory=list)
#     facets: list[Facet] = Field(default_factory=list)


# class ProductImage(BaseModel):
#     url: str
#     alt: str | None = None


# class CategoryNode(BaseModel):
#     id: str
#     slug: str
#     name: str


# class Inventory(BaseModel):
#     inStock: bool
#     quantity: int


# class ProductVariant(BaseModel):
#     sku: str
#     attributes: dict[str, str] = Field(default_factory=dict)
#     price: Price
#     inventory: Inventory


# class ProductSpecification(BaseModel):
#     group: str
#     key: str
#     value: str


# class ProductDetailResponse(BaseModel):
#     id: str
#     slug: str
#     title: str
#     brand: str | None = None
#     description: str = ""
#     price: Price | None = None
#     images: list[ProductImage] = Field(default_factory=list)
#     categoryPaths: list[list[CategoryNode]] = Field(default_factory=list)
#     variants: list[ProductVariant] = Field(default_factory=list)
#     specifications: list[ProductSpecification] = Field(default_factory=list)
