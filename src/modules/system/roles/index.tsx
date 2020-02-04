import React from "react";
import { RolesPage } from "./RolesPage";

const RolesModule = () => {
  return <RolesPage></RolesPage>;
};

export default {
  routeProps: {
    path: "/system/roles",
    component: RolesModule
  },
  hideFromTopNav: true,
  name: "Roles"
};
