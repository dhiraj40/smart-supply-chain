import { Col, Container, Row } from 'react-bootstrap'
import ItemCard from '../catalog/ItemCard'

// function normalizeItem(item) {
//   return {
//     ...item,
//     id: item.id || item.product_id || item.slug,
//     name: item.name || item.product_name || 'Unnamed item',
//     imageUrl: item.imageUrl || item.thumbnail_url || '',
//     unitPrice: item.unitPrice ?? item.selling_price ?? 0,
//     mrp: item.mrp ?? 0,
//     badges: item.badges || [],
//     currency: item.currency || 'USD',
//   }
// }

function getItemQuantity(item, quantities) {
  const quantityMap =
    quantities && typeof quantities === 'object' && quantities.cart ? quantities.cart : quantities

  return Number(quantityMap?.[item.product_id]) || 0
}

export default function GridList({
  children,
  items = [],
  quantities = {},
  onAdd,
  onOpen,
  disabled = false,
  className = '',
}) {
  if (children) {
    return (
      <Container fluid className="py-4">
        <Row className={`g-4 ${className}`.trim()}>{children}</Row>
      </Container>
    )
  }

  if (!items.length) {
    return <p>No items available.</p>
  }

  return (
    <Container fluid className="py-4">
      <Row className={`g-4 ${className}`.trim()}>
        {items.map((item, index) => {
          // const normalizedItem = normalizeItem(item)

          return (
            <Col key={item.product_id || index} xs={12} sm={6} lg={4} xl={3}>
              <ItemCard
                item={item}
                quantity={getItemQuantity(item, quantities)}
                onAdd={onAdd}
                onOpen={onOpen}
                disabled={disabled}
              />
            </Col>
          )
        })}
      </Row>
    </Container>
  )
}
