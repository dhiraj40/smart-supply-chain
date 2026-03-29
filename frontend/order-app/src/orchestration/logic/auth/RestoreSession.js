import { createSession } from '../../contracts/sessionModel'

export function createRestoreSession({ sessionStorage }) {
  return function restoreSession() {
    return createSession(sessionStorage.getToken())
  }
}
