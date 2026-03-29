export function createSession(accessToken = null) {
  return {
    accessToken,
    isAuthenticated: Boolean(accessToken),
  }
}
