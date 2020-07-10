import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import DailyTask from "../components/DailyTask";
import AddTask from "../components/AddTask";

const Page = () => {
  return (
    <Switch>
      <Route  exact path="/">
        <DailyTask />
      </Route>
      <Route path="/add-task">
        <AddTask />
      </Route>
    </Switch>
  );
};

export default Page;
