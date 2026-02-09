import { AuthProvider, useAuth } from './auth/AuthProvider'
import Login from './features/Login'
import Dashboard from './features/Dashboard'
import AppLayout from './components/layout/AppLayout'
import { ListGroup } from 'react-bootstrap'
import { useState } from 'react'

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth()
  const [activePage, setActivePage] = useState('dashboard')
  const [cartItems, setCartItems] = useState([])

  if (isLoading) return <h2>Loading...</h2>

  if (!isAuthenticated) return <Login />

  const sidebar = (
    <ListGroup variant="flush">
      <ListGroup.Item action href="" onClick={() => setActivePage('dashboard')} active={activePage === 'dashboard'}>
        Dashboard
      </ListGroup.Item>
      <ListGroup.Item action href="" onClick={() => setActivePage('orders')} active={activePage === 'orders'}>
        Orders
      </ListGroup.Item>
      <ListGroup.Item action href="" onClick={() => setActivePage('settings')} active={activePage === 'settings'}>
        Settings
      </ListGroup.Item>
    </ListGroup>
  )
  function handleSelectItem(item) {
    setCartItems(prev => [...prev, item])
  }

  const cartButton = (
    <button className='align-right'>
      Cart
      <span style={{ marginLeft: 5, color: 'white', backgroundColor: 'red', borderRadius: '50%', padding: '2px 6px', fontSize: '12px' }}>
        {cartItems.length}
      </span>
    </button>
  )

  return (
    <AppLayout sidebar={sidebar} topbarProps={{ brand: 'Order App', right: cartButton }}>
      {activePage === 'dashboard' && <Dashboard onSelectItem={handleSelectItem} />}
      {/* {activePage === 'items' && <Items />}
      {activePage === 'orders' && <Orders />}
      {activePage === 'settings' && <Settings /> */}
    </AppLayout>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
