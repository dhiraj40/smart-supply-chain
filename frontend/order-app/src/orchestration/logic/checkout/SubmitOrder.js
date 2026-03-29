export function createSubmitOrder({ createOrderDraft, orderRepository }) {
  return async function submitOrder(cartItems) {
    const orderDraft = createOrderDraft(cartItems)
    return orderRepository.submit(orderDraft)
  }
}
