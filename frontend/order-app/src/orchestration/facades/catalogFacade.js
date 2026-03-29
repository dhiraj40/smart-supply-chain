export function createCatalogFacade({ catalogRepository }) {
  return {
    loadDashboard() {
      return catalogRepository.getCatalogItems()
    },
    loadProducts(params) {
      return catalogRepository.getProducts(params)
    },
    loadProductDetail(slug) {
      return catalogRepository.getProductBySlug(slug)
    },
  }
}
