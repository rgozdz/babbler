import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";
import Page from "../layout/Page";
import { makeStyles } from "@material-ui/core/styles";

const Home = () => {
  const drawerWidth = 240;

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
    },
    drawer: {
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      [theme.breakpoints.up("sm")]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    menuButton: {
      marginLeft: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        display: "none",
      },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    link: {
      textDecoration: "none",
      color: "inherit",
    },
    menu: {
      marginLeft: `calc(105% - ${drawerWidth}px)`,
    },
    logo: {
      position: "relative",
      left: "50%",
      top: "50%",
      transform: "translate(-50%,10%)",
    },
  }));

  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Navbar
        classes={classes}
        handleDrawerToggle={handleDrawerToggle}
      ></Navbar>
      <Sidebar
        classes={classes}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      ></Sidebar>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Page></Page>
      </main>
    </div>
  );
};

export default Home;
