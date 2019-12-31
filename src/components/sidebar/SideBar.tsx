import React from "react";
import { Link } from "react-router-dom";

export const SideBar = (props: any) => {
  return (
    <nav className="sidebar-nav">
      <ul className="nav nav-pills nav-stacked flex-column">
        {/* Create a link for each module exported from ./modules */}
        {props.modules.map((module: any) => {
          let links = [
            <Link
              className="nav-header"
              to={module.routeProps.path}
              key={module.name}
            >
              {module.name}
            </Link>
          ];
          {
            /* Create a link for each submodule */
          }
          module.modules.map((submodule: any) => {
            links.push(
              <li className="nav-item" key={submodule.name}>
                <Link className="nav-link" to={submodule.routeProps.path}>
                  {submodule.name}
                </Link>
              </li>
            );
          });
          return links;
        })}
        <li className="nav-header">Documentation & Other</li>
        <li className="nav-item">
          <a
            className="nav-link"
            href="../Shared%20Documents/Forms/AllItems.aspx"
            target="_blank"
          >
            Documentation
          </a>
        </li>
        <li className="nav-header">Users</li>
        <li className="nav-item">
          <a className="nav-link" href="cc_user_list.aspx">
            Users Overview
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="cc_user_add.aspx">
            Add User
          </a>
        </li>
      </ul>
    </nav>
  );
};
