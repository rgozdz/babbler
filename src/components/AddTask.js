import React, { useCallback, useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import Grid from "@material-ui/core/Grid";
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { withRouter } from "react-router-dom";
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
  } from '@material-ui/pickers';
import firebase from "../firebase";

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
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  chipLabel: {
      marginTop: 16
  }
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

async function writeTaskData(name, types, date, sentense) {

    const id = firebase.database().ref()
        .child('words').push().key;

    await firebase.database().ref(`words/${id}`)
    .set({name, types, date, sentense});
}

const AddTask = ({ history }) => {
  const handleAddTask = useCallback(
    async (event) => {
      event.preventDefault();
      const {wordName, datePicker, wordTypes, exampleSentense} = event.target.elements;
      try {
        
        writeTaskData(wordName.value, wordTypes.value.toString(), datePicker.value, exampleSentense.value );
        history.push("");
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  const classes = useStyles();

  const [name, setName] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [typeNames, setTypeNames] = useState([]);
  const [sentense, setSentense] = useState("");

  const theme = useTheme();

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTypeNamesChange = (event) => {
    setTypeNames(event.target.value);
  };

  const handleSentenseChange = (event) => {
    setSentense(event.target.value);
  };

  const names = [
    'Noun',
    'Verb',
    'Adjective'
  ];

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

  function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
    };
    }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Add new word
        </Typography>
        <form className={classes.form} onSubmit={handleAddTask}>
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
                    format="dd-MM-yyyy"
                    value={selectedDate}
                    name="datePicker"
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
            </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
                <InputLabel className={classes.chipLabel} id="demo-mutiple-chip-label">Types</InputLabel>
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
                            <Chip key={value} label={value} className={classes.chip} />
                        ))}
                        </div>
                    )}
                    MenuProps={MenuProps}
                    >
                    {names.map((name) => (
                        <MenuItem key={name} value={name} style={getStyles(name, typeNames, theme)}>
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
                value={sentense}
                onChange={handleSentenseChange}
                name="exampleSentense"
                label="Sentense"
                id="sentense"
                autoComplete="sentense"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Create
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default withRouter(AddTask);
