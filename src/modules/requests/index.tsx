import React from "react";
import RequestsByDirectorateModule from "./requests-by-directorate";
import SubmittedByMeModule from "./submitted-by-me";
import RequestsByStatusModule from "./requests-by-status";
import AllRequestsModule from "./all-requests";

const RequestsModuleComponent = AllRequestsModule.routeProps.component;
const RequestsModule = () => {
  return <RequestsModuleComponent></RequestsModuleComponent>;
};

export default {
  routeProps: {
    path: "/requests",
    component: RequestsModule
  },
  name: "Requests",
  modules: [
    SubmittedByMeModule,
    AllRequestsModule,
    RequestsByStatusModule,
    RequestsByDirectorateModule
  ]
};
