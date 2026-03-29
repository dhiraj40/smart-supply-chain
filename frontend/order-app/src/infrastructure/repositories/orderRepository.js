import { mapOrderDraftToDto, mapOrderResponse } from '../api/mappers/orderMapper'

export function createApiOrderRepository({ httpClient }) {
  return {
    async submit(orderDraft) {
      const response = await httpClient('/orders', {
        method: 'POST',
        body: mapOrderDraftToDto(orderDraft),
      })

      return mapOrderResponse(response)
    },
  }
}
