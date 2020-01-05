import React from "react";
import { AllOpenRequests } from "./AllOpenRequests";

const RequestsByStatusModule = () => {
  return <AllOpenRequests></AllOpenRequests>;
};

export default {
  routeProps: {
    path: "/requests/all-open-requests",
    component: RequestsByStatusModule
  },
  name: "All Open Requests",
  modules: [],
  linksAsDropdown: false, //for top navigation
  links: []
};
