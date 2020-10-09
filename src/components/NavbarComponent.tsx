import React from 'react'
import { Nav, Navbar } from 'react-bootstrap';
import { RiVirusLine } from 'react-icons/ri'

function NavbarComponent() {
  return (
    <>
      <Navbar bg="success" variant="dark" expand="lg">
        <RiVirusLine size={32} />
        <Navbar.Brand className='ml-2' href="/">IOCs Analizer</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        {/* <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/virus-total">Virus Total</Nav.Link>
            <Nav.Link href="/otro">Otro</Nav.Link>
          </Nav>
        </Navbar.Collapse> */}
      </Navbar>
    </>
  )
}

export default NavbarComponent