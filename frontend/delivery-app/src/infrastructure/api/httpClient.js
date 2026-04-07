import { UnauthorizedError } from './errorMapper'

export function createHttpClient({ baseUrl }) {
  return async function httpClient(
    endpoint,
    { method = 'GET', body, headers = {}, retry = true } = {}
  ) {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method,
      credentials: 'include', // include cookies for auth
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    // 🔄 Try refresh once if unauthorized
    if (response.status === 401 && retry) {
      const refreshRes = await fetch(`${baseUrl}/refresh`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!refreshRes.ok) {
        throw new UnauthorizedError()
      }

      // 🔁 retry original request once
      return httpClient(endpoint, {
        method,
        body,
        headers,
        retry: false,
      })
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