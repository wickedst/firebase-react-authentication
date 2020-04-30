import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import Spinner from "react-bootstrap/Spinner";

const LoggedInRoute = ({ component: RouteComponent, ...rest }) => {
  const { authenticated, loadingAuthState } = useContext(AuthContext);

  if (loadingAuthState) {
    return (
      <div
        className="position-absolute d-flex w-100 h-100 align-items-center justify-content-center"
        style={{ top: 0 }}
      >
        <Spinner animation="grow" variant="primary" />
      </div>
    );
  }

  return (
    <Route
      {...rest}
      render={(routeProps) =>
        !authenticated ? (
          <RouteComponent {...routeProps} />
        ) : (
          <Redirect
            to={{ pathname: "/dashboard", state: { prevPath: rest.path } }}
          />
        )
      }
    />
  );
};

export default LoggedInRoute;
