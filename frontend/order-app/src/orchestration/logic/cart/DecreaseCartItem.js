import { decreaseCartItem } from './cartService'

export function createDecreaseCartItem() {
  return function execute(cartItems, itemId) {
    return decreaseCartItem(cartItems, itemId)
  }
}
