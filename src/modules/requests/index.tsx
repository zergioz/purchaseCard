import React from "react";
import RequestsByDirectorateModule from "./requests-by-directorate";
import SubmittedByMeModule from "./submitted-by-me";
import RequestsByStatusModule from "./requests-by-status";
import AllOpenRequestsModule from "./all-open-requests";
import RequestDetailsModule from "./details";

const AllOpenRequestsModuleComponent =
  AllOpenRequestsModule.routeProps.component;
const RequestsModule = () => {
  return <AllOpenRequestsModuleComponent></AllOpenRequestsModuleComponent>;
};

export default {
  routeProps: {
    path: "/requests",
    component: RequestsModule
  },
  name: "Requests",
  modules: [
    SubmittedByMeModule,
    AllOpenRequestsModule,
    RequestsByStatusModule,
    RequestsByDirectorateModule,
    RequestDetailsModule
  ]
};
