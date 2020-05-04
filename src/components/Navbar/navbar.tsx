import React, { useContext } from "react";
import firebase from "../../firebase";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { AuthContext } from "../../AuthProvider";
import { useHistory, Link } from "react-router-dom";

const MyNavbar = () => {
  const { loadingAuthState, user, userProfile, addToasts } = useContext(
    AuthContext
  );
  const history = useHistory();

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        history.push("/");
        addToasts((prevToasts: any) => [
          ...prevToasts,
          { variant: "info", message: "Logged out" },
        ]);
      });
  };

  const NavLoggedIn = () =>
    userProfile ? (
      <>
        <NavDropdown
          alignRight
          title={userProfile.username}
          id="collasible-nav-dropdown"
        >
          <NavDropdown.Item to="/dashboard" as={Link}>
            Dashboard
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
        </NavDropdown>
      </>
    ) : null;

  const NavLoggedOut = () =>
    !loadingAuthState ? (
      <>
        <Nav.Link to="/auth/login" as={Link}>
          Log in
        </Nav.Link>
        <Nav.Link to="/auth/signup" as={Link}>
          Sign Up
        </Nav.Link>
      </>
    ) : null;

  return (
    <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark">
      <Navbar.Brand to="/" as={Link}>
        Firebase React Starter
      </Navbar.Brand>
      <Nav className="ml-auto">{user ? <NavLoggedIn /> : <NavLoggedOut />}</Nav>
    </Navbar>
  );
};

export default MyNavbar;
