import { useState } from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import { useAuthController } from '../usecases/useAuthController'
import StatusBanner from '../components/StatusBanner'

export default function LoginPage() {
  const { login } = useAuthController()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await login(username, password)
    } catch (loginError) {
      setError(loginError.message || 'Invalid username or password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 px-3"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <Card style={{ width: '100%', maxWidth: '26rem' }}>
        <Card.Body>
          <Card.Title className="mb-3">Login</Card.Title>
          <StatusBanner variant="danger">{error}</StatusBanner>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="login-username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Username"
                autoComplete="username"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="login-password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                required
              />
            </Form.Group>
            <Button type="submit" className="w-100" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}
