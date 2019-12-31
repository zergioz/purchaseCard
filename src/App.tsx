import React from "react";
import {
  Route,
  HashRouter as Router,
  Switch,
  Redirect
} from "react-router-dom";
import modules from "./modules";
import "./App.css";
import { SideBar } from "./components/sidebar/SideBar";
import { RequestProvider } from "./contexts/RequestContext";
import { UserProvider } from "./contexts/UserContext";

const App = () => {
  return (
    <div>
      <Router>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3 sidebar">
              <SideBar modules={modules}></SideBar>
            </div>
            <div className="col-md-9">
              <UserProvider>
                <RequestProvider>
                  <Switch>
                    {/* Create a route for each module exported from ./modules */}
                    {modules.map(module => (
                      <Route {...module.routeProps} key={module.name} />
                    ))}
                    <Redirect from="/requests" to="/requests/by-directorate" />
                  </Switch>
                </RequestProvider>
              </UserProvider>
            </div>
          </div>
        </div>
      </Router>
    </div>
  );
};

export default App;
