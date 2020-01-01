import RequestsByDirectorateModule from "./requests-by-directorate";
import AllRequestsModule from "./all-requests";
import SubmittedByMeModule from "./submitted-by-me";

export default {
  routeProps: {
    path: "/requests",
    component: SubmittedByMeModule.routeProps.component
  },
  name: "Requests",
  modules: [SubmittedByMeModule, AllRequestsModule, RequestsByDirectorateModule]
};
