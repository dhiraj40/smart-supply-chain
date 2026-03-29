export function createGetProducts({ itemRepository }) {
  return async function getProducts(params) {
    return itemRepository.getProducts(params)
  }
}
