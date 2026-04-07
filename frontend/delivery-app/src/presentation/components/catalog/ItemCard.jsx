import { useEffect, useState } from 'react'
import { Badge, Button, Card, Spinner } from 'react-bootstrap'

export default function ItemCard({
  item,
  quantity = 0,
  onAdd,
  onOpen,
  disabled = false,
}) {
  const [imageStatus, setImageStatus] = useState(item.imageUrl ? 'loading' : 'empty')

  useEffect(() => {
    setImageStatus(item.imageUrl ? 'loading' : 'empty')
  }, [item.imageUrl])

  function handleOpen() {
    if (onOpen) {
      onOpen(item)
    }
  }

  function handleCardKeyDown(event) {
    if (!onOpen || event.target !== event.currentTarget) {
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onOpen(item)
    }
  }

  function handleAddClick(event) {
    event.stopPropagation()

    if (!disabled) {
      onAdd(item)
    }
  }

  return (
    <Card
      className={`item-card ${onOpen ? 'item-card--clickable' : ''}`}
      onClick={handleOpen}
      onKeyDown={handleCardKeyDown}
      role={onOpen ? 'button' : undefined}
      tabIndex={onOpen ? 0 : undefined}
      aria-label={onOpen ? `View details for ${item.name}` : undefined}
    >
      <div className="item-card__media">
        {item.imageUrl && (
          <img
            className={`item-card__image ${imageStatus === 'loaded' ? 'is-visible' : ''}`}
            src={item.imageUrl}
            alt={item.name}
            onLoad={() => setImageStatus('loaded')}
            onError={() => setImageStatus('error')}
          />
        )}

        {imageStatus === 'loading' && (
          <div className="item-card__placeholder" aria-live="polite">
            <Spinner animation="border" size="sm" />
            <span>Loading image...</span>
          </div>
        )}

        {imageStatus === 'error' && (
          <div className="item-card__placeholder item-card__placeholder--error" aria-live="polite">
            <span className="item-card__placeholder-title">Image unavailable</span>
            <span className="item-card__placeholder-copy">Showing item details without a product photo.</span>
          </div>
        )}

        {imageStatus === 'empty' && (
          <div className="item-card__placeholder" aria-label="No product image available">
            <span className="item-card__placeholder-title">No image</span>
            <span className="item-card__placeholder-copy">Product photo not provided.</span>
          </div>
        )}
      </div>

      <Card.Body className="item-card__body">
        {item.badges?.length > 0 && (
          <div className="item-card__badges">
            {item.badges.slice(0, 2).map((badge) => (
              <Badge bg="warning" text="dark" key={`${item.id}-${badge}`}>
                {badge}
              </Badge>
            ))}
          </div>
        )}

        <Card.Title className="item-card__title">{item.name}</Card.Title>
        {item.description && <Card.Text className="item-card__description">{item.description}</Card.Text>}
        <Card.Text className="item-card__price">
          {item.mrp && item.mrp > item.unitPrice && (
            <span className="item-card__mrp">${item.mrp.toFixed(2)}</span>
          )}
          <strong>${item.unitPrice.toFixed(2)}</strong>
        </Card.Text>
      </Card.Body>
      <Card.Footer className="item-card__footer">
        <Button className="w-100" onClick={handleAddClick} disabled={disabled}>
          {quantity > 0 ? `Add to Order (${quantity})` : '+ Add to Order'}
        </Button>
      </Card.Footer>
    </Card>
  )
}
