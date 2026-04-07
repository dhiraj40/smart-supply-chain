export function createTimestampIdGenerator() {
  function createId(prefix) {
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).slice(2, 8).toUpperCase()

    return `${prefix}-${timestamp}-${randomSuffix}`
  }

  return {
    generateOrderId() {
      return createId('ORD')
    },
    generatePaymentId() {
      return createId('PAY')
    },
  }
}
