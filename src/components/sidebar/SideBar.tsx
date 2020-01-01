import React from "react";
import { Nav } from "react-bootstrap";

export const SideBar = (props: any) => {
  return (
    <Nav className="flex-column">
      <Nav.Link href="/">Portal Home</Nav.Link>

      {/* Create a link for each module exported from ./modules */}
      {props.modules.map((module: any, moduleIndex: number) => {
        let links = [
          <Nav.Link
            href={`/#${module.routeProps.path}`}
            eventKey={`sidebar-module-${moduleIndex}`}
          >
            {module.name}
          </Nav.Link>
        ];
        module.modules.map((submodule: any, submoduleIndex: number) => {
          links.push(
            <Nav.Link
              href={`/#${submodule.routeProps.path}`}
              eventKey={`sidebar-submodule-${moduleIndex}-${submoduleIndex}`}
            >
              {submodule.name}
            </Nav.Link>
          );

          submodule.links &&
            submodule.links.map((link: any, linkIndex: number) => {
              links.push(
                <Nav.Link
                  href={`/#${link.routeProps.path}`}
                  eventKey={`sidebar-link-${moduleIndex}-${submoduleIndex}-${linkIndex}`}
                >
                  {link.name}
                </Nav.Link>
              );
            });
        });
        return links;
      })}

      <Nav.Link href="../Shared%20Documents/Forms/AllItems.aspx">
        Documentation
      </Nav.Link>
      <Nav.Link href="./cc_user_list.aspx">Users Overview</Nav.Link>
      <Nav.Link href="./cc_user_add.aspx">Add User</Nav.Link>
    </Nav>
  );
};
