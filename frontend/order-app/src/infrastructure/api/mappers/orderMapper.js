
export function mapOrderDraftToDto(orderDraft) {
  return {
    user_id: orderDraft.userId,
    order_amount: orderDraft.totalAmount,
    currency: orderDraft.currency,
    delivery_address: orderDraft.deliveryAddress,
    order_date: orderDraft.createdAt,
    items: orderDraft.items.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unitPrice,
    })),
  }
}

export function mapOrderResponse(response) {
  return {
    orderId: response.order_id || response.id || 'submitted',
    status: response.status || 'created',
  }
}
