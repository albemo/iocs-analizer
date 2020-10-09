import React from 'react'
import { Nav, Navbar } from 'react-bootstrap';

function NavbarComponent() {
  return (
    <>
      <Navbar bg="success" variant="dark" expand="lg">
        <Navbar.Brand href="/home">IOCs Analizer</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/virus-total">Virus Total</Nav.Link>
            <Nav.Link href="/otro">Otro</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}

export default NavbarComponent