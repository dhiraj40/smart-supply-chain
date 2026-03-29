import { createSession } from '../../contracts/sessionModel'

export function createLoginUser({ authRepository, sessionStorage }) {
  return async function loginUser(credentials) {
    const authResult = await authRepository.login(credentials)
    sessionStorage.setToken(authResult.accessToken)
    return createSession(authResult.accessToken)
  }
}
