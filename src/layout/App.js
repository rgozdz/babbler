import React from "react";
import "../App.scss";
import Home from "../components/Home";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import ResetPassword from "../components/ResetPassword";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "../PrivateRoute";
import { AuthProvider } from "../Auth";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/reset-password" component={ResetPassword} />
          <PrivateRoute path="/" component={Home} />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;
