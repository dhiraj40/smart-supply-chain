import mockProducts from '../mocks/products.json'
import mockHomeLayout from '../mocks/home.json'
import defaultProductDetail from '../mocks/productDetail.json'
import {
  mapHomeLayoutResponse,
  mapProductDetailResponse,
  mapProductsResponse,
} from '../api/mappers/itemMapper'

const PAGE_SIZE = 10

const baseProducts = mockProducts.map((product) => ({
  ...product,
  badges: product.badges || [],
}))

const homeResponse = {
  ...mockHomeLayout,
  layout: [
    ...(mockHomeLayout.layout || []),
    {
      widgetId: 'trending_section_1',
      type: 'ProductScroller',
      title: 'Trending Warehouse Equipment',
      data: {
        items: baseProducts.slice(0, 10),
      },
    },
  ],
}

function toProductDetail(product) {
  return {
    ...defaultProductDetail,
    id: product.id || defaultProductDetail.id,
    slug: product.slug || defaultProductDetail.slug,
    title: `${product.brand} ${product.title}`,
    brand: product.brand || defaultProductDetail.brand,
    description:
      product.description ||
      defaultProductDetail.description ||
      `${product.title} designed for daily warehouse operations and high throughput scanning.`,
    images: [
      { url: product.thumbnail, alt: `${product.title} front view` },
      { url: product.thumbnail, alt: `${product.title} side view` },
    ],
    variants: [
      {
        sku: `${product.id}-STD`,
        attributes: { Model: 'Standard' },
        price: product.price,
        inventory: { inStock: true, quantity: 45 },
      },
    ],
  }
}

function getMockFacets() {
  return [
    {
      key: 'connectivity',
      label: 'Connectivity',
      type: 'checkbox',
      options: [
        { value: 'Wireless', count: 120 },
        { value: 'Bluetooth', count: 85 },
        { value: 'USB', count: 245 },
      ],
    },
    {
      key: 'brand',
      label: 'Brand',
      type: 'checkbox',
      options: [
        { value: 'ProGrip', count: 45 },
        { value: 'Zebra', count: 55 },
      ],
    },
  ]
}

export function createMockItemRepository() {
  async function getProducts({ category = 'warehouse-equipment', page = 1 } = {}) {
    const currentPage = Math.max(1, Number(page) || 1)
    const totalItems = baseProducts.length
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
    const startIndex = (currentPage - 1) * PAGE_SIZE
    const pageItems = baseProducts.slice(startIndex, startIndex + PAGE_SIZE)

    return mapProductsResponse({
      meta: {
        totalItems,
        currentPage,
        totalPages,
      },
      results: pageItems,
      facets: getMockFacets(),
      category,
    })
  }

  return {
    async getHomeLayout() {
      return mapHomeLayoutResponse(homeResponse)
    },

    getProducts,

    async getProductBySlug(slug) {
      const match = baseProducts.find((product) => product.slug === slug)

      if (!match) {
        throw new Error(`Product not found for slug: ${slug}`)
      }

      return mapProductDetailResponse(toProductDetail(match))
    },

    async getAll() {
      const response = await getProducts({
        category: 'warehouse-equipment',
        page: 1,
      })

      return response.results
    },
  }
}
