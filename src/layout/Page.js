import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import DailyTask from "../components/DailyTask";

const Page = () => {
  return (
    <Switch>
      <Route path="/">
        <DailyTask />
      </Route>
    </Switch>
  );
};

export default Page;
