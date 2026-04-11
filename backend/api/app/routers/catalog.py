from math import prod
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from app.shared.utils import database as db
from app.auth.dept import get_current_user
from app.schemas.response.catalog import ProductReviewResponse, ProductSummaryResponse, ProductImageResponse


router = APIRouter(
    prefix="/api/v1/products",
    tags=["Catalog"],
    dependencies=[Depends(get_current_user)],
)


# @router.get("/home", response_model=HomeLayoutResponse)
# def get_home():
#     return get_home_layout()

@router.get("/page={page}&page_size={page_size}", response_model=List[ProductSummaryResponse])
def list_products(page: int, page_size: int):
    products = db.getProducts(
        page = page,
        page_size=page_size
    )
    product_summaries = [
        ProductSummaryResponse(
            product_id=prod["product_id"],
            slug=prod["slug"],
            brand=prod["brand"],
            product_name=prod["product_name"],
            description=prod["description"],
            thumbnail_url=prod["thumbnail_url"],
            vendor_id=prod["vendor_id"],
            mrp=prod["mrp"],
            selling_price=prod["selling_price"],
            currency=prod["currency"],
            category_slug=prod["category_slug"],
            rating_average=prod.get("rating_average", 0.0),
            rating_count=prod.get("rating_count", 0),
            is_available=prod["is_available"],
            stock=prod["stock"],
            product_details=prod['product_details']
        )
        for prod in products
    ]
    return product_summaries


@router.get("/{slug}", response_model=List[ProductSummaryResponse])
def get_product(slug: str):
    try:
        products = db.getProductBySlug(slug)
        product_summaries = [
            ProductSummaryResponse(
                product_id=prod["product_id"],
                slug=prod["slug"],
                brand=prod["brand"],
                product_name=prod["product_name"],
                description=prod["description"],
                thumbnail_url=prod["thumbnail_url"],
                vendor_id=prod["vendor_id"],
                mrp=prod["mrp"],
                selling_price=prod["selling_price"],
                currency=prod["currency"],
                category_slug=prod["category_slug"],
                rating_average=prod.get("rating_average", 0.0),
                rating_count=prod.get("rating_count", 0),
                is_available=prod["is_available"],
                stock=prod["stock"]
            )
            for prod in products
        ]
        return product_summaries
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Product not found") from exc
    
@router.get("/{product_id}/images", response_model=List[ProductImageResponse])
def get_product_images(product_id: str):
    return db.getProductImages(product_id)

@router.get("/{product_id}/reviews", response_model=List[ProductReviewResponse])
def get_product_reviews(product_id: str):
    return db.getProductReviews(product_id)
