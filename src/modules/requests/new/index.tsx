import React from "react";
import { NewRequest } from "./NewRequest";

const NewRequestModule = () => {
  return <NewRequest></NewRequest>;
};

export default {
  routeProps: {
    path: "/requests/new",
    component: NewRequestModule
  },
  alternateRouteProps: [],
  name: "New Request",
  modules: [],
  hideFromTopNav: true,
  linksAsDropdown: false, //for top navigation
  links: []
};
