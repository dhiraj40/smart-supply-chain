import { createRestoreSession } from '../../orchestration/logic/auth/RestoreSession'
import { createLoginUser } from '../../orchestration/logic/auth/LoginUser'
import { createLogoutUser } from '../../orchestration/logic/auth/LogoutUser'
import { createGetCatalogItems } from '../../orchestration/logic/catalog/GetCatalogItems'
import { createGetProducts } from '../../orchestration/logic/catalog/GetProducts'
import { createGetProductBySlug } from '../../orchestration/logic/catalog/GetProductBySlug'
import { createAddItemToCart } from '../../orchestration/logic/cart/AddItemToCart'
import { createDecreaseCartItem } from '../../orchestration/logic/cart/DecreaseCartItem'
import { createRemoveCartItem } from '../../orchestration/logic/cart/RemoveCartItem'
import { createClearCart } from '../../orchestration/logic/cart/ClearCart'
import { createGetCartSummary } from '../../orchestration/logic/cart/GetCartSummary'
import { createCreateOrderDraft } from '../../orchestration/logic/checkout/CreateOrderDraft'
import { createSubmitOrder } from '../../orchestration/logic/checkout/SubmitOrder'
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

  const { authRepository, itemRepository, orderRepository } = createRepositories({
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
    getCatalogItems: createGetCatalogItems({ itemRepository }),
    getProducts: createGetProducts({ itemRepository }),
    getProductBySlug: createGetProductBySlug({ itemRepository }),
  }

  const cart = {
    addItemToCart: createAddItemToCart(),
    decreaseCartItem: createDecreaseCartItem(),
    removeCartItem: createRemoveCartItem(),
    clearCart: createClearCart(),
    getCartSummary: createGetCartSummary(),
  }

  const checkout = {
    createOrderDraft: createCreateOrderDraft({ clock }),
  }

  checkout.submitOrder = createSubmitOrder({
    createOrderDraft: checkout.createOrderDraft,
    orderRepository,
  })

  return {
    auth,
    catalog,
    cart,
    checkout,
  }
}
