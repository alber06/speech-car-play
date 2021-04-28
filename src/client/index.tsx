import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./app";
import SpeechifyClient from "./speechify";
import DataGenerator from "./generator";
import "./styles.less";
import "@webcomponents/webcomponentsjs/custom-elements-es5-adapter";


const SERVER_HOST = "http://localhost:8050";

const client = new SpeechifyClient(SERVER_HOST);
const generator = new DataGenerator();

ReactDOM.render(
  <App client={client} generator={generator} />,
  document.getElementById("root")
);
