export function createTimestampIdGenerator() {
  return {
    generateOrderId() {
      return `DEV-${Date.now()}`
    },
  }
}
