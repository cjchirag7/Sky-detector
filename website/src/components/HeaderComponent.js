import React, { Component } from 'react';
import {
  Navbar,
  Form,
  FormGroup,
  Label,
  Input,
  Nav,
  NavbarToggler,
  Collapse,
  NavItem,
  NavbarBrand,
  Modal,
  ModalBody,
  ModalHeader,
  Button
} from 'reactstrap';
import {
  Dropdown,
  Row,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  InputGroupAddon
} from 'reactstrap';
import { NavLink, Link } from 'react-router-dom';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNavOpen: false
    };
    this.toggleNav = this.toggleNav.bind(this);
  }

  toggleNav() {
    if (window.innerWidth < 1200) {
      this.setState({
        isNavOpen: !this.state.isNavOpen
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <Navbar dark color='primary' expand='lg' fixed='top'>
          <div className='container'>
            <NavbarToggler onClick={this.toggleNav}></NavbarToggler>
            <NavbarBrand
              className='mr-auto white-text brand d-block d-lg-none'
              href='/home'
            >
              Sky Detector
            </NavbarBrand>
            <Collapse isOpen={this.state.isNavOpen} navbar>
              <Nav navbar>
                {/* <NavItem className="ml-2" onClick={this.toggleNav}>
                            <NavLink className="nav-link white-text" to="/home">
                               <span className="fa fa-home   "/> Home
                           </NavLink>
                        </NavItem>
                                {/* <NavItem className="ml-2" onClick={this.toggleNav}>
                                    <NavLink className="nav-link white-text" to="/products">
                                        <span className="fa fa-cutlery   " /> Canteens
                           </NavLink>
                                </NavItem>
                        <Dropdown isOpen={this.state.shopsOpen} toggle={this.shopstoggle}>
                                    <DropdownToggle color="white">
                                        <div className="white-text">
                                            <span className="fa fa-shopping-bag   " /> Shops
                                                   &nbsp; <i className="fa fa-caret-down fa-sm" aria-hidden="true"></i>

                                        </div>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem onClick={this.toggleNav} tag={Link} to="/products">Inside campus</DropdownItem>
                                        <DropdownItem onClick={this.toggleNav} tag={Link} to="/products" >Outside</DropdownItem>
                                    </DropdownMenu>
                        </Dropdown> */}
                {/* <Dropdown  isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                            <DropdownToggle color="white">
                            <div className="white-text">
                                <span className="fa fa-gift   "/> Products
                                                   &nbsp; <i className="fa fa-caret-down fa-sm" aria-hidden="true"></i>

                                                </div>
                            </DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem onClick={this.toggleNav} tag={Link} to="/books">Books</DropdownItem>
                              <DropdownItem onClick={this.toggleNav} tag={Link} to="/bicycles" >Bicycles</DropdownItem>
                              <DropdownItem onClick={this.toggleNav} tag={Link} to="/stationary" >Stationary</DropdownItem>
                              <DropdownItem onClick={this.toggleNav} tag={Link} to="/electronics" >Electronic Gadgets</DropdownItem>
                              <DropdownItem onClick={this.toggleNav} tag={Link} to="/clothes" >Clothes</DropdownItem>
                              <DropdownItem onClick={this.toggleNav} tag={Link} to="/sports" >Sports</DropdownItem>
                              <DropdownItem onClick={this.toggleNav} tag={Link} to="/others" >Others</DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        <NavItem className="ml-2" onClick={this.toggleNav}>
                            <NavLink className="nav-link white-text" to="/search">
                                <span className="fa fa-search   "/> Search
                            </NavLink>
                        </NavItem>
                                <NavItem className="ml-2" onClick={this.toggleNav}>
                                    <NavLink className="nav-link white-text" to="/chatbot">
                                        <span className="fa fa-question   " /> UNA
                           </NavLink>
                                </NavItem> */}
                {/* : (<div />) } */}
              </Nav>
              <Nav className='ml-auto' navbar>
                {/* <NavItem> */}
                {/* {!this.props.auth.isAuthenticated ? (
                    <Button color='primary' onClick={this.toggleModal}>
                      <span className='fa fa-sign-in   '></span> Login
                      {this.props.auth.isLoading ? (
                        <span className='fa fa-spinner fa-pulse fa-fw'></span>
                      ) : null}
                    </Button>
                  ) : (
                    <div>
                      <div className='navbar-text white-text mr-1'>
                        {this.props.auth.user.username}
                      </div>
                      <Button color='info' onClick={this.handleLogout}>
                        <span className='fa fa-sign-out   '></span> Logout
                        {this.props.auth.isLoading ? (
                          <span className='fa fa-spinner fa-pulse fa-fw'></span>
                        ) : null}
                      </Button>
                    </div>
                  )}

                  <Registerer
                    isSignedIn={this.props.auth.isAuthenticated}
                    toggleRegister={() => {
                      this.toggleRegister();
                    }}
                  />
                </NavItem> */}
              </Nav>
            </Collapse>
          </div>
        </Navbar>
      </React.Fragment>
    );
  }
}

export default Header;
