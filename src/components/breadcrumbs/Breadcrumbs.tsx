import React from "react";
import modules from "../../modules";
import { Breadcrumb } from "react-bootstrap";
import { useLocation } from "react-router-dom";

export const Breadcrumbs = () => {
  const location = useLocation();

  const makeBreadcrumbs = () => {
    let crumbs: any = [];

    modules.map((module: any, moduleIndex: number) => {
      if (location.pathname.indexOf(module.routeProps.path) != -1) {
        crumbs.push(
          <Breadcrumb.Item
            href={`/#${module.routeProps.path}`}
            key={`breadcrumb-module-${moduleIndex}`}
          >
            {module.name}
          </Breadcrumb.Item>
        );
      }

      module.modules.map((submodule: any, submoduleIndex: number) => {
        if (location.pathname.indexOf(submodule.routeProps.path) != -1) {
          crumbs.push(
            <Breadcrumb.Item
              href={`/#${submodule.routeProps.path}`}
              key={`breadcrumb-submodule-${moduleIndex}-${submoduleIndex}`}
            >
              {submodule.name}
            </Breadcrumb.Item>
          );
        }

        submodule.links &&
          submodule.links.map((link: any, linkIndex: number) => {
            if (location.pathname.indexOf(link.routeProps.path) != -1) {
              crumbs.push(
                <Breadcrumb.Item
                  href={`/#${link.routeProps.path}`}
                  key={`breadcrumb-link-${moduleIndex}-${submoduleIndex}-${linkIndex}`}
                >
                  {link.name}
                </Breadcrumb.Item>
              );
            }
          });
      });
    });
    return crumbs;
  };

  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/">Portal Home</Breadcrumb.Item>
      <Breadcrumb.Item href="#/">GPC Request System</Breadcrumb.Item>
      {makeBreadcrumbs()}
    </Breadcrumb>
  );
};
