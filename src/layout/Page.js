import React from "react";
import { Switch, Route } from "react-router-dom";
import DailyTask from "../components/DailyTask";
import TaskManagement from "../components/TaskManagement";
import HistoryTable from "../components/HistoryTable";

const Page = () => {
  return (
    <Switch>
      <Route exact path="/">
        <DailyTask />
      </Route>
      <Route path="/add-task">
        <TaskManagement />
      </Route>
      <Route path="/history">
        <HistoryTable />
      </Route>
    </Switch>
  );
};

export default Page;
