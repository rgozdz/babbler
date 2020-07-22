import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import IconButton from "@material-ui/core/IconButton";
import {deleteWord} from "../firebase/firebaseService";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import DeleteTaskDialog from "./DeleteTaskDialog";

const useStyles = makeStyles((theme) =>  ({
  table: {
    minWidth: 300,
  },
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  }
  })
);

export default function TaskTable({words, updateTasksTab}) {
  const classes = useStyles();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);


  const handleClickOpen = (word) => {
    setSelectedWord(word);
    setOpenDeleteDialog(true);
  };

  const handleClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleShowNotification = () => {
    setShowNotification(true);
  };

  const handleDelete = () => {
    deleteWord(selectedWord.uid)
      .finally(() => {
        updateTasksTab();
        handleClose();
        handleShowNotification();
      })
  }

  const handleCloseNotify = (reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowNotification(false);
  };

  const getTimeStamp = (date) => {
   const rawDate = new Date(date);
   console.log(rawDate.getTime())
    return rawDate.getTime();
}

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

    return (
      <div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Word</TableCell>
              <TableCell align="right">Types</TableCell>
              <TableCell align="right">Data</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {words? words.map((row) => (
              <TableRow key={row.uid}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.types}</TableCell>
                <TableCell align="right">{row.date}</TableCell>
                <TableCell align="right">
                  {getTimeStamp(row.date) > getTimeStamp(new Date())?
                  <>
                  <IconButton aria-label="edit">
                    <EditOutlinedIcon />
                  </IconButton>
                  <IconButton aria-label="delete" onClick={() => handleClickOpen(row)}>
                    <DeleteOutlinedIcon />
                  </IconButton></> : null }
                  
                </TableCell>
              </TableRow>
            )): null}
          </TableBody>
        </Table>
      </TableContainer>

      <DeleteTaskDialog
        selectedWord={selectedWord} 
        openDeleteDialog={openDeleteDialog} 
        handleClose={() => handleClose()} 
        handleDelete={() => handleDelete()}>
      </DeleteTaskDialog>

      <Snackbar open={showNotification} autoHideDuration={6000} onClose={handleCloseNotify}>
        <Alert onClose={handleCloseNotify} severity="warning">
          Task was deleted!
        </Alert>
      </Snackbar>
      </div>
    );
}
