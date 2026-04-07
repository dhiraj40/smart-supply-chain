import { Button, Card, ListGroup } from 'react-bootstrap'
import StatusBanner from '../components/StatusBanner'
import { useCartController } from '../usecases/useCartController'

function getPaymentVariant(status) {
  if (status === 'failed') {
    return 'danger'
  }

  if (status === 'successful') {
    return 'success'
  }

  if (status === 'pending' || status === 'starting') {
    return 'info'
  }

  return 'secondary'
}

function getCheckoutButtonLabel(checkout) {
  if (!checkout.isSubmitting) {
    return 'Checkout'
  }

  if (checkout.payment.status === 'starting') {
    return 'Starting Payment...'
  }

  if (checkout.payment.status === 'pending') {
    return 'Checking Payment...'
  }

  if (checkout.payment.status === 'successful') {
    return 'Creating Order...'
  }

  return 'Processing Order...'
}

export default function CartPage() {
  const { cart, checkout } = useCartController()
  const cartItems = cart.items

  if (cartItems.length === 0) {
    return (
      <div style={styles.container}>
        <h2>Your Cart</h2>
        <StatusBanner variant="success">{checkout.success}</StatusBanner>
        <Card body style={styles.emptyState}>
          No items added yet. Pick items from the dashboard to start an order.
        </Card>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={{ marginBottom: 0 }}>Your Cart</h2>
        <Button
          variant="outline-danger"
          onClick={cart.clearCart}
          disabled={checkout.isSubmitting}
        >
          Clear Cart
        </Button>
      </div>

      <StatusBanner variant="danger">{checkout.error}</StatusBanner>
      <StatusBanner variant="success">{checkout.success}</StatusBanner>
      <StatusBanner variant={getPaymentVariant(checkout.payment.status)}>
        {checkout.payment.message}
      </StatusBanner>

      <div style={styles.grid}>
        <Card>
          <ListGroup variant="flush">
            {cartItems.map((cartItem) => {
              const { item, quantity } = cartItem
              const lineTotal = item.unitPrice * quantity

              return (
                <ListGroup.Item key={item.id}>
                  <div style={styles.itemRow}>
                    <div style={styles.itemInfo}>
                      <div style={styles.itemTitle}>{item.name}</div>
                      {item.description && (
                        <div style={styles.itemDescription}>{item.description}</div>
                      )}
                      <div style={styles.price}>${item.unitPrice.toFixed(2)} each</div>
                    </div>

                    <div style={styles.controls}>
                      <div style={styles.quantityControls}>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => cart.decreaseItem(item.id)}
                          disabled={checkout.isSubmitting}
                        >
                          -
                        </Button>
                        <span style={styles.quantity}>{quantity}</span>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => cart.addItem(item)}
                          disabled={checkout.isSubmitting}
                        >
                          +
                        </Button>
                      </div>

                      <div style={styles.lineTotal}>${lineTotal.toFixed(2)}</div>

                      <Button
                        variant="link"
                        size="sm"
                        style={styles.removeButton}
                        onClick={() => cart.removeItem(item.id)}
                        disabled={checkout.isSubmitting}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </ListGroup.Item>
              )
            })}
          </ListGroup>
        </Card>

        <Card body style={styles.summaryCard}>
          <h4>Order Summary</h4>
          <div style={styles.summaryRow}>
            <span>Items</span>
            <strong>{cart.summary.totalQuantity}</strong>
          </div>
          <div style={styles.summaryRow}>
            <span>Subtotal</span>
            <strong>${cart.summary.subtotal.toFixed(2)}</strong>
          </div>
          <Button
            className="w-100"
            disabled={checkout.isSubmitting || cartItems.length === 0}
            onClick={checkout.submitCheckout}
          >
            {getCheckoutButtonLabel(checkout)}
          </Button>
        </Card>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)',
    gap: '1rem',
    alignItems: 'start',
  },
  emptyState: {
    color: '#6c757d',
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  itemInfo: {
    flex: '1 1 320px',
  },
  itemTitle: {
    fontWeight: 600,
    marginBottom: '0.35rem',
  },
  itemDescription: {
    color: '#6c757d',
    marginBottom: '0.35rem',
  },
  price: {
    fontSize: '0.95rem',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  quantity: {
    minWidth: '1.5rem',
    textAlign: 'center',
    fontWeight: 600,
  },
  lineTotal: {
    minWidth: '5.5rem',
    textAlign: 'right',
    fontWeight: 600,
  },
  removeButton: {
    textDecoration: 'none',
    color: '#dc3545',
    paddingInline: 0,
  },
  summaryCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    position: 'sticky',
    top: '1rem',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}
