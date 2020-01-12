import React from "react";
import { Navbar, Nav, Form, NavDropdown, Button } from "react-bootstrap";
import modules from "../../modules";
import { useLocation } from "react-router-dom";

export const TopNav = () => {
  const location = useLocation();

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand href="#/">GPC Request System</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      {/* Min height leaves room for the big submit button */}
      <Navbar.Collapse id="responsive-navbar-nav" style={{ minHeight: "48px" }}>
        <Nav className="mr-auto">
          {/* Create a link for each module exported from ./modules */}
          {modules.map((module: any) => {
            if (module.hideFromTopNav) return;
            let links: any[] = [];
            module.modules.map((submodule: any) => {
              if (submodule.hideFromTopNav) return;
              let link: any = null;
              if (
                submodule.linksAsDropdown &&
                submodule.links &&
                submodule.links.length
              ) {
                link = (
                  <NavDropdown
                    title={submodule.name}
                    id="collapsible-nav-dropdown"
                    key={`nav-${submodule.routeProps.path}`}
                  >
                    <NavDropdown.Item
                      href={`/#${submodule.routeProps.path}`}
                      key={`nav-${submodule.routeProps.path}`}
                    >
                      All
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
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
          <Nav.Link href="./Pages/cc_user_list.aspx">Users</Nav.Link>
          <Nav.Link href="../Shared%20Documents/Forms/AllItems.aspx">
            Help
          </Nav.Link>
        </Nav>
        <Form inline>
          <Button
            hidden={
              location.pathname.startsWith("/requests/details") ||
              location.pathname.startsWith("/requests/new")
            }
            variant="success"
            href="#/requests/new"
            //href="../Pages/purchase_request.aspx"
            size="lg"
          >
            Submit Request
          </Button>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
};
