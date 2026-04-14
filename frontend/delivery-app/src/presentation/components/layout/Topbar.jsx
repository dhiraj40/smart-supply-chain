import React from 'react'
import { Navbar, Container, Nav } from 'react-bootstrap'
import '../../theme/theme.css'

export default function Topbar({ brand = 'Order App', children , right}) {
  return (
    <Navbar className="topbar" expand="md">
      <Container fluid>
        <Navbar.Brand>{brand}</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">{children}</Nav>
        </Navbar.Collapse>
        <div>{right}</div>
      </Container>
    </Navbar>
  )
}
