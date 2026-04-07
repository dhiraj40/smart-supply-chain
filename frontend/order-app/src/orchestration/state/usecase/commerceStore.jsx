import { createContext, useContext, useState } from 'react'
import { useServiceContainer } from '../global/appProvider'
import { useOrderStore } from './orderStore'

const CommerceContext = createContext(null)

function createClosedProductDetailState() {
  return {
    isOpen: false,
    isLoading: false,
    error: null,
    item: null,
    detail: null,
  }
}

export function CommerceProvider({ children }) {
  const { catalog, checkout, orderStore } = useServiceContainer()
  const orderState = useOrderStore(orderStore)
  const [dashboardState, setDashboardState] = useState({
    layout: [],
    isLoading: false,
    error: null,
    hasLoaded: false,
  })
  const [productDetailState, setProductDetailState] = useState(
    createClosedProductDetailState()
  )

  async function loadDashboard({ force = false } = {}) {
    if (!force && (dashboardState.isLoading || dashboardState.hasLoaded)) {
      return
    }

    setDashboardState((currentState) => ({
      ...currentState,
      isLoading: true,
      error: null,
    }))

    try {
      const response = await catalog.getHomeLayout()
      setDashboardState({
        layout: response.layout || [],
        isLoading: false,
        error: null,
        hasLoaded: true,
      })
    } catch (error) {
      setDashboardState((currentState) => ({
        ...currentState,
        isLoading: false,
        error: error.message || 'Failed to load dashboard.',
        hasLoaded: true,
      }))
    }
  }

  function closeProductDetail() {
    setProductDetailState(createClosedProductDetailState())
  }

  async function openProductDetail(item) {
    if (!item) {
      return
    }

    setProductDetailState({
      isOpen: true,
      isLoading: true,
      error: null,
      item,
      detail: null,
    })

    if (!item.slug) {
      setProductDetailState({
        isOpen: true,
        isLoading: false,
        error: 'Product details are not available for this item.',
        item,
        detail: null,
      })
      return
    }

    try {
      const detail = await catalog.getProductBySlug(item.slug)
      setProductDetailState({
        isOpen: true,
        isLoading: false,
        error: null,
        item,
        detail,
      })
    } catch (error) {
      setProductDetailState({
        isOpen: true,
        isLoading: false,
        error: error.message || 'Failed to load product details.',
        item,
        detail: null,
      })
    }
  }

  function addItem(item) {
    orderStore.addItem(item)
  }

  function decreaseItem(itemId) {
    orderStore.decreaseItem(itemId)
  }

  function removeItem(itemId) {
    orderStore.removeItem(itemId)
  }

  function clearCart() {
    orderStore.clearItems()
  }

  async function submitCheckout() {
    const cartItems = orderStore.getItems()

    if (!cartItems.length || orderState.checkout.isSubmitting) {
      return
    }

    orderStore.beginCheckout()

    try {
      const result = await checkout.placeOrder(cartItems, {
        onPaymentStatus(payment) {
          orderStore.setPaymentStatus(payment)
        },
      })

      orderStore.completeCheckout(result)
    } catch (error) {
      orderStore.failCheckout(error)
    }
  }

  const value = {
    dashboard: {
      ...dashboardState,
      loadDashboard,
      productDetail: productDetailState,
      openProductDetail,
      closeProductDetail,
    },
    cart: {
      items: orderState.items,
      summary: orderStore.getSummary(),
      addItem,
      decreaseItem,
      removeItem,
      clearCart,
    },
    checkout: {
      ...orderState.checkout,
      submitCheckout,
      resetCheckoutStatus() {
        orderStore.resetCheckoutStatus()
      },
    },
  }

  return (
    <CommerceContext.Provider value={value}>
      {children}
    </CommerceContext.Provider>
  )
}

export function useCommerce() {
  const context = useContext(CommerceContext)

  if (!context) {
    throw new Error('Commerce context is not available.')
  }

  return context
}
