import React from "react";
import { RequestsByStatus } from "./RequestsByStatus";

const RequestsByStatusModule = ({ match }: any) => {
  const status = match.params.status || "";
  return <RequestsByStatus status={status}></RequestsByStatus>;
};

export default {
  routeProps: {
    path: "/requests/by-status",
    component: RequestsByStatusModule
  },
  alternateRouteProps: [
    {
      path: "/requests/by-status/:status",
      component: RequestsByStatusModule
    }
  ],
  name: "Requests by Status",
  modules: [],
  links: []
};
