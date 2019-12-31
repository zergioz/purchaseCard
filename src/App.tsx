import React, { ReactElement } from "react";
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
  //create a route for each module and submodule exported from ./modules
  const makeRoutes = () => {
    let routes: ReactElement[] = [];
    modules.map(module => {
      const submodules = module.modules;
      routes.push(<Route exact {...module.routeProps} key={module.name} />);

      submodules.map(submodule => {
        routes.push(
          <Route exact {...submodule.routeProps} key={submodule.name} />
        );
      });
    });
    return routes;
  };

  return (
    <div>
      <Router>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2 sidebar">
              <SideBar modules={modules}></SideBar>
            </div>
            <div className="col-md-10">
              <UserProvider>
                <RequestProvider>
                  <Switch>
                    {makeRoutes()}
                    <Redirect from="/" to="/system" />
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
