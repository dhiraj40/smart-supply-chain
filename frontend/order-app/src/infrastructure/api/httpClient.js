import { UnauthorizedError } from './errorMapper'

export function createHttpClient({ baseUrl, getToken }) {
  return async function httpClient(
    endpoint,
    { method = 'GET', body, headers = {} } = {}
  ) {
    const token = getToken?.()

    const response = await fetch(`${baseUrl}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (response.status === 401) {
      throw new UnauthorizedError()
    }

    if (!response.ok) {
      const message = await response.text()
      throw new Error(message || 'API request failed.')
    }

    if (response.status === 204) {
      return null
    }

    return response.json()
  }
}
