import { AUTH_TOKEN_KEY } from '../../shared/constants/storage'

export function createBrowserSessionStorage(storage = window.localStorage) {
  return {
    getToken() {
      return storage.getItem(AUTH_TOKEN_KEY)
    },
    setToken(token) {
      storage.setItem(AUTH_TOKEN_KEY, token)
    },
    clearToken() {
      storage.removeItem(AUTH_TOKEN_KEY)
    },
  }
}
