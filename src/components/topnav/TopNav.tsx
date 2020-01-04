import React from "react";
import { Navbar, Nav, Form, NavDropdown, Button } from "react-bootstrap";
import modules from "../../modules";

export const TopNav = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="#/">GPC Request System</Navbar.Brand>
      <Nav className="mr-auto">
        {/* Create a link for each module exported from ./modules */}
        {modules.map((module: any) => {
          let links: any[] = [];
          module.modules.map((submodule: any) => {
            let link: any = null;
            if (submodule.links && submodule.links.length) {
              link = (
                <NavDropdown
                  title={submodule.name}
                  id="collasible-nav-dropdown"
                  key={`nav-${submodule.routeProps.path}`}
                >
                  {submodule.links.map((link: any) => {
                    return (
                      <NavDropdown.Item
                        href={`/#${link.routeProps.path}`}
                        key={`nav-${link.routeProps.path}`}
                      >
                        {link.name}
                      </NavDropdown.Item>
                    );
                  })}
                </NavDropdown>
              );
            } else {
              link = (
                <Nav.Link
                  href={`/#${submodule.routeProps.path}`}
                  key={`nav-${submodule.routeProps.path}`}
                >
                  {submodule.name}
                </Nav.Link>
              );
            }
            links.push(link);
          });
          return links;
        })}
        <Nav.Link href="../Shared%20Documents/Forms/AllItems.aspx">
          Help
        </Nav.Link>
      </Nav>
      <Form inline>
        <Button variant="success" href="../Pages/purchase_request.aspx">
          Submit Request
        </Button>
      </Form>
    </Navbar>
  );
};
