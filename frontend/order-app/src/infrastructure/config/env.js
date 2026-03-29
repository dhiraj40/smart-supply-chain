export function isProductionEnvironment() {
  return process.env.NODE_ENV === 'production'
}

export function shouldUseMockRepositories() {
  return !isProductionEnvironment()
}
