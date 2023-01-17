import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Tooltip
} from "@material-ui/core";
import FlightTakeoffIcon from "@material-ui/icons/FlightTakeoff";
import RssFeedIcon from "@material-ui/icons/RssFeed";
import "./NavigationBar.css";
import { useHistory, useLocation } from "react-router-dom";

export const NavigationBar = ({ connected }) => {
  const history = useHistory();
  const location = useLocation();
  const logout = () => {
    window.sessionStorage.removeItem('jwt');
    history.push("/");
    console.log("logout callback");
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <FlightTakeoffIcon fontSize="large" />
        <Typography variant="h6" className="heading-web">
          Avion MRO + Hyperledger Fabric
        </Typography>
        <Typography variant="h6" className="heading-mobile">
          Avion MRO
        </Typography>
        <Box px={2}>
          {location.pathname === "/aircraft" && (
            <Button color="inherit" onClick={logout}>
              Deconnecter
            </Button>
          )}
        </Box>
        <Tooltip title={connected ? "Réseau connecté" : "Non connecté"}>
          <RssFeedIcon color={connected ? "inherit" : "secondary"} />
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
