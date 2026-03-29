import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { AUTH_TOKEN_KEY } from './shared/constants/storage'

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  test('allows a user to log in, add an item, and checkout', async () => {
    render(<App />)

    await userEvent.type(screen.getByLabelText(/username/i), 'demo-user')
    await userEvent.type(screen.getByLabelText(/password/i), 'demo-pass')
    await userEvent.click(screen.getByRole('button', { name: /^login$/i }))

    expect(await screen.findByText('ProGrip Wireless 2D Scanner')).toBeInTheDocument()

    await userEvent.click(screen.getAllByRole('button', { name: /\+ add to order/i })[0])
    await userEvent.click(screen.getByRole('button', { name: /cart/i }))
    await userEvent.click(screen.getByRole('button', { name: /checkout/i }))

    expect(await screen.findByText(/created successfully/i)).toBeInTheDocument()
  })

  test('restores an authenticated session from storage', async () => {
    window.localStorage.setItem(AUTH_TOKEN_KEY, 'persisted-token')

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('ProGrip Wireless 2D Scanner')).toBeInTheDocument()
    })
  })
})
