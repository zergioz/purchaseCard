import React from "react";
import { RequestDetails } from "./RequestDetails";

const RequestDetailsModule = ({ match }: any) => {
  const id = match.params.requestId || "";
  return <RequestDetails requestId={id}></RequestDetails>;
};

export default {
  routeProps: {
    path: "/requests/details",
    component: RequestDetailsModule
  },
  alternateRouteProps: [
    {
      path: "/requests/details/:requestId",
      component: RequestDetailsModule
    }
  ],
  name: "Request Details",
  modules: [],
  hideFromTopNav: true,
  linksAsDropdown: false, //for top navigation
  links: []
};
