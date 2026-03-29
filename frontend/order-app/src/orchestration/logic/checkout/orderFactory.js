import { getCartSummary, getLineTotal } from '../cart/cartService'

export function createOrderDraft({ cartItems, createdAt }) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new Error('Cannot create an order from an empty cart.')
  }

  const summary = getCartSummary(cartItems)

  return {
    createdAt,
    totalAmount: summary.subtotal,
    items: cartItems.map((cartItem) => ({
      itemId: cartItem.item.id,
      name: cartItem.item.name,
      quantity: cartItem.quantity,
      unitPrice: cartItem.item.unitPrice,
      lineTotal: getLineTotal(cartItem),
    })),
  }
}
