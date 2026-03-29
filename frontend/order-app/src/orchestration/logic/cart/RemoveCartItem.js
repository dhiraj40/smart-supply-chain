import { removeCartItem } from './cartService'

export function createRemoveCartItem() {
  return function execute(cartItems, itemId) {
    return removeCartItem(cartItems, itemId)
  }
}
