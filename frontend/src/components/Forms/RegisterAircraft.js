import React from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText
} from "@material-ui/core";
import { TextInput } from "../TextInput/TextInput";
import "./styles.css";
import { wordCapitalization } from "../../scripts/wordManipulation";
import { callAPI } from "../../scripts/hyperledger.js";

export const RegisterAircraft = ({ popState, current, trigger }) => {
  const [data, setData] = React.useState({
    aircraft: "",
    tailNumber: "",
    company: current.owner.slice(-1)[0].company,
    image: ""
  });
  const [submitted, setSubmitted] = React.useState(false);

  const handleCancel = () => {
    setData({
      aircraft: "",
      tailNumber: "",
      company: "",
      image: ""
    });
    popState.set(false);
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    const res = await callAPI("aircraft", "POST", data);
    console.log(res);
    setSubmitted(false);
    trigger(res);
    if (res) {
      handleCancel();
    }
  };

  const handleChange = event => {
    const eventInfo = event.target;
    // console.log(event.target);
    setData(prev => {
      return { ...prev, [eventInfo.id]: eventInfo.value };
    });
  };

  return (
    <React.Fragment>
      <DialogContent className="form-box">
        <DialogContentText>
        Enregistrer un nouvel aéronef à suivre dans le réseau blockchain Hyperledger Fabric .
        </DialogContentText>
        <TextInput
          label="Nom de l'avion"
          id="aircraft"
          onChange={handleChange}
          value={data.aircraft}
          disabled={submitted}
        />
        <TextInput
          label="Numéro de la queue"
          id="tailNumber"
          onChange={handleChange}
          value={data.tailNumber}
          disabled={submitted}
        />
        <TextInput label="Entreprise" value={wordCapitalization(data.company)} />
        <TextInput
          label="Image URL"
          id="image"
          onChange={handleChange}
          value={data.image}
          disabled={submitted}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={handleCancel}
          color="primary"
          disabled={submitted}
        >
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          color="primary"
          disabled={Object.values(data).some(val => !val) || submitted}
        >
          Soumettre
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};

export default RegisterAircraft;
