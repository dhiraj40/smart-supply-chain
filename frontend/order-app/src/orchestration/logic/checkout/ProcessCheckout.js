function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function normalizePaymentStatus(status) {
  return String(status || 'pending').toLowerCase()
}

function isSuccessfulPayment(status) {
  return ['successful', 'success', 'paid', 'completed'].includes(
    normalizePaymentStatus(status)
  )
}

function isFailedPayment(status) {
  return ['failed', 'failure', 'cancelled', 'expired'].includes(
    normalizePaymentStatus(status)
  )
}

export function createProcessCheckout({
  createOrderDraft,
  paymentRepository,
  orderRepository,
  pollIntervalMs = 300,
  maxPollAttempts = 8,
}) {
  async function waitForPayment(startedPayment, onPaymentStatus) {
    let currentPayment = startedPayment

    if (
      isSuccessfulPayment(currentPayment.status) ||
      isFailedPayment(currentPayment.status)
    ) {
      return currentPayment
    }

    for (let attempt = 0; attempt < maxPollAttempts; attempt += 1) {
      await sleep(pollIntervalMs)
      currentPayment = await paymentRepository.getStatus(startedPayment.paymentId)
      onPaymentStatus?.(currentPayment)

      if (
        isSuccessfulPayment(currentPayment.status) ||
        isFailedPayment(currentPayment.status)
      ) {
        return currentPayment
      }
    }

    throw new Error('Payment confirmation timed out. Please try again.')
  }

  return async function processCheckout(cartItems, { onPaymentStatus } = {}) {
    const orderDraft = createOrderDraft(cartItems)
    const startedPayment = await paymentRepository.start(orderDraft)

    if (!startedPayment?.paymentId) {
      throw new Error('Payment could not be started.')
    }

    onPaymentStatus?.(startedPayment)

    const completedPayment = await waitForPayment(startedPayment, onPaymentStatus)

    if (isFailedPayment(completedPayment.status)) {
      throw new Error(completedPayment.message || 'Payment failed. Please try again.')
    }

    const order = await orderRepository.create(orderDraft)

    return {
      order,
      payment: completedPayment,
    }
  }
}
