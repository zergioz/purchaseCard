import React from "react";
import { Navbar, Nav, Form, FormControl, Button } from "react-bootstrap";
import { FiscalYearFilter } from "../filters/FiscalYearFilter";

export const TopNav = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="#/">GPC Request System</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="#/requests/submitted-by-me">My Requests</Nav.Link>
        <Nav.Link href="#/requests/all-requests">All Requests</Nav.Link>
        <Nav.Link href="#/requests/by-status">By Status</Nav.Link>
        <Nav.Link href="#/requests/by-directorate">By Directorate</Nav.Link>
        <Nav.Link href="../Shared%20Documents/Forms/AllItems.aspx">
          Help
        </Nav.Link>
      </Nav>
      <Form inline>
        <FiscalYearFilter />
      </Form>
    </Navbar>
  );
};
