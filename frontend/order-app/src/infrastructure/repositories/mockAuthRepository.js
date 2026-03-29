export function createMockAuthRepository() {
  return {
    async login({ username, password }) {
      if (!username || !password) {
        throw new Error('Username and password are required.')
      }

      return {
        accessToken: 'dev-mock-token',
      }
    },
    async logout() {
      return null
    },
  }
}
