import { createItem } from '../../../orchestration/contracts/itemModel'

function normalizePrice(price = {}) {
  const sellingPrice = Number(price.sellingPrice ?? 0)
  const mrp = price.mrp == null ? null : Number(price.mrp)

  return {
    sellingPrice: Number.isFinite(sellingPrice) ? sellingPrice : 0,
    mrp: Number.isFinite(mrp) ? mrp : null,
    currency: price.currency || 'USD',
  }
}

export function mapLegacyItemDtoToEntity(itemDto) {
  return createItem({
    id: itemDto.item_id,
    name: itemDto.name,
    description: itemDto.description,
    unitPrice: itemDto.unit_price,
    imageUrl: itemDto.pic_url,
  })
}

export function mapHomeProductDtoToEntity(productDto) {
  const price = normalizePrice(productDto.price)

  return createItem({
    id: productDto.id,
    slug: productDto.slug,
    name: productDto.title,
    unitPrice: price.sellingPrice,
    imageUrl: productDto.thumbnail,
    badges: productDto.badges || [],
    brand: productDto.brand || '',
    currency: price.currency,
    mrp: price.mrp,
  })
}

export function mapProductResultDtoToEntity(productDto) {
  const price = normalizePrice(productDto.price)

  return createItem({
    id: productDto.id,
    slug: productDto.slug,
    name: productDto.title,
    unitPrice: price.sellingPrice,
    imageUrl: productDto.thumbnail,
    description: productDto.brand ? `Brand: ${productDto.brand}` : '',
    brand: productDto.brand || '',
    currency: price.currency,
    mrp: price.mrp,
    ratingAverage: productDto.rating?.average ?? null,
    ratingCount: productDto.rating?.count ?? 0,
  })
}

function mapHomeWidget(widgetDto) {
  if (widgetDto.type === 'HeroCarousel') {
    return {
      widgetId: widgetDto.widgetId,
      type: widgetDto.type,
      title: widgetDto.title || '',
      data: {
        images: (widgetDto.data?.images || []).map((image) => ({
          desktopUrl: image.desktopUrl,
          mobileUrl: image.mobileUrl || image.desktopUrl,
          link: image.link || '',
        })),
      },
    }
  }

  if (widgetDto.type === 'ProductScroller') {
    return {
      widgetId: widgetDto.widgetId,
      type: widgetDto.type,
      title: widgetDto.title || 'Featured Products',
      data: {
        items: (widgetDto.data?.items || []).map(mapHomeProductDtoToEntity),
      },
    }
  }

  return {
    widgetId: widgetDto.widgetId,
    type: widgetDto.type,
    title: widgetDto.title || '',
    data: widgetDto.data || {},
  }
}

export function mapHomeLayoutResponse(response) {
  return {
    layout: (response.layout || []).map(mapHomeWidget),
  }
}

export function mapProductsResponse(response) {
  return {
    meta: {
      totalItems: response.meta?.totalItems || 0,
      currentPage: response.meta?.currentPage || 1,
      totalPages: response.meta?.totalPages || 1,
    },
    results: (response.results || []).map(mapProductResultDtoToEntity),
    facets: response.facets || [],
  }
}

export function mapProductDetailResponse(response) {
  const defaultVariant = response.variants?.[0]
  const price = normalizePrice(defaultVariant?.price || response.price || {})

  return {
    ...createItem({
      id: response.id,
      slug: response.slug,
      name: response.title,
      description: response.description || '',
      unitPrice: price.sellingPrice,
      imageUrl: response.images?.[0]?.url || '',
      brand: response.brand || '',
      currency: price.currency,
      mrp: price.mrp,
    }),
    images: response.images || [],
    categoryPaths: response.categoryPaths || [],
    variants: response.variants || [],
    specifications: response.specifications || [],
  }
}
