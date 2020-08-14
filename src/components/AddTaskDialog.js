import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import firebase from "../firebase";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useEffect } from "react";
import Slide from '@material-ui/core/Slide';
import { getFirstFreeDate, isDateAlreadyUsed, isNameAlreadyUsed } from "../firebase/firebaseService";
import FormControl from '@material-ui/core/FormControl';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
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
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  chipLabel: {
    marginTop: 16,
  },
  fab: {
    margin: theme.spacing(2),
  },
  absolute: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
  formControl: {
    margin: theme.spacing(2),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  }
}));

const AddTaskDialog = ({ isOpen, handleCloseDialog, updateTasksTab, word }) => {
  
  const classes = useStyles();
  const theme = useTheme();
  
  const { handleSubmit, register, errors } = useForm();
  const [name, setName] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [typeName, setTypeName] = useState("");
  const [sentence, setSentence] = useState("");
  const [open, setOpen] = React.useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);

  useEffect(() => {
    resetForm();
    if(!!word) {
      setSelectedWord(word);
      setFormData(word);
    } else {
      getFirstFreeDate().then(data =>setSelectedDate(data));
    }
    setOpen(isOpen);
    
  }, [isOpen, word]);

  const handleAddTask = async (data) => {
    const {
      wordName,
      datePicker,
      wordTypes,
      exampleSentence,
    } = data;
    try {
      
      writeTaskData(
        wordName,
        wordTypes.toString(),
        datePicker,
        exampleSentence
      );
      setOpen(false);
      updateTasksTab();
      resetForm();
      handleCloseDialog();
      handleShowNotification();

    } catch (error) {
      alert(error);
    }
  };

  async function writeTaskData(name, types, date, sentence) {
    const id = selectedWord
      ? selectedWord.uid 
      : firebase.database().ref().child("words").push().key;
  
    await firebase
      .database()
      .ref(`words/${id}`)
      .set({ name, types, date, sentence });
  }

  const tomorrow = () => {
    let date = new Date();
    date.setDate(date.getDate() +1);

    return date;
  }

  const handleClose = () => {
    setOpen(false);
    setSelectedWord(null);
    handleCloseDialog();
  };

  const setFormData = (word) => {
    setName(word.name);
    setSelectedDate(word.date);
    setTypeName(word.types);
    setSentence(word.sentence);
  }
  const resetForm = () => {
    setName("");
    setTypeName("");
    setSentence("");
  }

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTypeNamesChange = (event) => {
    setTypeName(event.target.value);
  };

  const handleSentenceChange = (event) => {
    setSentence(event.target.value);
  };

  const handleShowNotification = () => {
    setShowNotification(true);
  };

  const handleCloseNotify = (reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowNotification(false);
  };

  const names = ["noun", "verb", "adjective"];

  function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  return (
    <div>
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      keepMounted
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <form className={classes.form} onSubmit={handleSubmit(handleAddTask)}>
        <DialogTitle id="alert-dialog-title">{(selectedWord? `Edit ${selectedWord.name}` : "Add new word")}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                autoComplete="wordName"
                name="wordName"
                value={name}
                onChange={handleNameChange}
                variant="outlined"
                inputRef={
                  register({ 
                    required: 'Word name is required', 
                    minLength: {
                      value: 3,
                      message: 'Word name should be longer than 2 characters'
                    },
                    validate: value => (!!selectedWord || isNameAlreadyUsed(value))
                  })
                }
                helperText={errors.wordName?.type === 'validate'? 'Word name already used': 
                  errors.wordName ? errors.wordName.message : ''}
                error={ errors.wordName ? true : false }
                fullWidth
                label="Word name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  margin="normal"
                  id="date-picker-dialog"
                  label="Word for day"
                  format="yyyy-MM-dd"
                  value={selectedDate}
                  name="datePicker"
                  onChange={handleDateChange}
                  minDate = {tomorrow()}
                  inputRef={
                    register({ 
                      required: 'Date is required', 
                      validate: value => (!!selectedWord ||isDateAlreadyUsed(value)), 
                    })
                  }
                  helperText={errors.datePicker?.type === 'validate'? 'Date already was used': 
                    errors.datePicker ? errors.datePicker.message : ''}
                  error={errors.datePicker ? true : false }
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}              
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="type-native-simple">Type</InputLabel>
                <Select
                  native
                  name="wordTypes"
                  id="type-native-simple"
                  value={typeName}
                  required
                  onChange={handleTypeNamesChange}
                  inputRef={
                    register({ 
                      required: 'Type is required' 
                    })
                  }
                >
                  <option></option>
                  {names.map((name) => (
                  <option
                    key={name}
                    value={name}
                    style={getStyles(name, typeName, theme)}
                  >
                    {name}
                  </option>
                ))}
                </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="exampleSentence"
                value={sentence}
                onChange={handleSentenceChange}
                label="Sentence"
                id="sentence"
                autoComplete="sentence"
                inputRef={
                  register({ 
                    required: 'Sentence name is required', 
                    minLength: {
                      value: 15,
                      message: 'Sentence should be longer than 15 characters'
                    }
                  })
                }
                helperText={errors.exampleSentence ? errors.exampleSentence.message : ''}
                error={errors.exampleSentence ? true : false }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() =>handleClose()} color="primary">
            Dismiss
          </Button>
          <Button type="submit" color="primary" autoFocus>
          {(selectedWord? "Edit" : "Create")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>

      <Snackbar open={showNotification} autoHideDuration={6000} onClose={handleCloseNotify}>
      <Alert onClose={handleCloseNotify} severity="success">
          Task was {(selectedWord? "edited" : "created")}!
      </Alert>
    </Snackbar>
    </div>

  );
};

export default withRouter(AddTaskDialog);
