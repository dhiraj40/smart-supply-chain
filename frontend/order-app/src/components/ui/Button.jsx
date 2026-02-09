import React from 'react'
import { Button as RBButton } from 'react-bootstrap'

export default function Button({ children, variant = 'primary', size, ...props }) {
  return (
    <RBButton variant={variant} size={size} {...props}>
      {children}
    </RBButton>
  )
}
