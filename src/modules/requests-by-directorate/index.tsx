import React from "react";
import { RequestsByDirectorate } from "./RequestsByDirectorate";

const RequestsByDirectorateModule = () => {
  return <RequestsByDirectorate></RequestsByDirectorate>;
};

export default {
  routeProps: {
    path: "/requests/by-directorate",
    component: RequestsByDirectorateModule
  },
  name: "Requests by Directorate"
};
