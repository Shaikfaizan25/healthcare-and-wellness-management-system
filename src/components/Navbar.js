import React from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";

const NavigationBar = () => {
  // Function to get Bootstrap classes based on isActive
const getNavLinkClass = ({ isActive }) =>
  isActive
    ? "fw-semibold text-dark bg-warning rounded px-3 py-2 shadow-sm"
    : "text-warning px-3 py-2";

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand
          as={NavLink}
          to="/"
          end
          className="me-5 fw-bold fs-4 text-white text-decoration-none"
        >
          MyApp
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          {/* Main nav links */}
          <Nav>
            <Nav.Link as={NavLink} to="/patients" end className={getNavLinkClass}>
              Patients
            </Nav.Link>
            <Nav.Link as={NavLink} to="/providers" end className={getNavLinkClass}>
              Providers
            </Nav.Link>
            <Nav.Link as={NavLink} to="/appointments" className={getNavLinkClass}>
              Appointments
            </Nav.Link>

            <NavDropdown title="Services & Enrollments" id="services-enrollments-dropdown" className="mx-2">
              <NavDropdown.Item as={NavLink} to="/wellness" end>
                Wellness Services
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/enrollments">
                Enrollments
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={NavLink} to="/payments" className={getNavLinkClass}>
              Payments
            </Nav.Link>
          </Nav>

          {/* Login and Register links aligned right */}
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/login" className={getNavLinkClass}>
              Login
            </Nav.Link>
            <Nav.Link as={NavLink} to="/register" className={getNavLinkClass}>
              Register
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
