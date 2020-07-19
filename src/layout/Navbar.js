import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Chip from "@material-ui/core/Chip";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import firebase from "../firebase";
import Avatar from "@material-ui/core/Avatar";
import FaceTwoToneIcon from "@material-ui/icons/FaceTwoTone";

const AppNavbar = ({ classes, handleDrawerToggle }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    firebase.auth().signOut();
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
        {process.env.NODE_ENV === "development" ? (
          <Chip
            clickable
            size="medium"
            color="secondary"
            label="Development version"
          />
        ) : null}

        <IconButton
          aria-label="delete"
          className={classes.menu}
          onClick={handleClick}
        >
          {/* <Avatar
            alt="Rafal"
            src="/broken-image.jpg"
          /> */}
          <FaceTwoToneIcon></FaceTwoToneIcon>
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default AppNavbar;
