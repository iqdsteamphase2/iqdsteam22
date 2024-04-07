import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Amplify } from "aws-amplify";
import amplifyconfig from "./amplifyconfiguration.json";

Amplify.configure(amplifyconfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
