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
import { AccountRoutes } from "../views/Account";
import { Home } from "../views/Home/components";
import { Profile } from "../views/Profile/components";
import Navbar from "../components/Navbar/navbar";
import Toasts from "../components/Toast/toastContainer";
import { ForgotPassword } from "../views/ForgotPassword/components";

const ApplicationRoutes = () => {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/profile/:slug" component={Profile} />
        <LoggedInRoute path="/auth" component={AuthRoutes} />
        <PrivateRoute exact path="/dashboard" component={DashboardRoutes} />
        <PrivateRoute exact path="/account" component={AccountRoutes} />
        <Route path="/auth" component={AuthRoutes} />
        <Route exact path="/forgot-password" component={ForgotPassword} />
        {/* <Redirect to="/auth" from="/" /> */}
        {/* <Route path="/" component={AuthRoutes} /> */}
      </Switch>
      <Toasts />
    </Router>
  );
};

export default ApplicationRoutes;
