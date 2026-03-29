export function createCheckoutFacade({ checkoutService }) {
  return {
    submitOrder(cartItems) {
      return checkoutService.submitOrder(cartItems)
    },
  }
}
