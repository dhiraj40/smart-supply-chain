export function createCartFacade({ cartService }) {
  return {
    addItem(cartItems, item) {
      return cartService.addItemToCart(cartItems, item)
    },
    decreaseItem(cartItems, itemId) {
      return cartService.decreaseCartItem(cartItems, itemId)
    },
    removeItem(cartItems, itemId) {
      return cartService.removeCartItem(cartItems, itemId)
    },
    clear() {
      return cartService.clearCart()
    },
    getSummary(cartItems) {
      return cartService.getCartSummary(cartItems)
    },
  }
}
