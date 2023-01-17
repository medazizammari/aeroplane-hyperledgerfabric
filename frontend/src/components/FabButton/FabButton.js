import React from "react";
import { Fab, Box } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import SettingsIcon from "@material-ui/icons/Settings";
import BuildIcon from "@material-ui/icons/Build";
import UpdateIcon from "@material-ui/icons/Update";
import AirplanemodeActiveIcon from "@material-ui/icons/AirplanemodeActive";
import AirplanemodeInactiveIcon from "@material-ui/icons/AirplanemodeInactive";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import "./FabButton.css";

export const FabButton = ({ popUp, admin, setMenu }) => {
  const [toggle, setToggle] = React.useState(false);
  const [vis, setVis] = React.useState(false);
  let options = [];

  if (admin) {
    options = [
      { label: "Enregistrer un avion", label2: "Register Aircraft", icon: AirplanemodeActiveIcon },
      { label: "Assigner un responsable",label2: "Assign Maintainer", icon: PersonAddIcon },
      { label: "Vendre des avions", label2: "Sell Aircraft", icon: AirplanemodeInactiveIcon }
    ];
  } else {
    options = [
      { label: "Heures de mise à jour", label2:"Update Hours", icon: UpdateIcon },
      { label: "rapport d'Entretien", label2:"Report Maintenance" ,icon: BuildIcon },
      { label: "Nouvelle Piece", label2: "New Part", icon: SettingsIcon }
    ];
  }

  const closeHandle = event => {
    if (event.relatedTarget === null) {
      setToggle(false);
      setTimeout(() => setVis(false), 750);
    }
  };

  const openHandle = () => {
    if (!toggle) {
      setVis(true);
      setToggle(true);
    } else {
      closeHandle({ relatedTarget: null });
    }
  };
  return (
    <div className="fab" onBlur={closeHandle}>
      <div className={`options-container ${vis ? "visible" : ""}`}>
        {options.map((option, index) => {
          const IconObj = option.icon;
          const clickHandle = () => {
            popUp.set(true);
            closeHandle({ relatedTarget: null });
            setMenu(option.label2)
          };
          return (
            <Box
              mb={1}
              key={option.label2}
              className={`option ${toggle ? "show" : ""}`}
              style={{ transitionDelay: `${0.1 * index}s` }}
            >
              <Fab variant="extended" onClick={clickHandle}>
                <IconObj className="extended-icon" />
                {option.label}
              </Fab>
            </Box>
          );
        })}
      </div>
      <Fab color="primary" aria-label="add" onClick={openHandle}>
        <AddIcon className={`button-main ${toggle ? "open" : ""}`} />
      </Fab>
    </div>
  );
};
