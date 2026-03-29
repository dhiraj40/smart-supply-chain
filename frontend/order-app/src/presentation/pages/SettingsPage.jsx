import { Button, Card } from 'react-bootstrap'
import { useAuthController } from '../usecases/useAuthController'

export default function SettingsPage() {
  const { logout } = useAuthController()

  return (
    <Card style={{ maxWidth: 480 }}>
      <Card.Body>
        <Card.Title>Settings</Card.Title>
        <Card.Text>Manage your session here.</Card.Text>
        <Button variant="outline-danger" onClick={logout}>
          Logout
        </Button>
      </Card.Body>
    </Card>
  )
}
