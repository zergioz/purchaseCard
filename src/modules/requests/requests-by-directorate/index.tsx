import React from "react";
import { RequestsByDirectorate } from "./RequestsByDirectorate";
import { PersonDirectorates as directorates } from "../../../constants/PersonDirectorates";

const RequestsByDirectorateModule = () => {
  return <RequestsByDirectorate></RequestsByDirectorate>;
};

const sidebarLinks = directorates.map(directorate => {
  return {
    routeProps: {
      path: `/requests/by-directorate/${directorate}`,
      component: RequestsByDirectorateModule
    },
    name: `${directorate}`
  };
});

export default {
  routeProps: {
    path: "/requests/by-directorate",
    component: RequestsByDirectorateModule
  },
  alternateRouteProps: [
    {
      path: "/requests/by-directorate/:directorate",
      component: RequestsByDirectorateModule
    }
  ],
  name: "Requests by Directorate",
  modules: [],
  links: sidebarLinks
};
