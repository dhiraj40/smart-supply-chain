from fastapi import APIRouter, Depends, HTTPException, Query

from app.auth.dept import get_current_user
from app.schemas.request.catalog import ProductListQuery
from app.schemas.response.catalog import (
    HomeLayoutResponse,
    ProductDetailResponse,
    ProductsResponse,
)
from app.shared.catalog_data import (
    get_home_layout,
    get_product_by_slug,
    get_products,
)

router = APIRouter(
    prefix="/api/v1",
    tags=["Catalog"],
    dependencies=[Depends(get_current_user)],
)


@router.get("/home", response_model=HomeLayoutResponse)
def get_home():
    return get_home_layout()


@router.get("/products", response_model=ProductsResponse)
def list_products(
    category: str = Query(default="warehouse-equipment"),
    page: int = Query(default=1, ge=1),
):
    query = ProductListQuery(category=category, page=page)
    return get_products(category=query.category, page=query.page)


@router.get("/products/{slug}", response_model=ProductDetailResponse)
def get_product(slug: str):
    try:
        return get_product_by_slug(slug)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Product not found") from exc
