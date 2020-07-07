import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./Auth";
import { LinearProgress } from '@material-ui/core';

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const { currentUser, isLoading } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(routeProps) => {
        if(!!currentUser && !isLoading) {
          return <RouteComponent {...routeProps} />
        } else if(isLoading) {
          return <LinearProgress />
        } else {
          return <Redirect to={"/login"} />
        }
      }}
    />
  );
};

export default PrivateRoute;
