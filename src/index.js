//IE 11 polyfills
import "babel-polyfill";
import "whatwg-fetch";
import "es6-promise/auto";

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

//use styles from legacy pages to blend in
import "bootstrap/dist/css/bootstrap.min.css";
import "./legacy/SiteAssets/css/toolkit-light.css";
import "./legacy/SiteAssets/css/application.css";
import "./legacy/SiteAssets/css/style.css";
import $ from "jquery";
window.jQuery = window.$ = $;
require("bootstrap");

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
