import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import firebase from "../firebase";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles({
  table: {
    minWidth: 300,
  },
});

export default function TaskTable({isFormSubmited}) {
  const classes = useStyles();
  const [words, setWords] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    firebase
      .database()
      .ref("/words/")
      .once("value")
      .then((snapshot) => {

        const words = snapshot.val();
        if (words) {
          const wordList = Object.keys(words).map((key) => ({
            ...words[key],
            uid: key
          }));

          setWords(wordList);
        }    
      })
      .finally(() => setIsLoading(false));
  }, [isFormSubmited]);

  if (!isLoading) {
    return (
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
                  <IconButton aria-label="edit">
                    <EditOutlinedIcon />
                  </IconButton>
                  <IconButton aria-label="delete">
                    <DeleteOutlinedIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            )): null}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (isLoading) {
    return <CircularProgress color="secondary" />;
  }
}
