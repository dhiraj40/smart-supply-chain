export function createAuthClient({ httpClient }) {
  return {
    login(credentials) {
      return httpClient('/login', {
        method: 'POST',
        body: credentials,
      })
    },
  }
}
