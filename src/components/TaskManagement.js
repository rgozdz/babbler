import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import TaskTable from "./TasksTable";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import AddTaskDialog from "./AddTaskDialog";

const useStyles = makeStyles((theme) => ({
  absolute: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
}));

const TaskManagement = () => {
  const classes = useStyles();
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  return (
    <div>
      <AddTaskDialog isOpen={openDialog}></AddTaskDialog>
      <TaskTable></TaskTable>
      <Tooltip title="Add" aria-label="add">
        <Fab
          color="secondary"
          className={classes.absolute}
          onClick={handleClickOpen}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </div>
  );
};

export default withRouter(TaskManagement);
