import RequestsByDirectorateModule from "./requests-by-directorate";
import SubmittedByMeModule from "./submitted-by-me";
import RequestsByStatusModule from "./requests-by-status";
import AllRequestsModule from "./all-requests";

export default {
  routeProps: {
    path: "/requests",
    component: AllRequestsModule.routeProps.component
  },
  name: "Requests",
  modules: [
    SubmittedByMeModule,
    AllRequestsModule,
    RequestsByStatusModule,
    RequestsByDirectorateModule
  ]
};
