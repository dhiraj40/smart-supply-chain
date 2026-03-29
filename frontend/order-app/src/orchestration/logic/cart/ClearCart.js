import { clearCart } from './cartService'

export function createClearCart() {
  return function execute() {
    return clearCart()
  }
}
