import React, { ReactElement } from "react";
import {
  Route,
  HashRouter as Router,
  Switch,
  Redirect
} from "react-router-dom";
import modules from "./modules";
import { SideBar } from "./components/sidebar/SideBar";
import { TopNav } from "./components/topnav/TopNav";
import { RequestProvider } from "./contexts/RequestContext";
import { UserProvider } from "./contexts/UserContext";

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
          <TopNav></TopNav>
          <Router>
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-2 sidebar">
                  <SideBar modules={modules}></SideBar>
                </div>
                <div className="col-md-10">
                  <Switch>
                    {makeRoutes()}
                    <Redirect from="/" to="/requests/submitted-by-me" />
                  </Switch>
                </div>
              </div>
            </div>
          </Router>
        </RequestProvider>
      </UserProvider>
    </div>
  );
};

export default App;
