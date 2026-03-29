import { createApiAuthRepository } from '../auth/authRepository'
import { createApiItemRepository } from './productRepository'
import { createApiOrderRepository } from './orderRepository'
import { createMockAuthRepository } from './mockAuthRepository'
import { createMockItemRepository } from './mockProductRepository'
import { createMockOrderRepository } from './mockOrderRepository'

export function createRepositories({ httpClient, idGenerator, useMocks }) {
  if (useMocks) {
    return {
      authRepository: createMockAuthRepository(),
      itemRepository: createMockItemRepository(),
      orderRepository: createMockOrderRepository({ idGenerator }),
    }
  }

  return {
    authRepository: createApiAuthRepository({ httpClient }),
    itemRepository: createApiItemRepository({ httpClient }),
    orderRepository: createApiOrderRepository({ httpClient }),
  }
}
