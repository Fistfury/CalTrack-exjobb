import { useEffect } from "react";
import { Button } from "@mui/material";
import { SignIn } from "./components/SignIn";
import { AddData } from "./components/AddData";
import { Register } from "./components/RegisterUser";

export const App = () => {
  useEffect(() => {
    console.log("Firebase App Initialized");
  }, []);

  return (
    <div>
      <h1>Welcome to CalTrack!</h1>
      <SignIn />
      <AddData />
      <Register />
      <Button variant="contained" color="primary">
        Submit
      </Button>
      ;
    </div>
  );
};
