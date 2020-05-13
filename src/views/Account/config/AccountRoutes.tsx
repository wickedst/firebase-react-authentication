import React from "react";
import { Route, Switch } from "react-router-dom";
import { Account } from "../components";

export const AccountRoutes = () => {
  return (
    <Switch>
      <Route path="/account" component={Account} />
      {/* <Route path="/account/privacy" component={Privacy} /> */}
      {/* <Route path="/account/notifications" component={Notifications} /> */}
    </Switch>
  );
};
