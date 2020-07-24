import React, { useCallback, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
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
import { setDate } from "date-fns";

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
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const AddTaskDialog = ({ isOpen, handleCloseDialog, updateTasksTab, word }) => {
  
  const classes = useStyles();
  const theme = useTheme();
  
  const [name, setName] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [typeNames, setTypeNames] = useState([]);
  const [sentence, setSentence] = useState("");
  const [open, setOpen] = React.useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);

  useEffect(() => {
    setSelectedWord(word);
    if(word) {
      setFormData(word);
    }
    setOpen(isOpen);
    
  }, [isOpen, word]);

  const handleAddTask = async (event) => {
    event.preventDefault();
    const {
      wordName,
      datePicker,
      wordTypes,
      exampleSentence,
    } = event.target.elements;
    try {
      
      writeTaskData(
        wordName.value,
        wordTypes.value.toString(),
        datePicker.value,
        exampleSentence.value
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

  const handleClose = () => {
    setOpen(false);
    resetForm();
    handleCloseDialog();
  };

  const setFormData = (word) => {
    setName(word.name);
    setSelectedDate(word.date);
    setTypeNames(word.types.split(','));
    setSentence(word.sentence);
  }
  const resetForm = () => {
    setName("");
    setTypeNames([]);
    setSelectedDate(new Date());
    setSentence("");
  }

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTypeNamesChange = (event) => {
    setTypeNames(event.target.value);
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

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

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
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <form className={classes.form} onSubmit={handleAddTask}>
        <DialogTitle id="alert-dialog-title">{"Add new word"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="wordName"
                name="wordName"
                value={name}
                onChange={handleNameChange}
                variant="outlined"
                required
                fullWidth
                id="wordName"
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
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel
                className={classes.chipLabel}
                id="demo-mutiple-chip-label"
              >
                Types
              </InputLabel>
              <Select
                labelId="demo-mutiple-chip-label"
                id="demo-mutiple-chip"
                multiple
                value={typeNames}
                name="wordTypes"
                onChange={handleTypeNamesChange}
                input={<Input id="select-multiple-chip" />}
                renderValue={(selected) => (
                  <div className={classes.chips}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={value}
                        className={classes.chip}
                      />
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {names.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, typeNames, theme)}
                  >
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                value={sentence}
                onChange={handleSentenceChange}
                name="exampleSentence"
                label="Sentence"
                id="sentence"
                autoComplete="sentence"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Dismiss
          </Button>
          <Button type="submit" color="primary" autoFocus>
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>

      <Snackbar open={showNotification} autoHideDuration={6000} onClose={handleCloseNotify}>
      <Alert onClose={handleCloseNotify} severity="success">
        Task was created!
      </Alert>
    </Snackbar>
    </div>

  );
};

export default withRouter(AddTaskDialog);
