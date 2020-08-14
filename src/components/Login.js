import React, { useCallback, useContext, useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { Redirect, withRouter } from "react-router-dom";
import { Link as MaterialLink } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { Alert, AlertTitle } from "@material-ui/lab";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Logo from "./Logo";
import { AuthContext } from "../Auth";
import firebase from "../firebase";
import { getUserByName } from "../firebase/firebaseService";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = ({ history }) => {

  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault();
      const { username, password } = event.target.elements;
      try {
        let user;
        await getUserByName(username.value)
          .then(fetchedUser =>user =  fetchedUser);
          
        if(user == null) {
          throw Error("wrong username or password");
        }
        await firebase
          .auth()
          .signInWithEmailAndPassword(user.email, password.value);
        history.push("");
      } catch (error) {      
        setError(error);
      }
    },
    [history]
  );

  const classes = useStyles();
  const { currentUser } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const signUpUrl = `${process.env.PUBLIC_URL}/#/signup`;

  const clearError = ()=> {
    setError(null);
  }

  let alert = null;
  if(error) {
    alert = 
    <Alert severity="error">
        <AlertTitle>Login failed</AlertTitle>
        {error.message}
    </Alert>
  }

  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Logo />
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={handleLogin}>
          <TextField
            variant="outlined"
            onChange={() => clearError()}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            variant="outlined"
            onChange={() => clearError()}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Log In
          </Button>
          {alert}
          <Grid container justify="center">
            {/* <Grid item xs>
              <MaterialLink href="/reset-password" variant="body2">
                Forgot password?
              </MaterialLink>
            </Grid> */}
            <Grid item>
              <MaterialLink href={signUpUrl} variant="body2">
                {"Don't have an account? Sign Up"}
              </MaterialLink>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default withRouter(Login);

export const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <MaterialLink color="inherit" href="https://rgozdz.github.io/portfolio/">
        aware4dev
      </MaterialLink>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};
