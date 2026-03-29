export function createGetCatalogItems({ itemRepository }) {
  return async function getCatalogItems() {
    return itemRepository.getHomeLayout()
  }
}
