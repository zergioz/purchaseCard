import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

//use styles from legacy pages to blend in
import "./legacy/SiteAssets/bootstrap-4.3.1/css/bootstrap.min.css";
import "./legacy/SiteAssets/css/toolkit-light.css";
import "./legacy/SiteAssets/css/application.css";
import "./legacy/SiteAssets/css/style.css";

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
