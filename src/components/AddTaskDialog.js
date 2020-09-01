import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";
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
import { getFirstFreeDate, isDateValid, isNameValid } from "../firebase/firebaseService";
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
  datePicker: {
    margin: theme.spacing(1),
    minWidth: 100,
  },
  typeSelect: {
    margin: theme.spacing(3),
    marginLeft: theme.spacing(1),
    minWidth: 240,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  }
}));

const AddTaskDialog = ({ isOpen, handleCloseDialog, updateTasksTab, word }) => {

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);

  const { handleSubmit, register, errors, clearErrors, setValue, watch } = useForm({
    mode: "onChange"
  });

  const WORD_NAME = "wordName";
  const DATE_PICKER = "datePicker";
  const SENTENCE = "exampleSentence";
  const WORD_TYPE = "wordType";

  const names = ["noun", "verb", "adjective"];
  const { wordName, datePicker, wordType, exampleSentence } = watch();

  useEffect(() => {
    formRegister();
    resetForm();
    if (!!word) {
      setSelectedWord(word);
      setFormData(word);
    } else {
      getFirstFreeDate().then(data => setValue(DATE_PICKER, data));
      setSelectedWord(null);
    }
    setOpen(isOpen);

  }, [isOpen, word]);

  const handleAddTask = async (data) => {
    const {
      wordName,
      datePicker,
      wordType,
      exampleSentence,
    } = data;
    try {
      writeTaskData(
        wordName,
        wordType,
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
    date.setDate(date.getDate() + 1);

    return date;
  }

  const formRegister = () => {
    [WORD_NAME, DATE_PICKER, WORD_TYPE, SENTENCE]
      .forEach((inputName) => register(inputName))
  }

  const handleClose = () => {
    setOpen(false);
    clearErrors();
    handleCloseDialog();
  };

  const setFormData = (word) => {
    setValue(WORD_NAME, word.name);
    setValue(DATE_PICKER, word.date);
    setValue(WORD_TYPE, word.types);
    setValue(SENTENCE, word.sentence);
  }

  const resetForm = () => {
    [WORD_NAME, WORD_TYPE, SENTENCE].forEach((inputName) => setValue(inputName, ""));
  }

  const handleChange = (event) => {
    setValue(event.target.name, event.target.value);
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
          <DialogTitle id="alert-dialog-title">{(selectedWord ? `Edit ${selectedWord.name}` : "Add new word")}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  autoComplete="wordName"
                  name="wordName"
                  value={wordName}
                  onChange={handleChange}
                  variant="outlined"
                  inputRef={
                    register({
                      required: 'Word name is required',
                      minLength: {
                        value: 3,
                        message: 'Word name should be longer than 2 characters'
                      },
                      validate: value => isNameValid(value, selectedWord)
                    })
                  }
                  helperText={errors.wordName?.type === 'validate' ? 'Word name already used' :
                    errors.wordName ? errors.wordName.message : ''}
                  error={errors.wordName ? true : false}
                  fullWidth
                  label="Word name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl className={classes.datePicker}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      margin="normal"
                      id="date-picker-dialog"
                      label="Word for day"
                      format="yyyy-MM-dd"
                      value={datePicker}
                      name="datePicker"
                      onChange={handleChange}
                      minDate={tomorrow()}
                      inputRef={
                        register({
                          required: 'Date is required',
                          validate: value => isDateValid(value, selectedWord?.date),
                        })
                      }
                      helperText={errors.datePicker?.type === 'validate' ? 'Date already was used' :
                        errors.datePicker ? errors.datePicker.message : ''}
                      error={errors.datePicker ? true : false}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl className={classes.typeSelect}>
                  <InputLabel htmlFor="type-native-simple">Type</InputLabel>
                  <Select
                    native
                    name="wordType"
                    id="type-native-simple"
                    value={wordType}
                    required
                    onChange={handleChange}
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
                  value={exampleSentence}
                  onChange={handleChange}
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
                  error={errors.exampleSentence ? true : false}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleClose()} color="primary">
              Dismiss
          </Button>
            <Button type="submit" color="primary" autoFocus>
              {(selectedWord ? "Edit" : "Create")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar open={showNotification} autoHideDuration={6000} onClose={handleCloseNotify}>
        <Alert onClose={handleCloseNotify} severity="success">
          Task was {(selectedWord ? "edited" : "created")}!
      </Alert>
      </Snackbar>
    </div>
  );
};

export default withRouter(AddTaskDialog);
