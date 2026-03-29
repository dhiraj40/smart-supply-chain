import { mapLoginResponse } from '../api/mappers/authMapper'

export function createApiAuthRepository({ httpClient }) {
  return {
    async login({ username, password }) {
      const response = await httpClient('/login', {
        method: 'POST',
        body: { username, password },
      })

      return mapLoginResponse(response)
    },
    async logout() {
      return null
    },
  }
}
