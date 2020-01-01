import RequestsByDirectorateModule from "./requests-by-directorate";
import SubmittedByMeModule from "./submitted-by-me";
import RequestsByStatusModule from "./requests-by-status";

export default {
  routeProps: {
    path: "/requests",
    component: SubmittedByMeModule.routeProps.component
  },
  name: "Requests",
  modules: [
    SubmittedByMeModule,
    RequestsByStatusModule,
    RequestsByDirectorateModule
  ]
};
