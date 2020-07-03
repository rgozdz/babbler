import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./Auth";
import CircularProgress from '@material-ui/core/CircularProgress';

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const { currentUser, isLoading } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(routeProps) => {
        if(!!currentUser && !isLoading) {
          return <RouteComponent {...routeProps} />
        } else if(isLoading) {
          return <CircularProgress color="secondary" />
        } else {
          console.log(isLoading);
          return <Redirect to={"/login"} />
        }
      }}
    />
  );
};

export default PrivateRoute;
