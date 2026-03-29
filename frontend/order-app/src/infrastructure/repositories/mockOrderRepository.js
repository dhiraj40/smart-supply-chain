import { mapOrderResponse } from '../api/mappers/orderMapper'

export function createMockOrderRepository({ idGenerator }) {
  return {
    async submit(orderDraft) {
      await new Promise((resolve) => setTimeout(resolve, 100))

      return mapOrderResponse({
        order_id: idGenerator.generateOrderId(),
        status: 'created',
        ...orderDraft,
      })
    },
  }
}
