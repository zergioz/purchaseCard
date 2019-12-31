import React from "react";
import { LandingPage } from "./LandingPage";

const LandingPageModule = () => {
  return <LandingPage></LandingPage>;
};

export default {
  routeProps: {
    path: "/",
    component: LandingPageModule
  },
  name: "System Home"
};
