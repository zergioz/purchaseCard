import React, { ReactElement } from "react";
import {
  Route,
  HashRouter as Router,
  Switch,
  Redirect
} from "react-router-dom";
import modules from "./modules";
import { TopNav } from "./components/topnav/TopNav";
import { RequestProvider } from "./contexts/RequestContext";
import { UserProvider } from "./contexts/UserContext";
import { RoleProvider } from "./contexts/RoleContext";
import { Breadcrumbs } from "./components/breadcrumbs/Breadcrumbs";
import { ToastProvider } from "react-toast-notifications";

const App = () => {
  const makeRoutes = () => {
    let routes: ReactElement[] = [];

    //creates a route for each module and submodule exported from ./modules
    modules.map(module => {
      const submodules = module.modules;
      routes.push(<Route exact {...module.routeProps} key={module.name} />);

      //each module can have an array of submodules
      submodules.map((submodule: any) => {
        routes.push(
          <Route exact {...submodule.routeProps} key={submodule.name} />
        );

        //each submodule can have alternate routes for params i.e. /directorates/:directorate
        submodule.alternateRouteProps &&
          submodule.alternateRouteProps.map(
            (alternateRouteProps: any, index: number) => {
              routes.push(
                <Route
                  exact
                  {...alternateRouteProps}
                  key={`${submodule.name}-${index}`}
                />
              );
            }
          );
      });
    });
    return routes;
  };

  return (
    <div>
      <UserProvider>
        <RequestProvider>
          <RoleProvider>
            <Router>
              <ToastProvider>
                <TopNav></TopNav>
                <div className="container-fluid-spacious">
                  <div className="row">
                    <div className="col-md-12">
                      <Breadcrumbs />
                    </div>
                  </div>
                </div>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12">
                      <Switch>
                        {makeRoutes()}
                        <Redirect from="/" to="/requests" />
                      </Switch>
                    </div>
                  </div>
                </div>
              </ToastProvider>
            </Router>
          </RoleProvider>
        </RequestProvider>
      </UserProvider>
    </div>
  );
};

export default App;
