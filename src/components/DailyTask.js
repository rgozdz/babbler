import React, {useState, useEffect, useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import firebase from "../firebase";
import { AuthContext } from "../Auth";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
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
}));

function getSteps() {
  return ['Word introduction', 'Write yourselfe', 'Write again', 'And the last time'];
}

function getStepContent(step, word) {
  switch (step) {
    case 0:
      return `${word.name} - ${word.type} Example sentense: ${word.sentense}`;
    case 1:
      return 'Write again';
    case 2:
      return `Just to remember`;
    case 3:
      return `Last time, promiss`;
    default:
      return 'Unknown step';
  }
}

function isToday(element) {
  let date = new Date();
  const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' }) 
  const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat .formatToParts(date);
  const today = `${day}-${month}-${year}`;

  return element.date === today;
}

export default function DailyTask() {
  const classes = useStyles();
  const [word, setWord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    firebase.database().ref('/words/').once('value')
    .then(snapshot => {
      const words = snapshot.val();
      
      if (words) {
        const todayWord = Object.keys(words).map(key => ({
          ...words[key],
          uid: key,
        })).find(isToday);

        return todayWord; 
      }
      })
      .then(todayWord => {
        if(todayWord){
          firebase.database().ref('/completedTasks/').once('value')
          .then((snapshot) => {
            const completedTaskList = snapshot.val();
            if (completedTaskList) {
              const completedTasks = Object.keys(completedTaskList).map(key => ({
                ...completedTaskList[key],
                uid: key,
              }));
          
              console.log(todayWord);
              const completedTask = completedTasks.
                find(task => task.userUid === currentUser.uid && task.wordUid === todayWord.uid);
          
                if(!completedTask){
                  setWord(todayWord);
                  setIsLoading(false);
                }
  
            } else {
              setWord(todayWord);
              setIsLoading(false);
            }
          });
        }
      });      
  },[]);
  
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleDisabled = () => {
    const input = document.querySelector('#standard-basic');
    if(input.value === word.name) {
      setIsNextDisabled(false);
    }
  }
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    
    if(activeStep === steps.length - 1) {
      handleCompletedTask(word.uid, currentUser.uid);
    } else {
      setIsNextDisabled(true);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleCompletedTask = (wordUid, userUid) => {
    const id = firebase.database().ref()
      .child('completedTasks').push().key;
    firebase.database().ref(`completedTasks/${id}`).set({
      wordUid,
      userUid,
      date: Date.now()
    });
  }
  
  if(word && !isLoading){
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
                    <TextField id="standard-basic" 
                      label="write here" 
                      onChange={handleDisabled} />
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
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
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

  if(isLoading) {
    return <CircularProgress color="secondary" />
  }

  return(
    <Typography variant="h2" component="h2">
        All done for today!!!
    </Typography>
  );

}