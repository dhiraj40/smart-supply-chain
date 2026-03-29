import { Alert } from 'react-bootstrap'

export default function StatusBanner({ variant = 'info', children }) {
  if (!children) {
    return null
  }

  return <Alert variant={variant}>{children}</Alert>
}
