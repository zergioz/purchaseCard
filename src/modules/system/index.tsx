import SystemHomeModule from "./system-home";
import RolesModule from "./roles";

export default {
  routeProps: {
    path: "/system",
    component: SystemHomeModule.routeProps.component
  },
  name: "System",

  modules: [SystemHomeModule, RolesModule]
};
