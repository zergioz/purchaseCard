import React from "react";
import { AllRequests } from "./AllRequests";

const RequestsByStatusModule = () => {
  return <AllRequests></AllRequests>;
};

export default {
  routeProps: {
    path: "/requests/all-requests",
    component: RequestsByStatusModule
  },
  name: "All Requests",
  modules: [],
  links: []
};
