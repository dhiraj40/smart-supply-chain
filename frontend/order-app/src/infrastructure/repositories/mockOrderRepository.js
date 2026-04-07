import { mapOrderResponse } from '../api/mappers/orderMapper'

export function createMockOrderRepository({ idGenerator }) {
  async function create(orderDraft) {
    await new Promise((resolve) => setTimeout(resolve, 100))

    return mapOrderResponse({
      order_id: idGenerator.generateOrderId(),
      status: 'created',
      ...orderDraft,
    })
  }

  return {
    create,
    submit: create,
  }
}
