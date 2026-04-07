export function createAuthClient(httpClient) {
  return {
    login: async (username, password) => {
      const response = await httpClient('/login', {
        method: 'POST',
        body: { username, password },
      })
      return response.data
    },
    logout: async () => {
      await httpClient('/logout', {
        method: 'POST',
      })
    }
  }
}
