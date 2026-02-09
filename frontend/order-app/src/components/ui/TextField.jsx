import React from 'react'
import { Form } from 'react-bootstrap'

export default function TextField({ label, placeholder, value, onChange, type = 'text', ...props }) {
  return (
    <Form.Group>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control type={type} placeholder={placeholder} value={value} onChange={onChange} {...props} />
    </Form.Group>
  )
}
