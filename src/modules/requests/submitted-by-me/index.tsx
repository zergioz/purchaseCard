import React from "react";
import { SubmittedByMe } from "./SubmittedByMe";

const SubmittedByMeModule = () => {
  return <SubmittedByMe></SubmittedByMe>;
};

export default {
  routeProps: {
    path: "/requests/submitted-by-me",
    component: SubmittedByMeModule
  },
  name: "Submitted by Me",
  modules: [],
  linksAsDropdown: false, //for top navigation
  links: []
};
