import { mapOrderDraftToDto, mapOrderResponse } from '../api/mappers/orderMapper'
import {httpClient} from '../api/httpClient'

export async function createOrders(orderDraft) {
  const response = await httpClient('/orders/create_order', {
    method: 'POST',
    body: mapOrderDraftToDto(orderDraft),
  })

  return mapOrderResponse(response)
}

export async function getUserOrders(userId) {
  const response = await httpClient(`/users/${userId}`, {
    method: 'GET'
  })

  return mapOrderResponse(response)
}
