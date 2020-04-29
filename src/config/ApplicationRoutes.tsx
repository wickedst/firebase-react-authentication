import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  // Redirect,
} from "react-router-dom";
import { AuthRoutes } from "../views/Auth";
import PrivateRoute from "./routes/PrivateRoute";
import LoggedInRoute from "./routes/LoggedInRoute";
import { DashboardRoutes } from "../views/Dashboard";
import { Home } from "../views/Home/components";
import Navbar from "../components/Navbar/navbar";

const ApplicationRoutes = () => {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <LoggedInRoute path="/auth" component={AuthRoutes} />
        <PrivateRoute exact path="/dashboard" component={DashboardRoutes} />
        <Route path="/auth" component={AuthRoutes} />
        {/* <Redirect to="/auth" from="/" /> */}
        {/* <Route path="/" component={AuthRoutes} /> */}
      </Switch>
    </Router>
  );
};

export default ApplicationRoutes;
