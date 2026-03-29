import { addItemToCart } from './cartService'

export function createAddItemToCart() {
  return function execute(cartItems, item) {
    return addItemToCart(cartItems, item)
  }
}
