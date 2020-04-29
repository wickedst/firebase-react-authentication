import React, { useContext } from "react";
import firebase from "../../firebase";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { AuthContext } from "../../AuthProvider";
import { useHistory, Link } from "react-router-dom";

const MyNavbar = () => {
  const { loadingAuthState, user } = useContext(AuthContext);
  const history = useHistory();

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        history.push("/");
      });
  };

  const NavLoggedIn = () => (
    <Nav>
      <NavDropdown title="My Account" id="collasible-nav-dropdown">
        <NavDropdown.Item to="/dashboard" as={Link}>
          Dashboard
        </NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
      </NavDropdown>
    </Nav>
  );
  const NavLoggedOut = () =>
    !loadingAuthState ? (
      <Nav>
        <Nav.Link to="/auth/login" as={Link}>
          Log in
        </Nav.Link>
        <Nav.Link to="/auth/signup" as={Link}>
          Sign Up
        </Nav.Link>
      </Nav>
    ) : null;

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand to="/" as={Link}>
        Firebase React Starter
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
            <NavDropdown.Item>Action</NavDropdown.Item>
            <NavDropdown.Item>Another action</NavDropdown.Item>
            <NavDropdown.Item>Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item>Separated link</NavDropdown.Item>
          </NavDropdown>
        </Nav>
        {user ? <NavLoggedIn /> : <NavLoggedOut />}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default MyNavbar;
