import React from "react";
import { AllRequests } from "./AllRequests";

const AllRequestsModule = () => {
  return <AllRequests></AllRequests>;
};

export default {
  routeProps: {
    path: "/requests/all-requests",
    component: AllRequestsModule
  },
  name: "All Requests"
};
