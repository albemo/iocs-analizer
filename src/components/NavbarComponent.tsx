import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { RiVirusLine } from 'react-icons/ri';
import { Link } from "react-router-dom";

function NavbarComponent() {
  return (
    <>
      <Navbar bg='success' variant='dark' expand='lg'>
        <RiVirusLine size={32} />
        <Navbar.Brand className='ml-2' href='/virus-total'>
          IOCs Analizer
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Link to="/virus-total" className="text-white mr-2">IOC</Link>
            <Link to="/ip" className="text-white mr-2">IP</Link>
            {/* <Nav.Link href="/virus-total">Virus Total</Nav.Link>   */}
            {/* <Nav.Link href="/otro">Otro</Nav.Link> */}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

export default NavbarComponent;
