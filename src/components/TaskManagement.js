import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import TaskTable from "./TasksTable";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tooltip from "@material-ui/core/Tooltip";
import AddTaskDialog from "./AddTaskDialog";
import {getAllWords} from "../firebase/firebaseService";

const useStyles = makeStyles((theme) => ({
  fixed: {
    position: "fixed",
    bottom: theme.spacing(2)
  },
}));

const TaskManagement = () => {
  const classes = useStyles();
  const [words, setWords] = useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWord, setSelectedWord] = useState(null);

  useEffect(() => {
    getAllWords()
    .then(words => setWords(words))
      .finally(() => setIsLoading(false));
  }, []);
  

  const updateTasksTab = () => {
    getAllWords()
    .then(words => setWords(words));
  }

  const handleClickOpen = (word) => {
    setSelectedWord(word);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div>
      {isLoading? 
      <CircularProgress color="secondary" />: 
      <TaskTable words={words} handleOpenEditTask={(selectedWord) =>handleClickOpen(selectedWord) } updateTasksTab={() => updateTasksTab()}></TaskTable>
      }

      <Tooltip title="Add" aria-label="add">
        <Fab
          color="secondary"
          className={classes.fixed}
          onClick={() => handleClickOpen()}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      <AddTaskDialog 
        isOpen={openDialog}
        word={selectedWord}
        updateTasksTab={() => updateTasksTab()}
        handleCloseDialog={() => handleCloseDialog()}>
      </AddTaskDialog>
    </div>
  );
};

export default withRouter(TaskManagement);
