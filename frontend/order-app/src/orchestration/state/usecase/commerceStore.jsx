import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { useServiceContainer } from '../global/appProvider'
import { createCatalogFacade } from '../../facades/catalogFacade'
import { createCartFacade } from '../../facades/cartFacade'
import { createCheckoutFacade } from '../../facades/checkoutFacade'

const CommerceContext = createContext(null)

export function CommerceProvider({ children }) {
  const container = useServiceContainer()
  const catalogFacade = useMemo(
    () =>
      createCatalogFacade({
        catalogRepository: container.catalog,
      }),
    [container.catalog]
  )

  const cartFacade = useMemo(
    () =>
      createCartFacade({
        cartService: container.cart,
      }),
    [container.cart]
  )

  const checkoutFacade = useMemo(
    () =>
      createCheckoutFacade({
        checkoutService: container.checkout,
      }),
    [container.checkout]
  )

  const [dashboardState, setDashboardState] = useState({
    layout: [],
    isLoading: false,
    error: null,
    hasLoaded: false,
  })
  const [productDetailState, setProductDetailState] = useState({
    isOpen: false,
    isLoading: false,
    error: null,
    item: null,
    detail: null,
  })

  const [cartItems, setCartItems] = useState([])
  const [checkoutState, setCheckoutState] = useState({
    isSubmitting: false,
    error: null,
    success: null,
  })

  const resetCheckoutStatus = useCallback(() => {
    setCheckoutState((currentState) => ({
      ...currentState,
      error: null,
      success: null,
    }))
  }, [])

  const loadDashboard = useCallback(
    async ({ force = false } = {}) => {
      if (!force && (dashboardState.isLoading || dashboardState.hasLoaded)) {
        return
      }

      setDashboardState((currentState) => ({
        ...currentState,
        isLoading: true,
        error: null,
      }))

      try {
        const response = await catalogFacade.loadDashboard()
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
    },
    [catalogFacade, dashboardState.hasLoaded, dashboardState.isLoading]
  )

  const closeProductDetail = useCallback(() => {
    setProductDetailState({
      isOpen: false,
      isLoading: false,
      error: null,
      item: null,
      detail: null,
    })
  }, [])

  const openProductDetail = useCallback(
    async (item) => {
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
        const detail = await catalogFacade.loadProductDetail(item.slug)
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
    },
    [catalogFacade]
  )

  const addItem = useCallback(
    (item) => {
      resetCheckoutStatus()
      setCartItems((currentCart) => cartFacade.addItem(currentCart, item))
    },
    [cartFacade, resetCheckoutStatus]
  )

  const decreaseItem = useCallback(
    (itemId) => {
      resetCheckoutStatus()
      setCartItems((currentCart) => cartFacade.decreaseItem(currentCart, itemId))
    },
    [cartFacade, resetCheckoutStatus]
  )

  const removeItem = useCallback(
    (itemId) => {
      resetCheckoutStatus()
      setCartItems((currentCart) => cartFacade.removeItem(currentCart, itemId))
    },
    [cartFacade, resetCheckoutStatus]
  )

  const clearCart = useCallback(() => {
    resetCheckoutStatus()
    setCartItems(cartFacade.clear())
  }, [cartFacade, resetCheckoutStatus])

  const cartSummary = useMemo(() => cartFacade.getSummary(cartItems), [cartFacade, cartItems])

  const submitCheckout = useCallback(async () => {
    if (cartItems.length === 0 || checkoutState.isSubmitting) {
      return
    }

    setCheckoutState({
      isSubmitting: true,
      error: null,
      success: null,
    })

    try {
      const order = await checkoutFacade.submitOrder(cartItems)
      setCheckoutState({
        isSubmitting: false,
        error: null,
        success: `Order ${order.orderId} created successfully.`,
      })
      setCartItems(cartFacade.clear())
    } catch (error) {
      setCheckoutState({
        isSubmitting: false,
        error: error.message || 'Checkout failed. Please try again.',
        success: null,
      })
    }
  }, [cartFacade, cartItems, checkoutFacade, checkoutState.isSubmitting])

  const value = useMemo(
    () => ({
      dashboard: {
        ...dashboardState,
        loadDashboard,
        productDetail: productDetailState,
        openProductDetail,
        closeProductDetail,
      },
      cart: {
        items: cartItems,
        summary: cartSummary,
        addItem,
        decreaseItem,
        removeItem,
        clearCart,
      },
      checkout: {
        ...checkoutState,
        submitCheckout,
        resetCheckoutStatus,
      },
    }),
    [
      addItem,
      cartItems,
      cartSummary,
      checkoutState,
      clearCart,
      dashboardState,
      decreaseItem,
      loadDashboard,
      productDetailState,
      openProductDetail,
      closeProductDetail,
      removeItem,
      resetCheckoutStatus,
      submitCheckout,
    ]
  )

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
