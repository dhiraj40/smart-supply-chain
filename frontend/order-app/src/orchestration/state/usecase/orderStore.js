import { useSyncExternalStore } from 'react'
import {
  addItemToCart,
  clearCart,
  decreaseCartItem,
  getCartSummary,
  removeCartItem,
} from '../../logic/cart/cartService'

function createPaymentState(overrides = {}) {
  return {
    paymentId: null,
    status: 'idle',
    message: null,
    ...overrides,
  }
}

function createCheckoutState(overrides = {}) {
  return {
    isSubmitting: false,
    error: null,
    success: null,
    payment: createPaymentState(),
    ...overrides,
  }
}

function normalizePaymentStatus(status, fallback = 'idle') {
  return String(status || fallback).toLowerCase()
}

function createInitialState() {
  return {
    items: [],
    checkout: createCheckoutState(),
  }
}

function getErrorMessage(error) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  if (typeof error === 'string' && error) {
    return error
  }

  return 'Checkout failed. Please try again.'
}

function clearCheckoutFeedback(checkout) {
  if (checkout.isSubmitting) {
    return checkout
  }

  return {
    ...checkout,
    error: null,
    success: null,
    payment: createPaymentState(),
  }
}

export function createOrderStore() {
  let state = createInitialState()
  const listeners = new Set()

  function notify() {
    listeners.forEach((listener) => listener())
  }

  function updateState(updater) {
    state = updater(state)
    notify()
  }

  return {
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },

    getState() {
      return state
    },

    getItems() {
      return state.items
    },

    getSummary() {
      return getCartSummary(state.items)
    },

    addItem(item) {
      updateState((currentState) => ({
        ...currentState,
        items: addItemToCart(currentState.items, item),
        checkout: clearCheckoutFeedback(currentState.checkout),
      }))
    },

    decreaseItem(itemId) {
      updateState((currentState) => ({
        ...currentState,
        items: decreaseCartItem(currentState.items, itemId),
        checkout: clearCheckoutFeedback(currentState.checkout),
      }))
    },

    removeItem(itemId) {
      updateState((currentState) => ({
        ...currentState,
        items: removeCartItem(currentState.items, itemId),
        checkout: clearCheckoutFeedback(currentState.checkout),
      }))
    },

    clearItems() {
      updateState((currentState) => ({
        ...currentState,
        items: clearCart(),
        checkout: clearCheckoutFeedback(currentState.checkout),
      }))
    },

    beginCheckout() {
      updateState((currentState) => ({
        ...currentState,
        checkout: createCheckoutState({
          isSubmitting: true,
          payment: createPaymentState({
            status: 'starting',
            message: 'Starting payment...',
          }),
        }),
      }))
    },

    setPaymentStatus(payment) {
      updateState((currentState) => ({
        ...currentState,
        checkout: {
          ...currentState.checkout,
          payment: createPaymentState({
            paymentId: payment?.paymentId || currentState.checkout.payment.paymentId,
            status: normalizePaymentStatus(
              payment?.status,
              currentState.checkout.payment.status
            ),
            message: payment?.message || currentState.checkout.payment.message,
          }),
        },
      }))
    },

    completeCheckout({ order, payment }) {
      updateState(() => ({
        items: clearCart(),
        checkout: createCheckoutState({
          success: `Order ${order.orderId} created successfully.`,
          payment: createPaymentState({
            paymentId: payment?.paymentId || null,
            status: normalizePaymentStatus(payment?.status, 'successful'),
            message: payment?.message || 'Payment successful.',
          }),
        }),
      }))
    },

    failCheckout(error) {
      updateState((currentState) => ({
        ...currentState,
        checkout: {
          ...currentState.checkout,
          isSubmitting: false,
          error: getErrorMessage(error),
          success: null,
        },
      }))
    },

    resetCheckoutStatus() {
      updateState((currentState) => ({
        ...currentState,
        checkout: clearCheckoutFeedback(currentState.checkout),
      }))
    },
  }
}

export function useOrderStore(orderStore) {
  return useSyncExternalStore(
    orderStore.subscribe,
    orderStore.getState,
    orderStore.getState
  )
}
