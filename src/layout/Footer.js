import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import versionTxt from "../version"

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary">
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/rgozdz/">
        aware4dev
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: "auto",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[200]
        : theme.palette.grey[800],
  },
}));

export default function Footer() {
  const classes = useStyles();
  const [version, setVersion ] = useState(null);

  useEffect(() => fetchVersion(), [])

  const fetchVersion = () => {
      fetch(versionTxt)
      .then(async response => {
        const text = await response.text();
        setVersion(text);
      });
  }

  return (
    <footer className={classes.footer}>
      <Container maxWidth="sm">
        <Typography variant="caption">
          Babbler ver. <br/> {version}
        </Typography>
        <Copyright />
      </Container>
    </footer>
  );
}
