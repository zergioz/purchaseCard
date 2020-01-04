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

    modules.map((module: any, moduleIndex: number) => {
      if (location.pathname.indexOf(module.routeProps.path) != -1) {
        const moduleCrumb = getBreadcrumbForModule(module, moduleIndex);
        crumbs.push(moduleCrumb);
      }

      module.modules.map((submodule: any, submoduleIndex: number) => {
        if (location.pathname.indexOf(submodule.routeProps.path) != -1) {
          const submoduleCrumb = getBreadcrumbForModule(
            submodule,
            moduleIndex * 100 + submoduleIndex * 10
          );
          crumbs.push(submoduleCrumb);
        }

        submodule.links &&
          submodule.links.map((link: any, linkIndex: number) => {
            if (location.pathname.indexOf(link.routeProps.path) != -1) {
              const linkCrumb = getBreadcrumbForModule(
                link,
                moduleIndex * 100 + submoduleIndex * 10 + linkIndex
              );
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
