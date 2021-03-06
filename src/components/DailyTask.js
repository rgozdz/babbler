import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import firebase from "../firebase";
import { AuthContext } from "../Auth";
import { Alert, AlertTitle } from "@material-ui/lab";
import { getDailyWord } from "../firebase/firebaseService";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
  sentense: {
    opacity: 0.6,
  },
  wordName: {
    fontSize: "1.5em",
    fontWeight: "bolder",
  },
  wordType: {
    fontStyle: "italic",
  },
}));

function getSteps() {
  return [
    "Word introduction",
    "Write yourselfe",
    "Write again",
    "And the last time",
  ];
}

export default function DailyTask() {
  const classes = useStyles();
  const [word, setWord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    getDailyWord(currentUser)
      .then((dailyWord) => setWord(dailyWord))
      .finally(() => setIsLoading(false));
  });

  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleDisabled = () => {
    const input = document.querySelector("#standard-basic");
    if (input.value.trim() === word.name) {
      setIsNextDisabled(false);
    } else {
      setIsNextDisabled(true);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);

    if (activeStep === steps.length - 1) {
      handleCompletedTask(word.uid, currentUser.uid);
    } else {
      setIsNextDisabled(true);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleCompletedTask = (wordUid, userUid) => {
    const id = firebase.database().ref().child("completedTasks").push().key;
    firebase.database().ref(`completedTasks/${id}`).set({
      wordUid,
      userUid,
      date: Date.now(),
    });
  };

  function getStepContent(step, word) {
    switch (step) {
      case 0:
        return (
          <>
            <span className={classes.wordName}>{word.name}</span><br />
            <span className={classes.wordType}>{word.types}</span><br /><br />
            <span className={classes.sentense}>{word.sentence}</span>
          </>
        );
      case 1:
        return "Write again";
      case 2:
        return `Just to remember`;
      case 3:
        return `Last time, promiss`;
      default:
        return "Unknown step";
    }
  }

  if (word && !isLoading) {
    return (
      <div className={classes.root}>
        <Paper elevation={3}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  <Typography>{getStepContent(index, word)}</Typography>
                  <div className={classes.actionsContainer}>
                    <div>
                      <TextField
                        id="standard-basic"
                        label="write here"
                        onChange={handleDisabled}
                      />
                      <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        className={classes.button}
                      >
                        Back
                      </Button>
                      <Button
                        disabled={isNextDisabled}
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        className={classes.button}
                      >
                        {activeStep === steps.length - 1 ? "Finish" : "Next"}
                      </Button>
                    </div>
                  </div>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Paper>
        {activeStep === steps.length && (
          <Paper square elevation={0} className={classes.resetContainer}>
            <Typography>All steps completed - you&apos;re finished</Typography>
          </Paper>
        )}
      </div>
    );
  }

  if (isLoading) {
    return <CircularProgress color="secondary" />;
  }

  return (
    <Alert severity="success">
      <AlertTitle>Success</AlertTitle>
      All done for today!!!
    </Alert>
  );
}
