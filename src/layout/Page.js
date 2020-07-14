import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import DailyTask from "../components/DailyTask";
import TaskManagement from "../components/TaskManagement";

const Page = () => {
  return (
    <Switch>
      <Route exact path="/">
        <DailyTask />
      </Route>
      <Route path="/add-task">
        <TaskManagement />
      </Route>
    </Switch>
  );
};

export default Page;
