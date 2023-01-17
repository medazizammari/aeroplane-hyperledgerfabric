import React from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText
} from "@material-ui/core";
import { TextInput } from "../TextInput/TextInput";
import "./styles.css";
import { callAPI } from "../../scripts/hyperledger.js";

export const NewPart = ({ popState, current, trigger }) => {
  const [data, setData] = React.useState({
    id: "",
    name: "",
    maximumHours: ""
  });
  const [submitted, setSubmitted] = React.useState(false);

  const handleCancel = () => {
    setData({
      id: "",
      name: "",
      maximumHours: ""
    });
    popState.set(false);
  };

  const handleSubmit = async () => {
    const obj = {
      description: { id: data.id, name:data.name },
      maximumHours: data.maximumHours
    };
    setSubmitted(true);
    const res = await callAPI("part", "POST", obj);
    console.log(res);
    setSubmitted(false);
    trigger(res);
    if (res) {
      handleCancel();
    }
  };

  const handleChange = event => {
    const eventInfo = event.target;
    eventInfo.value =
      eventInfo.id === "maximumHours" &&
      Number(eventInfo.value) < 0 &&
      eventInfo.value !== ""
        ? 0
        : eventInfo.value;
    setData(prev => {
      return { ...prev, [eventInfo.id]: eventInfo.value };
    });
  };

  return (
    <React.Fragment>
      <DialogContent className="form-box">
        <DialogContentText>
        Enregistrez une nouvelle pièce à suivre dans le réseau blockchain Hyperledger Fabric.
        Hyperledger Fabric.
        </DialogContentText>
        <TextInput
          label="Pièce ID"
          id="id"
          value={data.id}
          onChange={handleChange}
          disabled={submitted}
        />
        <TextInput
          label="Description courte"
          id="name"
          value={data.name}
          onChange={handleChange}
          disabled={submitted}
        />
        <TextInput
          type="number"
          label="Heures de vol maximales"
          value={data.maximumHours}
          id="maximumHours"
          onChange={handleChange}
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
          disabled={
            data.maximumHours <= 0 ||
            Object.values(data).some(val => !val) ||
            submitted
          }
        >
          Envoyer
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};

export default NewPart;
