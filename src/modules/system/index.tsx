import SystemHomeModule from "./system-home";

export default {
  routeProps: {
    path: "/system",
    component: SystemHomeModule.routeProps.component
  },
  name: "System",
  modules: [SystemHomeModule]
};
