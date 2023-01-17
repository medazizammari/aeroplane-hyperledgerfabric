import React from "react";
import "./Login.css";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { LoginCard } from "../../components/LoginCard/LoginCard";
import { TextInput } from "../../components/TextInput/TextInput";
import { AutoCompleteText } from "../../components/AutoCompleteText/AutoCompleteText";
import { useHistory } from "react-router-dom";
import { getUser } from "../../scripts/hyperledger.js";
import { wordCapitalization } from "../../scripts/wordManipulation.js";

export const Login = ({ connected, companies, userData }) => {
  const history = useHistory();
  const types = ["Administrateur", "Responsable de la maintenance"];
  const [register, setRegister] = React.useState(false);
  const [userPass, setUserPass] = React.useState({
    username: "",
    password: "",
    type: "",
    company: ""
  });
  const [validatedPass, setValidatedPass] = React.useState("");
  const [validate, setValidate] = React.useState(false);
  const [apiCalled, setAPIcalled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");

  //on password change, check validation
  React.useEffect(() => {
    setValidate(!!validatedPass && userPass.password !== validatedPass);
  }, [userPass.password, validatedPass]);

  //function for handling login procedures
  const loginHandle = async () => {
    console.log("login click");
    const data = userPass;
    delete data.verified; // remove extra key value pair
    try {
      const res = connected ? await getUser("login", data) : {user: {type: userPass.type}}; //offline response depending on connected
      console.log(res);
      userData.setInfo(res.user);
      window.sessionStorage.setItem("jwt", res.jwtToken);
      history.push("/aircraft");
    } catch (e) {
      //display error message
      setMessage("Error signing in");
      setOpen(true);
    }
  };

  //function for handling register procedures
  const registerHandle = async () => {
    console.log("register click");
    setAPIcalled(true);
    const data = userPass;
    delete data.verified; // remove extra key value pair
    const res = connected ? await getUser("register", data) : true;
    setAPIcalled(false);
    console.log(res);

    if (res) {
      loginHandle();
    } else {
      //error registering
      setMessage("Erreur d'enregistrement");
      setOpen(true);
    }
  };

  //handle closing of snackbar
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  //handle form inputs
  const onChangeUserPass = event => {
    const key = event.target.id;
    const value = event.target.value;
    setUserPass(prev => {
      return { ...prev, [key]: value };
    });
  };

  //handle autocomplete form sections
  const autocompleteOnChange = (event, handler, key, obj) => {
    let value = event.target.value;
    // console.log(value);
    if (typeof value === "number") {
      value = event.target.innerText.toLowerCase();
    }
    handler(prev => {
      return { ...prev, [key]: value || "" };
    });
  };

  return (
    <div className="login-container">
      <LoginCard
        heading={register ? "Enregistrer l'utilisateur" : "Connexion de l'utilisateur"}
        switchText={
          register ? "Connexion des utilisateurs existants" : "inscription des nouveaux utilisateurs ici"
        }
        onClick={register ? registerHandle : loginHandle}
        disabled={
          !Object.values(userPass).every(val => !!val) ||
          apiCalled ||
          validate ||
          (register && !validatedPass)
        }
        buttonText={register ? "Inscription" : "Connexion"}
        toggleClick={() => setRegister(!register)}
      >
        <TextInput
          label="Nom d'utilisateur :"
          onChange={onChangeUserPass}
          id="username"
          value={userPass.username}
        />
        <TextInput
          label="Mot de passe"
          type="password"
          onChange={onChangeUserPass}
          id="password"
          value={userPass.password}
        />
        {register && (
          <TextInput
            label="Confirmer le mot de passe"
            type="password"
            id="verified"
            onChange={event => setValidatedPass(event.target.value)}
            disabled={!userPass.password}
            error={validate}
            helperText={validate ? "passwords do not match" : ""}
          />
        )}
        <AutoCompleteText
          options={types}
          optionLabel={wordCapitalization}
          label="Role"
          onInputChange={event => {
            autocompleteOnChange(event, setUserPass, "type", types);
          }}
        />
        <AutoCompleteText
          options={companies.list}
          optionLabel={wordCapitalization}
          label="Organisation"
          freeSolo={userPass.type === "administrateur" && register}
          onInputChange={event => {
            autocompleteOnChange(event, setUserPass, "company", companies.list);
          }}
        />
      </LoginCard>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleClose}
          severity="error"
        >
          {message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Login;
