import { createRestoreSession } from '../../orchestration/logic/auth/RestoreSession'
import { createLoginUser } from '../../orchestration/logic/auth/LoginUser'
import { createLogoutUser } from '../../orchestration/logic/auth/LogoutUser'
import { createCreateOrderDraft } from '../../orchestration/logic/checkout/CreateOrderDraft'
import { createProcessCheckout } from '../../orchestration/logic/checkout/ProcessCheckout'
import { createOrderStore } from '../../orchestration/state/usecase/orderStore'
import { API_BASE_URL } from '../../infrastructure/config/apiConfig'
import { shouldUseMockRepositories } from '../../infrastructure/config/env'
import { createHttpClient } from '../../infrastructure/api/httpClient'
import { createRepositories } from '../../infrastructure/repositories'
import { createBrowserSessionStorage } from '../../infrastructure/storage/BrowserSessionStorage'
import { createBrowserClock } from '../../infrastructure/system/BrowserClock'
import { createTimestampIdGenerator } from '../../infrastructure/system/TimestampIdGenerator'

export function createAppContainer() {
  const sessionStorage = createBrowserSessionStorage()
  const clock = createBrowserClock()
  const idGenerator = createTimestampIdGenerator()
  const shouldUseMocks = shouldUseMockRepositories()

  const httpClient = createHttpClient({
    baseUrl: API_BASE_URL,
    getToken: () => sessionStorage.getToken(),
  })

  const { authRepository, itemRepository, orderRepository, paymentRepository } =
    createRepositories({
      httpClient,
      idGenerator,
      useMocks: shouldUseMocks,
    })

  const auth = {
    restoreSession: createRestoreSession({ sessionStorage }),
    loginUser: createLoginUser({ authRepository, sessionStorage }),
    logoutUser: createLogoutUser({ authRepository, sessionStorage }),
  }

  const catalog = {
    getHomeLayout() {
      return itemRepository.getHomeLayout()
    },
    getProducts(params) {
      return itemRepository.getProducts(params)
    },
    getProductBySlug(slug) {
      return itemRepository.getProductBySlug(slug)
    },
  }

  const createOrderDraft = createCreateOrderDraft({ clock })
  const orderStore = createOrderStore()
  const checkout = {
    placeOrder: createProcessCheckout({
      createOrderDraft,
      paymentRepository,
      orderRepository,
    }),
  }

  return {
    auth,
    catalog,
    orderStore,
    checkout,
  }
}
