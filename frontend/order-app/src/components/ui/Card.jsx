import React from 'react'
import { Card as RBCard } from 'react-bootstrap'

export default function AppCard({ title, image, children, footer, className = '', ...props }) {
  return (
    <RBCard className={`app-card ${className}`} {...props}>
      {image && <RBCard.Img variant="top" src={image} />}
      <RBCard.Body>
        {title && <RBCard.Title>{title}</RBCard.Title>}
        {children}
      </RBCard.Body>
      {footer && <RBCard.Footer>{footer}</RBCard.Footer>}
    </RBCard>
  )
}
