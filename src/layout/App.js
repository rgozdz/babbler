import React, { useState, useEffect } from 'react';
import '../App.scss';
import Sidebar from './Sidebar'
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import ResetPassword from '../components/ResetPassword';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return(
    <Router>
        <Switch>
          <Route path="/sign-in">
            <SignIn />
          </Route>
          <Route path="/sign-up">
            <SignUp />
          </Route>
          <Route path="/reset-password">
            <ResetPassword />
          </Route>
          <Route path="/">
            <Sidebar />
          </Route>
        </Switch>
    </Router>
  )
    // if(isLoggedIn){
    //   return <Sidebar/>
    // }
    // else {
    //   return <SignIn/>
    // }
  }

export default App;
