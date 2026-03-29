export function createLogoutUser({ authRepository, sessionStorage }) {
  return async function logoutUser() {
    if (authRepository?.logout) {
      await authRepository.logout()
    }

    sessionStorage.clearToken()
  }
}
