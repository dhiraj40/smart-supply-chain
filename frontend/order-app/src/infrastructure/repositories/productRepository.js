import {
  mapHomeLayoutResponse,
  mapProductDetailResponse,
  mapProductsResponse,
} from '../api/mappers/itemMapper'

export function createApiItemRepository({ httpClient }) {
  async function getProducts({ category = 'warehouse-equipment', page = 1 } = {}) {
    const query = `category=${encodeURIComponent(category)}&page=${encodeURIComponent(page)}`
    const response = await httpClient(`/api/v1/products?${query}`)
    return mapProductsResponse(response)
  }

  return {
    async getHomeLayout() {
      const response = await httpClient('/api/v1/home')
      return mapHomeLayoutResponse(response)
    },

    getProducts,

    async getProductBySlug(slug) {
      const response = await httpClient(`/api/v1/products/${encodeURIComponent(slug)}`)
      return mapProductDetailResponse(response)
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
