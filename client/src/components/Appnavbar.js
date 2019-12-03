import React, {useState} from "react";
import { useAuth0 } from "../react-auth0-spa";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Button
} from 'reactstrap';
// import TransparentLogo from './TransparentLogo.png';
import './Appnavbar.css';


const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [isOpen, setOpen] = useState(false);

  const toggle = () => {
    setOpen(!isOpen);
  }

  return (
    <div>
    <style>
@import url('https://fonts.googleapis.com/css?family=Quicksand');
</style>
      <Navbar color="DarkSlateGrey" dark expand="md" className="mb-5">
        <NavbarBrand href="/"> <h1 className="navbarTitle">HealthTrac</h1>
    </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
           {!isAuthenticated && (
            <NavItem>
              <Button onClick={() => loginWithRedirect({})}>Login</Button>
            </NavItem>
           ) }
          {isAuthenticated && (
            <NavItem>
              <Button onClick={() => logout()}>Logout</Button>
            </NavItem>
          )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  )
};

export default NavBar;