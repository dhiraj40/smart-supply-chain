import { Badge, Button, ListGroup, Spinner } from 'react-bootstrap'
import { useState } from 'react'
import AppProviders from './providers/AppProviders'
import { PAGES } from '../shared/constants/navigation'
import { useAuthController } from '../presentation/usecases/useAuthController'
import { useCartController } from '../presentation/usecases/useCartController'
import AppLayout from '../presentation/components/layout/AppLayout'
import LoginPage from '../presentation/pages/LoginPage'
import DashboardPage from '../presentation/pages/DashboardPage'
import CartPage from '../presentation/pages/CartPage'
import SettingsPage from '../presentation/pages/SettingsPage'

function AppContent() {
  const { isAuthenticated, isLoading } = useAuthController()
  const { cart } = useCartController()
  const [activePage, setActivePage] = useState(PAGES.DASHBOARD)

  if (isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 gap-2">
        <Spinner animation="border" size="sm" />
        <span>Loading...</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  const sidebar = (
    <ListGroup variant="flush">
      <ListGroup.Item
        action
        href="#dashboard"
        onClick={() => setActivePage(PAGES.DASHBOARD)}
        active={activePage === PAGES.DASHBOARD}
      >
        Dashboard
      </ListGroup.Item>
      <ListGroup.Item
        action
        href="#cart"
        onClick={() => setActivePage(PAGES.CART)}
        active={activePage === PAGES.CART}
      >
        Orders
      </ListGroup.Item>
      <ListGroup.Item
        action
        href="#settings"
        onClick={() => setActivePage(PAGES.SETTINGS)}
        active={activePage === PAGES.SETTINGS}
      >
        Settings
      </ListGroup.Item>
    </ListGroup>
  )

  const cartButton = (
    <Button variant="dark" onClick={() => setActivePage(PAGES.CART)}>
      Cart <Badge bg="danger">{cart.summary.totalQuantity}</Badge>
    </Button>
  )

  return (
    <AppLayout sidebar={sidebar} topbarRight={cartButton}>
      {activePage === PAGES.DASHBOARD && <DashboardPage />}
      {activePage === PAGES.CART && <CartPage />}
      {activePage === PAGES.SETTINGS && <SettingsPage />}
    </AppLayout>
  )
}

export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  )
}
