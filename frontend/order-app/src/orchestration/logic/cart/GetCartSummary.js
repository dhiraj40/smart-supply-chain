import { getCartSummary } from './cartService'

export function createGetCartSummary() {
  return function execute(cartItems) {
    return getCartSummary(cartItems)
  }
}
