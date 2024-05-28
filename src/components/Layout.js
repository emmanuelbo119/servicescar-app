import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar bg="primary" variant="dark">
        <Navbar.Brand href="#home">ServiceCar</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#services">Servicios</Nav.Link>
          <Nav.Link href="#turnos">Turnos</Nav.Link>
          <Nav.Link href="#perfil">Perfil</Nav.Link>
          <Nav.Link href="#logout">Logout</Nav.Link>
        </Nav>
      </Navbar>
      <Container className="mt-5">
        {children}
      </Container>
    </div>
  );
};

export default Layout;
