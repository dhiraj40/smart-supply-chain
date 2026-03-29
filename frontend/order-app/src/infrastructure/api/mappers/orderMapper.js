export function mapOrderDraftToDto(orderDraft) {
  return {
    order_date: orderDraft.createdAt,
    total_amount: orderDraft.totalAmount,
    items: orderDraft.items.map((item) => ({
      item_id: item.itemId,
      name: item.name,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      line_total: item.lineTotal,
    })),
  }
}

export function mapOrderResponse(response) {
  return {
    orderId: response.order_id || response.id || 'submitted',
    status: response.status || 'created',
  }
}
