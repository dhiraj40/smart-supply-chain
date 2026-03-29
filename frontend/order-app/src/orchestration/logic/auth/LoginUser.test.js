import { createLoginUser } from './LoginUser'
import { createRestoreSession } from './RestoreSession'

describe('auth use cases', () => {
  test('login persists the access token', async () => {
    const storage = {
      token: null,
      getToken() {
        return this.token
      },
      setToken(token) {
        this.token = token
      },
      clearToken() {
        this.token = null
      },
    }

    const loginUser = createLoginUser({
      authRepository: {
        async login() {
          return { accessToken: 'abc123' }
        },
      },
      sessionStorage: storage,
    })

    const session = await loginUser({
      username: 'demo',
      password: 'pass',
    })

    expect(storage.getToken()).toBe('abc123')
    expect(session.isAuthenticated).toBe(true)
  })

  test('restore session uses persisted storage state', () => {
    const restoreSession = createRestoreSession({
      sessionStorage: {
        getToken() {
          return 'persisted-token'
        },
      },
    })

    expect(restoreSession()).toEqual({
      accessToken: 'persisted-token',
      isAuthenticated: true,
    })
  })
})
