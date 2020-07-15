import React, { useState, useEffect, useContext } from "react";
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
import { AuthContext } from "../Auth";

const useStyles = makeStyles({
  table: {
    minWidth: 300,
  },
});

export default function HistoryTable() {
  const classes = useStyles();
  const [words, setWords] = useState(null);
  const { currentUser } = useContext(AuthContext);
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

          return wordList;
        }
      }).then((wordList) => {
        if (wordList) {
          firebase
            .database()
            .ref("/completedTasks/")
            .once("value")
            .then((snapshot) => {
              const completedTaskList = snapshot.val();
              if (completedTaskList) {
                const allCompletedTasks = Object.keys(completedTaskList).map(
                  (key) => ({
                    ...completedTaskList[key],
                    uid: key,
                  })
                );

                console.log(wordList);
                const completedTasks = wordList.filter(
                  (task) =>
                    isCompleted(allCompletedTasks, task.uid)
                );

                setWords(completedTasks);

            }})
        }}).finally(() => setIsLoading(false));
  }, []);

  const isCompleted = (allCompletedTasks, taskUid) =>{
    const completedTask = allCompletedTasks
    .find(element => element.wordUid === taskUid && currentUser.uid === element.userUid);

    return !!completedTask;
  }

  if (!isLoading) {
    return (
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Word</TableCell>
              <TableCell align="right">Types</TableCell>
              <TableCell align="right">Example sentence</TableCell>
              <TableCell align="right">Data</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {words? words.map((row) => (
              <TableRow key={row.uid}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.types}</TableCell>
                <TableCell align="right">{row.sentence}</TableCell>
                <TableCell align="right">{row.date}</TableCell>
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
