import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { AuthContext } from "../Auth";
import { getUserTasksHistory }  from "../firebase/firebaseService";

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
    getUserTasksHistory(currentUser)
      .then(userTasks => setWords(userTasks))
      .finally(() => setIsLoading(false));
  }, []);

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
