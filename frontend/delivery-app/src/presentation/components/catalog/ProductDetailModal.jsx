import { useEffect, useState } from 'react'
import { Badge, Button, Modal, Spinner } from 'react-bootstrap'
import StatusBanner from '../StatusBanner'

function formatPrice(value, currency = 'USD') {
  const numeric = Number(value) || 0

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(numeric)
  } catch {
    return `$${numeric.toFixed(2)}`
  }
}

function getImageStateFromUrl(url) {
  return url ? 'loading' : 'empty'
}

export default function ProductDetailModal({
  state,
  quantity = 0,
  onClose,
  onAdd,
  disabled = false,
}) {
  const detail = state?.detail || null
  const item = detail || state?.item || null
  const imageUrl = detail?.images?.[0]?.url || item?.imageUrl || ''
  const [imageStatus, setImageStatus] = useState(getImageStateFromUrl(imageUrl))
  const variants = detail?.variants || []
  const specifications = detail?.specifications || []
  const hasStock = variants.length
    ? variants.some((variant) => variant.inventory?.inStock)
    : true

  useEffect(() => {
    setImageStatus(getImageStateFromUrl(imageUrl))
  }, [imageUrl])

  return (
    <Modal show={Boolean(state?.isOpen)} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{item?.name || 'Product details'}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {state?.isLoading && (
          <div className="product-detail-modal__loading">
            <Spinner animation="border" size="sm" />
            <span>Loading product details...</span>
          </div>
        )}

        {!state?.isLoading && state?.error && (
          <StatusBanner variant="danger">{state.error}</StatusBanner>
        )}

        {!state?.isLoading && !item && !state?.error && (
          <p className="mb-0">No product selected.</p>
        )}

        {!state?.isLoading && item && (
          <div className="product-detail-modal__content">
            <div className="product-detail-modal__media">
              {imageUrl && (
                <img
                  className={`product-detail-modal__image ${
                    imageStatus === 'loaded' ? 'is-visible' : ''
                  }`}
                  src={imageUrl}
                  alt={item.name}
                  onLoad={() => setImageStatus('loaded')}
                  onError={() => setImageStatus('error')}
                />
              )}

              {imageStatus === 'loading' && (
                <div className="product-detail-modal__placeholder">
                  <Spinner animation="border" size="sm" />
                  <span>Loading image...</span>
                </div>
              )}

              {imageStatus === 'error' && (
                <div className="product-detail-modal__placeholder product-detail-modal__placeholder--error">
                  <span>Image unavailable</span>
                </div>
              )}

              {imageStatus === 'empty' && (
                <div className="product-detail-modal__placeholder">
                  <span>No image provided</span>
                </div>
              )}
            </div>

            <div className="product-detail-modal__meta">
              <p className="product-detail-modal__brand">
                {item.brand || 'Warehouse Equipment'}
              </p>
              <p className="product-detail-modal__description">
                {item.description || 'No description available.'}
              </p>
              <p className="product-detail-modal__price">
                {item.mrp && item.mrp > item.unitPrice && (
                  <span className="product-detail-modal__mrp">
                    {formatPrice(item.mrp, item.currency)}
                  </span>
                )}
                <strong>{formatPrice(item.unitPrice, item.currency)}</strong>
              </p>

              {item.badges?.length > 0 && (
                <div className="product-detail-modal__badges">
                  {item.badges.slice(0, 3).map((badge) => (
                    <Badge bg="warning" text="dark" key={`${item.id}-${badge}`}>
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}

              {variants.length > 0 && (
                <div>
                  <h6 className="mb-2">Variants</h6>
                  <div className="product-detail-modal__pills">
                    {variants.slice(0, 4).map((variant) => (
                      <Badge
                        bg={variant.inventory?.inStock ? 'success' : 'secondary'}
                        key={variant.sku}
                      >
                        {variant.attributes?.Color || variant.attributes?.Model || variant.sku}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {specifications.length > 0 && (
                <div>
                  <h6 className="mb-2">Specifications</h6>
                  <div className="product-detail-modal__specs">
                    {specifications.slice(0, 4).map((spec) => (
                      <div
                        className="product-detail-modal__spec-row"
                        key={`${spec.group}-${spec.key}`}
                      >
                        <span>{spec.key}</span>
                        <strong>{spec.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>
          Close
        </Button>
        <Button
          onClick={() => item && onAdd(item)}
          disabled={!item || state?.isLoading || !hasStock || disabled}
        >
          {!hasStock
            ? 'Out of stock'
            : disabled
              ? 'Order in progress...'
            : quantity > 0
              ? `Add to Order (${quantity})`
              : 'Add to Order'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
