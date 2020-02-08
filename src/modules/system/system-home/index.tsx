import React from "react";
import { SystemHome } from "./SystemHome";

const SystemHomeModule = () => {
  return <SystemHome></SystemHome>;
};

export default {
  routeProps: {
    path: "/system/system-home",
    component: SystemHomeModule
  },
  hideFromTopNav: true,
  name: "System Home"
};
