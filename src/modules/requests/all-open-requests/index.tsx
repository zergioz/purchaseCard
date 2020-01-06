import React from "react";
import { AllOpenRequests } from "./AllOpenRequests";

const AllOpenRequestsModule = () => {
  return <AllOpenRequests></AllOpenRequests>;
};

export default {
  routeProps: {
    path: "/requests/all-open-requests",
    component: AllOpenRequestsModule
  },
  name: "All Open Requests",
  modules: [],
  linksAsDropdown: false, //for top navigation
  links: []
};
