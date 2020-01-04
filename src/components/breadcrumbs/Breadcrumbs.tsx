import React, { ReactElement } from "react";
import modules from "../../modules";
import { Breadcrumb } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { ModuleBreadcrumb } from "./ModuleBreadcrumb";

export const Breadcrumbs = () => {
  const location = useLocation();

  const getBreadcrumbForModule = (module: any, key: any) => {
    return <ModuleBreadcrumb module={module} key={`breadcrumb-${key}`} />;
  };

  const makeModuleBreadcrumbs = () => {
    let crumbs: ReactElement<any>[] = [];

    modules.map((mod: any) => {
      if (location.pathname.indexOf(mod.routeProps.path) != -1) {
        const moduleCrumb = getBreadcrumbForModule(mod, 1);
        crumbs.push(moduleCrumb);
      }

      mod.modules.map((submodule: any) => {
        if (location.pathname.indexOf(submodule.routeProps.path) != -1) {
          const submoduleCrumb = getBreadcrumbForModule(submodule, 2);
          crumbs.push(submoduleCrumb);
        }

        submodule.links &&
          submodule.links.map((link: any) => {
            if (location.pathname.indexOf(link.routeProps.path) != -1) {
              const linkCrumb = getBreadcrumbForModule(link, 3);
              crumbs.push(linkCrumb);
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
      {makeModuleBreadcrumbs()}
    </Breadcrumb>
  );
};
