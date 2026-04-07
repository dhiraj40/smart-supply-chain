import { createApiAuthRepository } from '../auth/authRepository'
import { createApiItemRepository } from './productRepository'
import orderRepository from './orderRepository'
import { createSimulatedPaymentRepository } from './paymentRepository'
import { createMockAuthRepository } from './mockAuthRepository'
import { createMockItemRepository } from './mockProductRepository'
import { createMockOrderRepository } from './mockOrderRepository'

export function createRepositories({ httpClient, idGenerator, useMocks }) {
  const paymentRepository = createSimulatedPaymentRepository({ idGenerator })

  if (useMocks) {
    return {
      authRepository: createMockAuthRepository(),
      itemRepository: createMockItemRepository(),
      orderRepository: createMockOrderRepository({ idGenerator }),
      paymentRepository,
    }
  }

  return {
    authRepository: createApiAuthRepository({ httpClient }),
    itemRepository: createApiItemRepository({ httpClient }),
    orderRepository: orderRepository,
    paymentRepository,
  }
}
