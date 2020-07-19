import React from "react";
import "../App.scss";
import Home from "../components/Home";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import { HashRouter, Route, Switch } from "react-router-dom";
import { MuiThemeProvider } from "@material-ui/core/styles";
import PrivateRoute from "../PrivateRoute";
import { AuthProvider } from "../Auth";
import theme from "./Theme";

const App = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <AuthProvider>
        <HashRouter basename="/">
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={SignUp} />
            {/* <Route exact path="/reset-password" component={ResetPassword} /> */}
            <PrivateRoute path="/" component={Home} />
          </Switch>
        </HashRouter>
      </AuthProvider>
    </MuiThemeProvider>
  );
};

export default App;
