import React from "react";
import { RequestsByStatus } from "./RequestsByStatus";
import {
  getStatusesByFriendlyName,
  StatusesByFriendlyName
} from "../../../constants/StepStatus";

const statuses: StatusesByFriendlyName = getStatusesByFriendlyName();

const RequestsByStatusModule = ({ match }: any) => {
  const status = match.params.status || "";
  return <RequestsByStatus status={status}></RequestsByStatus>;
};

const links = Object.keys(statuses).map(status => {
  return {
    routeProps: {
      path: `/requests/by-status/${status}`,
      component: RequestsByStatusModule
    },
    name: `${status}`
  };
});

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
  linksAsDropdown: true,
  links: links
};
