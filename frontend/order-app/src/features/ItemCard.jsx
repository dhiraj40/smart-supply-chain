import React from 'react'
import { Card, Button } from 'react-bootstrap'

export default function ItemCard({ item, onSelectItem }) {
  const { name, description, unit_price, pic_url } = item || {}

  return (
    <Card style={{ width: '18rem', margin: '0.5rem', height: '100%' }}>
      {pic_url && <Card.Img variant="top" src={pic_url} alt={name} />}
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        {description && <Card.Text>{description}</Card.Text>}
        {unit_price != null && (
          <Card.Text>
            <strong>${unit_price}</strong>
          </Card.Text>
        )}
      </Card.Body>
      <Card.Footer>
        <Button className='align-bottom w-100 h-100' variant="primary" onClick={() => onSelectItem && onSelectItem(item)}>
          + Add to Order
        </Button>
      </Card.Footer>
    </Card>
  )
}
