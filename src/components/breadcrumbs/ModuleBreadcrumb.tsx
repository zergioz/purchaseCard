import React from "react";
import { Breadcrumb } from "react-bootstrap";
import { useLocation } from "react-router-dom";
interface IProps {
  module: any;
}
export const ModuleBreadcrumb = (props: IProps) => {
  const location = useLocation();

  const href =
    location.pathname === props.module.routeProps.path
      ? undefined
      : `#${props.module.routeProps.path}`;
  const active =
    location.pathname === props.module.routeProps.path ? true : undefined;

  return (
    <Breadcrumb.Item href={href} active={active}>
      {props.module.name}
    </Breadcrumb.Item>
  );
};
