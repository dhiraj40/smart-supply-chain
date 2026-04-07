function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function createSimulatedPaymentRepository({
  idGenerator,
  startDelayMs = 20,
  statusDelayMs = 20,
  successAfterChecks = 2,
}) {
  const payments = new Map()

  return {
    async start(orderDraft) {
      await sleep(startDelayMs)

      const paymentId = idGenerator.generatePaymentId()
      payments.set(paymentId, {
        remainingChecks: successAfterChecks,
        status: 'pending',
        amount: Number(orderDraft.totalAmount) || 0,
      })

      return {
        paymentId,
        status: 'pending',
        message: 'Waiting for payment confirmation.',
      }
    },

    async getStatus(paymentId) {
      const payment = payments.get(paymentId)

      if (!payment) {
        throw new Error(`Payment ${paymentId} was not found.`)
      }

      await sleep(statusDelayMs)

      if (payment.status === 'pending' && payment.remainingChecks > 0) {
        payment.remainingChecks -= 1

        if (payment.remainingChecks === 0) {
          payment.status = 'successful'
        }
      }

      return {
        paymentId,
        status: payment.status,
        message:
          payment.status === 'successful'
            ? 'Payment confirmed.'
            : 'Checking payment status...',
      }
    },
  }
}
