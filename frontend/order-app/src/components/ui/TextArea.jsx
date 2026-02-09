import React from 'react'
import { Form } from 'react-bootstrap'

export default function TextArea({ label, placeholder, value, onChange, rows = 4, ...props }) {
  return (
    <Form.Group>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control as="textarea" rows={rows} placeholder={placeholder} value={value} onChange={onChange} {...props} />
    </Form.Group>
  )
}
