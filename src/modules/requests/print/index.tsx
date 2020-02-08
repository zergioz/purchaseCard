import React from "react";
import { RequestPrintView } from "./RequestPrintView";

const RequestPrintModule = ({ match }: any) => {
  const id = match.params.requestId || "";
  return <RequestPrintView requestId={id}></RequestPrintView>;
};

export default {
  routeProps: {
    path: "/requests/print",
    component: RequestPrintModule
  },
  alternateRouteProps: [
    {
      path: "/requests/print/:requestId",
      component: RequestPrintModule
    }
  ],
  name: "Print",
  modules: [],
  hideFromTopNav: true,
  linksAsDropdown: false, //for top navigation
  links: []
};
