export function createGetProductBySlug({ itemRepository }) {
  return async function getProductBySlug(slug) {
    return itemRepository.getProductBySlug(slug)
  }
}
