import React from "react";
import { Nav, Button } from "react-bootstrap";
import modules from "../../modules";

export const SideBar = () => {
  return (
    <Nav className="flex-column sidebar">
      <Nav.Item>
        <br />
        <Button
          className="m-3"
          variant="success"
          size="lg"
          href="../Pages/purchase_request.aspx"
        >
          Submit Request
        </Button>
        <br />
      </Nav.Item>
      <Nav.Link href="/">
        <br />
        Portal Home
      </Nav.Link>

      {/* Create a link for each module exported from ./modules */}
      {modules.map((module: any, moduleIndex: number) => {
        let links = [
          <Nav.Link
            className="nav-header"
            href={`/#${module.routeProps.path}`}
            key={`sidebar-module-${moduleIndex}`}
          >
            {module.name}
          </Nav.Link>
        ];
        module.modules.map((submodule: any, submoduleIndex: number) => {
          links.push(
            <Nav.Link
              href={`/#${submodule.routeProps.path}`}
              key={`sidebar-submodule-${moduleIndex}-${submoduleIndex}`}
            >
              {submodule.name}
            </Nav.Link>
          );

          submodule.links &&
            submodule.links.map((link: any, linkIndex: number) => {
              links.push(
                <Nav.Link
                  className="nav-submodule-link"
                  href={`/#${link.routeProps.path}`}
                  key={`sidebar-link-${moduleIndex}-${submoduleIndex}-${linkIndex}`}
                >
                  {link.name}
                </Nav.Link>
              );
            });
        });
        return links;
      })}

      <Nav.Item className="nav-header">Help</Nav.Item>
      <Nav.Link href="../Shared%20Documents/Forms/AllItems.aspx">
        Documentation
      </Nav.Link>
      <Nav.Item className="nav-header">Admin</Nav.Item>
      <Nav.Link href="./cc_user_list.aspx">Users Overview</Nav.Link>
      <Nav.Link href="./cc_user_add.aspx">Add User</Nav.Link>
    </Nav>
  );
};
