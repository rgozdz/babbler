import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import NewReleasesIcon from "@material-ui/icons/NewReleases";
import HistoryIcon from '@material-ui/icons/History';
import { useTheme } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { AuthContext } from "../Auth";

function ResponsiveDrawer(props) {
  const { window, mobileOpen, classes } = props;
  const theme = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { currentUser } = useContext(AuthContext);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const menuTabs = 
  [
    { text: "Daily task", path: "/", icon: <NewReleasesIcon /> },
    {
      text: "Task history",
      path: "/history",
      icon: <HistoryIcon />,
    }
  ];

  //need to check if user has admin role
  if(currentUser.uid === 'H0fbyudV3gfTG4221PfYK1Gg9zC3') {
    menuTabs.push({
      text: "Task managment",
      path: "/add-task",
      icon: <PlaylistAddIcon />,
    })
  }

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        {
          menuTabs.map((item, index) => (
          <Link to={item.path} key={item.text} className={classes.link}>
            <ListItem
              button
              selected={selectedIndex === index}
              onClick={(event) => handleListItemClick(event, index)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          </Link>
        ))}
      </List>
      {/* <Divider /> */}
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <nav className={classes.drawer} aria-label="mailbox folders">
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Hidden smUp implementation="css">
        <Drawer
          container={container}
          variant="temporary"
          anchor={theme.direction === "rtl" ? "right" : "left"}
          open={mobileOpen}
          onClose={props.handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
