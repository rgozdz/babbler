import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { Link as MaterialLink } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { withRouter } from "react-router-dom";
import firebase from "../firebase";
import Logo from "./Logo";
import { Copyright } from "./Login";
import {isUsernamValid, isEmailValid, createUser } from "../firebase/firebaseService";

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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const SignUp = ({history}) => {

  const { handleSubmit, register, errors, setValue, watch } = useForm({
    mode: "onChange"
  });

  const formRegister = () => {
    ["firstName", "lastName","username", "email", "password"]
      .forEach((inputName) => register(inputName) )
  }

  const { firstName, lastName, username, email, password } = watch();

  useEffect(()=> {
    formRegister();
  },[])

  const handleSignUp =  async (data) => {

    const { firstName, lastName, username, email, password } = data;
    
    try {
      
      await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password).then(({user}) => {

          createUser(user.uid, firstName, lastName, email, username).then(() => {
            user.sendEmailVerification().then(() => {
              console.log('email sent')
            }).catch(function(error) {
              alert(error)
            });
  
            firebase
            .auth()
            .signOut()
              .then(()=> history.push(''));
          })
        })
      
    } catch (error) {
      alert(error);
    }
  };
  
  const classes = useStyles();
  const loginUrl = `${process.env.PUBLIC_URL}/#/login`;

  const handleChange = (event) => {
    setValue(event.target.name, event.target.value);
  };

  const isFormInvalid = () => {
    const isErrorsEmpty = Object.keys(errors).length === 0 && errors.constructor === Object;
    return !isErrorsEmpty;
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Logo />
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit(handleSignUp)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                value={firstName || ''}
                onChange={handleChange}
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                inputRef={
                  register({
                    required: 'First name is required',
                    minLength: {
                      value: 3,
                      message: 'First name should be longer than 2 characters'
                    }
                  })
                }
                helperText={errors.firstName ? errors.firstName.message : ''}
                error={errors.firstName ? true : false}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                onChange={handleChange}
                value={lastName|| ''}
                autoComplete="lname"
                inputRef={
                  register({
                    required: 'Last name is required',
                    minLength: {
                      value: 3,
                      message: 'Last name should be longer than 2 characters'
                    }
                  })
                }
                helperText={errors.lastName ? errors.lastName.message : ''}
                error={errors.lastName ? true : false}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                onChange={handleChange}
                value={username|| ''}
                autoComplete="username"
                inputRef={
                  register({
                    required: 'Username is required',
                    minLength: {
                      value: 3,
                      message: 'Username should be longer than 2 characters'
                    },
                    validate: value => isUsernamValid(value)
                  })
                }
                helperText={errors.username?.type === 'validate' ? 'Username already used' :
                  errors.username ? errors.username.message : ''}
                error={errors.username ? true : false}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={email|| ''}
                onChange={handleChange}
                autoComplete="email"
                inputRef={
                  register({
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "invalid email address"
                    },
                    validate: value => isEmailValid(value)
                  })
                }
                helperText={errors.email?.type === 'validate' ? 'Email already used' :
                  errors.email ? errors.email.message : ''}
                error={errors.email ? true : false}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                value={password|| ''}
                onChange={handleChange}
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                inputRef={
                  register({
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password should be longer than 5 characters'
                    }
                  })
                }
                helperText={errors.password ? errors.password.message : ''}
                error={errors.password ? true : false}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            disabled={isFormInvalid()}
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="center">
            <Grid item>
              <MaterialLink href={loginUrl} variant="body2">
                Already have an account? Sign in
              </MaterialLink>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default withRouter(SignUp);
